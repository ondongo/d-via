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
import { mistral } from "@/services/rag/chatcompletion";
import { prompt } from "@/constants";

export async function POST(req: NextRequest) {
  try {
    const { text, contexts } = await req.json();
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Le texte est requis" },
        { status: 400 }
      );
    }

    // Construire le prompt avec ou sans contextes RAG
    let promptText = prompt(text);
    if (contexts && contexts.trim().length > 0) {
      promptText = `${promptText}

**Contextes de référence (devis similaires) :**
${contexts}

Utilisez ces contextes pour enrichir votre analyse et comparer avec des devis similaires.`;
    }

    const completion = await mistral.chat.completions.create({
      model: "mistral-tiny",
      temperature: 0.7,
      messages: [{ role: "user", content: promptText }],
    });

    const rawText = completion.choices[0]?.message?.content?.trim() || "";

    // Parser la réponse pour extraire reliability, details et conclusion
    const lines = rawText.split("\n").map((line:any) => line.trim());
    let reliability = null;
    const details: Record<string, string> = {};
    let conclusion = "";
    let inDetailsSection = false;
    let inConclusionSection = false;

    lines.forEach((line:any) => {
      if (
        line.toLowerCase().includes("fiabilité globale") ||
        line.toLowerCase().includes("fiabilite globale")
      ) {
        const match = line.match(/(\d+)/);
        if (match) {
          reliability = parseInt(match[1], 10);
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
          conclusion = conclusionText;
        }
      } else if (inDetailsSection && line.startsWith("-")) {
        const match = line
          .substring(1)
          .split(":")
          .map((s:any) => s.trim());
        if (match.length >= 2) {
          const key = match[0];
          const value = match.slice(1).join(":").trim();
          if (key && value) {
            details[key] = value;
          }
        }
      } else if (inConclusionSection && line.length > 0 && !conclusion) {
        conclusion = line;
      }
    });

    // Si conclusion n'a pas été trouvée, chercher dans les dernières lignes
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
      }
    }

    return NextResponse.json({
      status: 200,
      reliability,
      details,
      conclusion,
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
