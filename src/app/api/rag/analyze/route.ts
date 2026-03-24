/*****************************************************************************************************************
 * ROUTE : /api/rag/analyze
 *
 * Analyse un texte de devis avec Mistral AI (prompt structuré)
 * S'utilise AVEC /api/rag/ask : ask → récupère contextes, analyze → analyse avec contextes
 *
 * PARAMÈTRES :
 * - text (string, requis) : Texte du devis à analyser
 * - contexts (string, optionnel) : Contextes RAG récupérés depuis /api/rag/ask
 *
 * RETOUR :
 * { status: 200, reliability: number, details: object, conclusion: string }
 * ou { status: 400|500, error: string }
 *****************************************************************************************************************/
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/configs/prisma/auth";
import { prompt } from "@/constants/promptRag";
import {
  assertAnalysisAllowed,
  commitSuccessfulAnalysis,
  getClientIp,
  hashClientIp,
} from "@/data/analysis";
import { mistral } from "@/services/rag/chatcompletion";

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function extractReliability(rawText: string): number | null {
  const directPatterns = [
    /fiabilit[eé]\s*globale\s*[:\-]?\s*(\d{1,3})\s*\/\s*100/i,
    /fiabilit[eé]\s*globale\s*[:\-]?\s*(\d{1,3})/i,
    /score\s*global\s*[:\-]?\s*(\d{1,3})\s*\/\s*100/i,
    /score\s*global\s*[:\-]?\s*(\d{1,3})/i,
  ];

  for (const pattern of directPatterns) {
    const match = rawText.match(pattern);
    if (match?.[1]) {
      return clampScore(parseInt(match[1], 10));
    }
  }

  const fractionMatch = rawText.match(/(\d{1,3})\s*\/\s*100/);
  if (fractionMatch?.[1]) {
    return clampScore(parseInt(fractionMatch[1], 10));
  }

  return null;
}

function cleanMarkdownText(value: string) {
  return String(value || "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/`/g, "")
    .replace(/^\s*[-*•]\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatPercent(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toString().replace(".", ",");
}

function extractPercentages(text: string) {
  const matches = cleanMarkdownText(text).match(/(\d+(?:[.,]\d+)?)\s*%/g) || [];
  return matches
    .map((item) => parseFloat(item.replace("%", "").replace(",", ".")))
    .filter((value) => !Number.isNaN(value));
}

function buildAcompteSummary(source: string) {
  const percentages = extractPercentages(source);
  if (percentages.length === 0) {
    return {
      message: "Acompte mentionné sans pourcentage précis (Recommandé: 30%)",
      total: null as number | null,
    };
  }

  if (percentages.length === 1) {
    return {
      message: `${formatPercent(percentages[0])}% demandé (Recommandé: 30%)`,
      total: percentages[0],
    };
  }

  const first = percentages[0];
  const others = percentages.slice(1);
  const total = percentages.reduce((sum, current) => sum + current, 0);
  const othersText = others.map((value) => `${formatPercent(value)}%`).join(" puis ");

  return {
    message: `${formatPercent(first)}% à la commande puis ${othersText} (${formatPercent(total)}% avant solde, Recommandé: 30%)`,
    total,
  };
}

function extractAcompteFromSource(text: string) {
  const normalizedLines = text.split("\n").map((line) => cleanMarkdownText(line));
  const acompteLines = normalizedLines.filter((line) => {
    const lower = line
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return (
      lower.includes("acompte") ||
      lower.includes("accompte") ||
      lower.includes("avance")
    );
  });

  if (acompteLines.length === 0) {
    return undefined;
  }

  return buildAcompteSummary(acompteLines.join(" "));
}

function normalizeForCompare(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function countAlertSignals(details: Record<string, string>) {
  const alertKeywords = [
    "invalide",
    "absent",
    "manque",
    "non conforme",
    "risque",
    "suspect",
    "ambigu",
    "alerte",
    "incoherent",
    "trop eleve",
    "trop bas",
  ];

  let count = 0;
  Object.values(details).forEach((value) => {
    const normalized = normalizeForCompare(cleanMarkdownText(value));
    if (alertKeywords.some((keyword) => normalized.includes(keyword))) {
      count += 1;
    }
  });

  return count;
}

function adjustReliabilityScore(
  inputScore: number,
  details: Record<string, string>,
  siretInfo?: { isValid?: boolean },
  acompteTotal?: number | null,
) {
  let score = inputScore;

  const alertCount = countAlertSignals(details);
  score -= Math.min(22, alertCount * 5);

  if (siretInfo?.isValid === false) {
    score -= 28;
  }

  if (typeof acompteTotal === "number") {
    if (acompteTotal > 40) {
      score -= 16;
    } else if (acompteTotal > 30) {
      score -= 10;
    }
  }

  // Evite un score trop haut quand les alertes sont nombreuses.
  if (alertCount >= 3 && score > 58) {
    score = 58;
  }

  return clampScore(score);
}

function extractArtisanName(text: string, siretInfo?: { nomEntreprise?: string }): string | null {
  if (siretInfo?.nomEntreprise) return siretInfo.nomEntreprise;
  const patterns = [
    /(?:Nom de l['']entreprise|Raison sociale|Soci[eé]t[eé]|Prestataire)\s*:?\s*([^\n]+)/i,
    /^((?:SARL|SAS|EURL|SA|SASU|EI|Ets?\.?)\s+[A-Za-zÀ-ÿ\s&''-]+)/m,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return cleanMarkdownText(match[1]).slice(0, 60);
  }
  return null;
}

function extractMontantTotal(text: string): string | null {
  const patterns = [
    /(?:Total TTC|Total\s+T\.T\.C\.?|Montant TTC|NET\s+[AÀ]\s+PAYER|Net\s+[aà]\s+payer|Total\s+[aà]\s+payer)\s*:?\s*([\d\s.,]+\s*€?)/i,
    /(?:Total HT|Montant HT|Total\s+H\.T\.?)\s*:?\s*([\d\s.,]+\s*€?)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const val = cleanMarkdownText(match[1]).trim();
      if (val) return val.includes("€") ? val : `${val} €`;
    }
  }
  return null;
}

function extractDateEmission(text: string): string | null {
  const patterns = [
    /(?:Date\s+(?:d[''']?[eé]mission|du devis|de facturation|d[''']?[eé]tablissement))\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /(?:[EÉ]mis le|[EÉ]tabli le|Fait le)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /(?:^|[\s,;])Date\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/im,
    /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

/*****************************************************************************************************************
 * Fonction pour extraire le SIRET du texte
 *****************************************************************************************************************/
function extractSiret(text: string): string | undefined {
  const withLabel = text.match(/SIRET\s*:?\s*([0-9][0-9\s]{10,25})/i);
  if (withLabel?.[1]) {
    const digits = withLabel[1].replace(/\D/g, "");
    if (digits.length >= 14) {
      return digits.slice(0, 14);
    }
  }

  // Fallback: premier bloc de 14 chiffres trouvé, même avec espaces.
  const generic = text.match(/(?:\d[\s.]*){14}/);
  if (generic?.[0]) {
    const digits = generic[0].replace(/\D/g, "");
    if (digits.length === 14) {
      return digits;
    }
  }

  return undefined;
}

/*****************************************************************************************************************
 * Fonction pour vérifier le SIRET via l'API Sirene
 *****************************************************************************************************************/
async function verifySiret(siret: string, request: NextRequest) {
  try {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    
    const response = await fetch(`${baseUrl}/api/verify_siret`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ siret }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    console.log("verifySiret>>>>>:", data);
    return {
      siret,
      isValid: data.isExist === true,
      nomEntreprise: data.nomEntreprise || undefined,
      dateCreation: data.dateCreation || undefined,
      adresse: data.adresse || undefined,
    };
  } catch (error) {
    console.error("Erreur lors de la vérification SIRET:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, contexts, fileName } = await req.json();
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Le texte est requis" },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id ?? null;
    const ipHash = hashClientIp(getClientIp(req));
    const gate = await assertAnalysisAllowed({ userId, ipHash });
    if (gate.ok === false) {
      return NextResponse.json(
        { status: gate.status, error: gate.message },
        { status: gate.status },
      );
    }
    let siretInfo: {
      siret?: string;
      isValid?: boolean;
      nomEntreprise?: string;
      dateCreation?: string;
      adresse?: string;
    } | undefined = undefined;

    const extractedSiret = extractSiret(text);
    if (extractedSiret) {
      siretInfo = await verifySiret(extractedSiret, req);
      if (!siretInfo) {
        siretInfo = {
          siret: extractedSiret,
          isValid: false,
        };
      }
    }

    /*****************************************************************************************************************
     * Construire le prompt avec contextes RAG et informations SIRET
    *****************************************************************************************************************/
    const promptText = prompt(text, contexts, siretInfo);

    const completion = await mistral.chat.completions.create({
      model: "mistral-tiny",
      temperature: 0.2,
      messages: [{ role: "user", content: promptText }],
    });

    const rawText = completion.choices[0]?.message?.content?.trim() || "";

    
    const lines = rawText.split("\n").map((line:any) => line.trim());
    let reliability: number | null = extractReliability(rawText);
    const details: Record<string, string> = {};
    let conclusion = "";
    let inDetailsSection = false;
    let inConclusionSection = false;

    lines.forEach((line:any) => {
      if (
        line.toLowerCase().includes("fiabilité globale") ||
        line.toLowerCase().includes("fiabilite globale") ||
        line.toLowerCase().includes("score global")
      ) {
        const lineReliability = extractReliability(line);
        if (lineReliability !== null) {
          reliability = lineReliability;
        }
      } else if (
        line.toLowerCase().includes("détails") ||
        line.toLowerCase().includes("details")
      ) {
        inDetailsSection = true;
        inConclusionSection = false;
      } else if (line.toLowerCase().includes("conclusion")) {
        inDetailsSection = false;
        inConclusionSection = true;
        const conclusionText = line
          .replace(/^.*conclusion\s*:?\s*/i, "")
          .trim();
        if (conclusionText) {
          conclusion = cleanMarkdownText(conclusionText);
        }
      } else if (
        inDetailsSection &&
        (line.startsWith("-") || line.startsWith("*") || line.startsWith("•"))
      ) {
        const match = line
          .substring(1)
          .split(":")
          .map((s:any) => s.trim());
        if (match.length >= 2) {
          const key = cleanMarkdownText(match[0]);
          const value = cleanMarkdownText(match.slice(1).join(":").trim());
          if (key && value) {
            details[key] = value;
          }
        }
      } else if (inConclusionSection && line.length > 0 && !conclusion) {
        conclusion = cleanMarkdownText(line);
      }
    });

    /*****************************************************************************************************************
     * Si conclusion n'a pas été trouvée, chercher dans les dernières lignes
    *****************************************************************************************************************/
    if (!conclusion) {
      const conclusionIndex = lines.findIndex((line:any) =>
        line.toLowerCase().includes("conclusion")
      );
      if (conclusionIndex >= 0 && conclusionIndex < lines.length - 1) {
        conclusion = lines
          .slice(conclusionIndex + 1)
          .filter((l:any) => l.length > 0)
          .join(" ")
          .trim();
        conclusion = cleanMarkdownText(conclusion);
      }
    }

    if (reliability === null) {
      reliability = 60;
    }

    const hasAcompteDetail = Object.keys(details).some((key) => {
      const normalizedKey = normalizeForCompare(key);
      return (
        normalizedKey.includes("acompte") ||
        normalizedKey.includes("accompte") ||
        normalizedKey.includes("avance")
      );
    });

    // Toujours privilégier le texte source pour éviter les hallucinations
    // du modèle sur l'acompte.
    const acompteFromSource = extractAcompteFromSource(text);
    if (acompteFromSource) {
      details.Acompte = acompteFromSource.message;
    } else if (!hasAcompteDetail) {
      details.Acompte = "Acompte non précisé (Recommandé: 30%)";
    }

    // SIRET: on force la réalité de la vérification API.
    if (siretInfo?.isValid === false) {
      details["Numéro de SIRET"] = `Invalide ou introuvable (SIRET ${siretInfo.siret || "non lisible"}, vérification Sirene échouée)`;
      conclusion = "Le devis présente des risques notables: le SIRET est invalide ou introuvable. Vérifiez impérativement l'entreprise avant signature.";
    } else if (siretInfo?.isValid === true && siretInfo.siret) {
      details["Numéro de SIRET"] = `Validé (${siretInfo.siret})`;
    }

    reliability = adjustReliabilityScore(
      reliability,
      details,
      siretInfo,
      acompteFromSource?.total,
    );

    try {
      await commitSuccessfulAnalysis({
        userId,
        ipHash,
        fileName:
          typeof fileName === "string" && fileName.trim().length > 0
            ? fileName.trim()
            : null,
        reliability: reliability ?? 0,
      });
    } catch (e) {
      console.error("commitSuccessfulAnalysis:", e);
    }

    return NextResponse.json({
      status: 200,
      reliability,
      details,
      conclusion,
      artisanName: extractArtisanName(text, siretInfo) ?? null,
      montantTotal: extractMontantTotal(text) ?? null,
      dateEmission: extractDateEmission(text) ?? null,
    });
  } catch (error) {
    console.error("Erreur lors de l'analyse :", error);
    return NextResponse.json(
      {
        status: 500,
        error: "Erreur serveur lors de l'analyse du texte.",
      },
      { status: 500 }
    );
  }
}
