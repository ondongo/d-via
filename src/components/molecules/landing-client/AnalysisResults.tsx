"use client";
import { ICONS } from "@/constants/icons";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { useEffect, useState } from "react";

type AnalysisPayload = {
  reliability: number | null;
  details: Record<string, string>;
  conclusion: string;
};

type AnalysisResultsProps = {
  isLoading: boolean;
  isAnalyzed: boolean;
  analysis: AnalysisPayload;
  handleShareResults: () => void;
  resultsRef: React.RefObject<HTMLDivElement | null>;
  /** Affiche la bannière "artisans alternatifs" si le score est insuffisant */
  showAlternativeBanner?: boolean;
};

type GradeTheme = {
  letter: "A" | "B" | "C" | "D";
  title: string;
  subtitle: string;
  badgeBg: string;
  badgeText: string;
  scoreBg: string;
  scoreText: string;
};

const DEFAULT_ACOMPTE_MESSAGE = "Acompte non précisé (Recommandé: 30%)";

const POSITIVE_KEYWORDS = [
  "valid",
  "conforme",
  "cohérent",
  "coherent",
  "aligné",
  "complet",
  "ok",
  "réaliste",
  "realiste",
  "présent",
  "present",
];

const WARNING_KEYWORDS = [
  "manque",
  "recommand",
  "attention",
  "à vérifier",
  "a verifier",
  "partiel",
  "incomplet",
  "incomplète",
  "different",
  "différent",
  "différente",
  "non credible",
  "non crédible",
  "ambigu",
  "modéré",
  "modere",
  "moyen",
];

const NEGATIVE_KEYWORDS = [
  "invalide",
  "non conforme",
  "absent",
  "risque",
  "suspect",
  "incohérent",
  "incoherent",
  "trop élevé",
  "trop eleve",
  "trop bas",
  "erreur",
];

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function stripMarkdown(text: string) {
  return String(text || "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/`/g, "")
    .replace(/^\s*[-*•]\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(rawKey: string) {
  const cleaned = stripMarkdown(rawKey);
  const normalized = cleaned
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized.includes("materiau") || normalized.includes("tendance du marche")) {
    return "Prix des materiaux";
  }
  if (
    normalized.includes("main d'oeuvre") ||
    normalized.includes("main d oeuvre") ||
    normalized.includes("main doeuvre") ||
    normalized.includes("tarif horaire")
  ) {
    return "Main d'oeuvre";
  }
  if (normalized.includes("garantie") || normalized.includes("assurance")) {
    return "Garanties legales";
  }
  if (
    normalized.includes("acompte") ||
    normalized.includes("accompte") ||
    normalized.includes("avance")
  ) {
    return "Acompte";
  }

  return cleaned || "Critere";
}

function formatPercent(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toString().replace(".", ",");
}

function extractPercentages(text: string) {
  const matches = stripMarkdown(text).match(/(\d+(?:[.,]\d+)?)\s*%/g) || [];
  return matches
    .map((item) => parseFloat(item.replace("%", "").replace(",", ".")))
    .filter((value) => !Number.isNaN(value));
}

function getAcompteLevel(value: string): "positive" | "warning" | "negative" {
  const sourceForParsing = stripMarkdown(value).split("(")[0].trim();
  const percentages = extractPercentages(sourceForParsing);
  const total = percentages.reduce((sum, current) => sum + current, 0);

  if (total <= 0) return "warning";
  if (total <= 30) return "positive";
  if (total <= 40) return "warning";
  return "negative";
}

function formatAcompteMessage(rawValue?: string) {
  if (!rawValue || !stripMarkdown(rawValue)) {
    return DEFAULT_ACOMPTE_MESSAGE;
  }

  const cleanValue = stripMarkdown(rawValue);

  if (/recommand[ée]?\s*:\s*30%/i.test(cleanValue)) {
    return cleanValue;
  }

  const sourceForParsing = cleanValue.split("(")[0].trim();
  const percentages = extractPercentages(sourceForParsing);

  if (percentages.length === 0) {
    return `${cleanValue} (Recommandé: 30%)`;
  }

  if (percentages.length === 1) {
    return `${formatPercent(percentages[0])}% demandé (Recommandé: 30%)`;
  }

  const first = percentages[0];
  const others = percentages.slice(1);
  const total = percentages.reduce((sum, current) => sum + current, 0);
  const othersText = others.map((value) => `${formatPercent(value)}%`).join(" puis ");

  return `${formatPercent(first)}% à la commande puis ${othersText} (${formatPercent(total)}% avant solde, Recommandé: 30%)`;
}

function normalizeDetails(details: Record<string, string>) {
  const normalized: Record<string, string> = {};

  Object.entries(details || {}).forEach(([key, value]) => {
    const canonicalKey = normalizeKey(key);
    const cleanValue = stripMarkdown(String(value));
    if (cleanValue) {
      if (canonicalKey === "Acompte") {
        normalized[canonicalKey] = cleanValue;
      } else if (normalized[canonicalKey]) {
        normalized[canonicalKey] = `${normalized[canonicalKey]} ${cleanValue}`;
      } else {
        normalized[canonicalKey] = cleanValue;
      }
    }
  });

  normalized.Acompte = formatAcompteMessage(normalized.Acompte);

  return normalized;
}

function classifyDetail(value: string): "positive" | "warning" | "negative" {
  const normalized = stripMarkdown(value).toLowerCase();

  if (NEGATIVE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "negative";
  }

  if (WARNING_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "warning";
  }

  if (normalized.includes("mais")) {
    return "warning";
  }

  if (POSITIVE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "positive";
  }

  return "warning";
}

function classifyDetailByKey(
  key: string,
  value: string,
): "positive" | "warning" | "negative" {
  const normalizedKey = normalizeKey(key);
  if (normalizedKey === "Acompte") {
    return getAcompteLevel(value);
  }
  return classifyDetail(value);
}

function buildAiOpinion(
  conclusion: string,
  details: Record<string, string>,
  score: number,
) {
  const lines: string[] = [];
  const cleanConclusion = stripMarkdown(conclusion);

  if (cleanConclusion) {
    lines.push(cleanConclusion);
  } else if (score >= 80) {
    lines.push("Ce devis respecte les standards du marché avec un niveau de fiabilité élevé.");
  } else if (score >= 60) {
    lines.push("Ce devis est globalement correct mais demande quelques vérifications avant signature.");
  } else {
    lines.push("Ce devis présente des points de vigilance importants avant de vous engager.");
  }

  if (details["Prix des materiaux"]) {
    lines.push(`Prix des matériaux: ${details["Prix des materiaux"]}.`);
  }
  if (details["Main d'oeuvre"]) {
    lines.push(`Main d'oeuvre: ${details["Main d'oeuvre"]}.`);
  }
  if (details["Garanties legales"]) {
    lines.push(`Garanties légales: ${details["Garanties legales"]}.`);
  }

  lines.push(`Acompte: ${details.Acompte || DEFAULT_ACOMPTE_MESSAGE}.`);

  return lines.slice(0, 10).join("\n");
}

function estimateScoreFromDetails(details: Record<string, string>) {
  const values = Object.values(details || {});
  if (values.length === 0) return 60;

  let score = 65;
  values.forEach((value) => {
    const sentiment = classifyDetail(String(value));
    if (sentiment === "positive") score += 6;
    if (sentiment === "warning") score -= 4;
    if (sentiment === "negative") score -= 12;
  });

  return clampScore(score);
}

function getGradeTheme(score: number): GradeTheme {
  if (score >= 85) {
    return {
      letter: "A",
      title: "Excellent",
      subtitle: "Identité, prix et garanties validés",
      badgeBg: "#00DD9E",
      badgeText: "#043327",
      scoreBg: "#009B6F",
      scoreText: "#E9FFF8",
    };
  }

  if (score >= 70) {
    return {
      letter: "B",
      title: "Bon",
      subtitle: "Quelques vérifications recommandées",
      badgeBg: "#FFC671",
      badgeText: "#4A3004",
      scoreBg: "#E09E3B",
      scoreText: "#FFF7E9",
    };
  }

  if (score >= 50) {
    return {
      letter: "C",
      title: "Moyen",
      subtitle: "Points de vigilance à vérifier",
      badgeBg: "#F4C6C4",
      badgeText: "#5A1D1A",
      scoreBg: "#D69492",
      scoreText: "#FFF3F3",
    };
  }

  return {
    letter: "D",
    title: "Critique",
    subtitle: "Risque élevé, ne pas signer sans contrôle",
    badgeBg: "#340100",
    badgeText: "#FFFFFF",
    scoreBg: "#340100",
    scoreText: "#FFFFFF",
  };
}

export default function AnalysisResults({
  isLoading,
  isAnalyzed,
  analysis,
  handleShareResults,
  resultsRef,
  showAlternativeBanner = false,
}: AnalysisResultsProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<"resume" | "details">("resume");

  const normalizedDetails = normalizeDetails(analysis?.details || {});
  const fallbackScore = estimateScoreFromDetails(normalizedDetails);
  const normalizedScore = clampScore(
    typeof analysis?.reliability === "number" ? analysis.reliability : fallbackScore,
  );
  const gradeTheme = getGradeTheme(normalizedScore);
  const detailEntries = Object.entries(normalizedDetails);
  const aiOpinion = buildAiOpinion(
    analysis?.conclusion || "",
    normalizedDetails,
    normalizedScore,
  );

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95;
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isLoading]);

  return (
    <div
      ref={resultsRef}
      className={`${isAnalyzed ? "bg-white" : "bg-transparent"} rounded-xl p-6 md:p-8 w-full max-w-4xl mx-auto shadow-sm`}
    >
      {isLoading ? (
        <>
          <div className="flex flex-col items-center gap-4">
            <img
              src={ICONS.quoteAnalysis}
              alt="Quick reference"
              className="w-16 h-16"
            />
            <p className="text-md text-dvianeutral-10 text-center font-medium">
              Analyse en cours
            </p>
            <p className="text-sm text-gray-500 text-center">
              Notre IA analyse en détail votre devis. Cela prendra quelques instants.
            </p>
          </div>
          <div className="relative w-full h-2.5 overflow-hidden rounded-3xl bg-white">
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: `${progress}%`, transition: "width 0.1s ease-out" }}
              className="flex h-full items-center justify-center bg-dviaprimary-60 text-white rounded-3xl"
            />
          </div>
        </>
      ) : (
        isAnalyzed &&
        analysis && (
          <div className="flex flex-col gap-6 mt-4">

            {/* Bannière artisans alternatifs — visible si score < 70 */}
            {showAlternativeBanner && normalizedScore < 70 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-dviaprimary-40 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      Trouver une alternative
                    </p>
                    <p className="text-white/80 text-xs">
                      3 artisans fiables disponibles pour ce projet
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    router.push("/dashboard/clients/artisans-recommandes")
                  }
                  className="shrink-0 bg-white text-dviaprimary-40 text-sm font-semibold px-5 py-2 rounded-8px hover:bg-dvianeutral-96 transition-colors cursor-pointer"
                >
                  Voir les artisans →
                </button>
              </div>
            )}

            {/* Onglets de navigation entre sections */}
            <div className="flex gap-1 bg-dvianeutral-94 rounded-8px p-1 self-start">
              <button
                onClick={() => setActiveSection("resume")}
                className={`text-sm font-medium px-4 py-2 rounded-8px transition-colors cursor-pointer ${
                  activeSection === "resume"
                    ? "bg-white text-dvianeutral-10 shadow-sm"
                    : "text-dvianeutralvariant-60 hover:text-dvianeutral-10"
                }`}
              >
                Résumé
              </button>
              <button
                onClick={() => setActiveSection("details")}
                className={`text-sm font-medium px-4 py-2 rounded-8px transition-colors cursor-pointer ${
                  activeSection === "details"
                    ? "bg-white text-dvianeutral-10 shadow-sm"
                    : "text-dvianeutralvariant-60 hover:text-dvianeutral-10"
                }`}
              >
                Détails
              </button>
            </div>

            {/* ── Section Résumé ── */}
            {activeSection === "resume" && (
              <>
                <div className="rounded-[28px] bg-white p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-display-small md:text-display-medium leading-none font-bold text-[#372F2D]">
                        {gradeTheme.title}
                      </h3>
                      <p className="mt-3 text-body-large md:text-body-medium text-[#5E5E5E]">
                        {gradeTheme.subtitle}
                      </p>
                    </div>
                    <div className="relative flex flex-col items-center">
                      <div
                        className="w-[96px] h-[96px] md:w-[120px] md:h-[120px] rounded-full flex items-center justify-center text-[46px] md:text-[54px] font-semibold"
                        style={{
                          backgroundColor: gradeTheme.badgeBg,
                          color: gradeTheme.badgeText,
                        }}
                      >
                        {gradeTheme.letter}
                      </div>
                      <div
                        className="absolute -bottom-3 px-3 py-1 rounded-full text-[24px] md:text-[28px] font-semibold"
                        style={{
                          backgroundColor: gradeTheme.scoreBg,
                          color: gradeTheme.scoreText,
                        }}
                      >
                        {normalizedScore}/100
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] bg-white p-6 md:p-8">
                  <h4 className="text-[24px] md:text-[28px] font-semibold text-[#2E2E2E] mb-3">
                    L&apos;avis de l&apos;IA
                  </h4>
                  <p className="text-[18px] md:text-[24px] leading-relaxed text-[#4D4D4D] whitespace-pre-line">
                    {aiOpinion}
                  </p>
                </div>

                <button
                  onClick={() => setActiveSection("details")}
                  className="self-start text-sm font-medium text-dviaprimary-40 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  Voir les détails de l&apos;analyse
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </>
            )}

            {/* ── Section Détails ── */}
            {activeSection === "details" && (
              <div className="rounded-[24px] bg-white p-6 md:p-8">
                <h4 className="text-[24px] md:text-[30px] font-semibold text-[#2E2E2E] mb-6">
                  Détail de l&apos;analyse
                </h4>
                <div className="space-y-1">
                  {detailEntries.length === 0 && (
                    <p className="text-gray-600">
                      Aucun détail disponible pour cette analyse.
                    </p>
                  )}
                  {detailEntries.map(([key, value], index) => {
                    const sentiment = classifyDetailByKey(String(key), String(value));
                    const icon =
                      sentiment === "negative" ? (
                        <FiAlertCircle className="text-[#D55350]" size={30} />
                      ) : sentiment === "warning" ? (
                        <FiAlertTriangle className="text-[#E3A23E]" size={30} />
                      ) : (
                        <FiCheckCircle className="text-[#00B983]" size={30} />
                      );
                    return (
                      <div
                        key={key}
                        className={`py-4 ${
                          index < detailEntries.length - 1
                            ? "border-b border-[#E5E5E5]"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">{icon}</div>
                          <div>
                            <p className="text-[26px] md:text-[32px] leading-tight font-semibold text-[#2F2A2A]">
                              {stripMarkdown(key)}
                            </p>
                            <p className="text-[20px] md:text-[24px] text-[#868686] mt-1">
                              {stripMarkdown(String(value))}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Barre d'actions ── */}
            <div className="mt-4 flex flex-col md:flex-row justify-between gap-4">
              <button
                onClick={() =>
                  router.push("/dashboard/clients/analyse-comparative")
                }
                className="cursor-pointer border border-dvianeutral-50 text-dvianeutralvariant-40 hover:border-dviaprimary-40 hover:text-dviaprimary-40 font-medium py-2 px-4 rounded-8px transition text-sm flex items-center gap-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Analyse comparative
              </button>

              <div className="flex flex-col md:flex-row gap-3">
                <button
                  className="cursor-pointer border border-dviaprimary-40 text-dviaprimary-40 hover:bg-dviaprimary-70 hover:text-white font-medium py-2 px-4 rounded-md transition text-sm"
                  onClick={handleShareResults}
                >
                  Partager l&apos;analyse
                </button>
                <button
                  className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-8 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer flex items-center justify-center gap-2"
                  onClick={() =>
                    router.push("/dashboard/clients/artisans-recommandes")
                  }
                >
                  Trouver des artisans
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
