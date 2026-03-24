"use client";
import { ICONS } from "@/constants/icons";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type AnalysisPayload = {
  reliability: number | null;
  details: Record<string, string>;
  conclusion: string;
  artisanName?: string | null;
  montantTotal?: string | null;
  dateEmission?: string | null;
};

type AnalysisResultsProps = {
  isLoading: boolean;
  isAnalyzed: boolean;
  analysis: AnalysisPayload;
  handleShareResults: () => void;
  resultsRef: React.RefObject<HTMLDivElement | null>;
  showAlternativeBanner?: boolean;
  variant?: "dashboard" | "modal";
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
  if (
    normalized.includes("materiau") ||
    normalized.includes("tendance du marche")
  )
    return "Prix des matériaux";
  if (
    normalized.includes("main d'oeuvre") ||
    normalized.includes("main d oeuvre") ||
    normalized.includes("main doeuvre") ||
    normalized.includes("tarif horaire")
  )
    return "Main d'oeuvre";
  if (normalized.includes("garantie") || normalized.includes("assurance"))
    return "Garanties légales";
  if (
    normalized.includes("acompte") ||
    normalized.includes("accompte") ||
    normalized.includes("avance")
  )
    return "Acompte";
  return cleaned || "Critère";
}

function formatPercent(value: number) {
  return Number.isInteger(value)
    ? `${value}`
    : value.toString().replace(".", ",");
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
  if (!rawValue || !stripMarkdown(rawValue)) return DEFAULT_ACOMPTE_MESSAGE;
  const cleanValue = stripMarkdown(rawValue);
  if (/recommand[ée]?\s*:\s*30%/i.test(cleanValue)) return cleanValue;
  const sourceForParsing = cleanValue.split("(")[0].trim();
  const percentages = extractPercentages(sourceForParsing);
  if (percentages.length === 0) return `${cleanValue} (Recommandé: 30%)`;
  if (percentages.length === 1)
    return `${formatPercent(percentages[0])}% demandé (Recommandé: 30%)`;
  const first = percentages[0];
  const others = percentages.slice(1);
  const total = percentages.reduce((sum, current) => sum + current, 0);
  const othersText = others
    .map((value) => `${formatPercent(value)}%`)
    .join(" puis ");
  return `${formatPercent(first)}% à la commande puis ${othersText} (${formatPercent(total)}% avant solde, Recommandé: 30%)`;
}

function normalizeDetails(details: Record<string, string>) {
  const normalized: Record<string, string> = {};
  Object.entries(details || {}).forEach(([key, value]) => {
    const canonicalKey = normalizeKey(key);
    const cleanValue = stripMarkdown(String(value));
    if (cleanValue) {
      if (canonicalKey === "Acompte") normalized[canonicalKey] = cleanValue;
      else if (normalized[canonicalKey])
        normalized[canonicalKey] = `${normalized[canonicalKey]} ${cleanValue}`;
      else normalized[canonicalKey] = cleanValue;
    }
  });
  normalized.Acompte = formatAcompteMessage(normalized.Acompte);
  return normalized;
}

function classifyDetail(value: string): "positive" | "warning" | "negative" {
  const normalized = stripMarkdown(value).toLowerCase();
  if (NEGATIVE_KEYWORDS.some((k) => normalized.includes(k))) return "negative";
  if (WARNING_KEYWORDS.some((k) => normalized.includes(k))) return "warning";
  if (normalized.includes("mais")) return "warning";
  if (POSITIVE_KEYWORDS.some((k) => normalized.includes(k))) return "positive";
  return "warning";
}

function classifyDetailByKey(
  key: string,
  value: string,
): "positive" | "warning" | "negative" {
  const normalizedKey = normalizeKey(key);
  if (normalizedKey === "Acompte") return getAcompteLevel(value);
  return classifyDetail(value);
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
  if (score >= 85)
    return {
      letter: "A",
      title: "Excellent",
      subtitle: "Prix et garanties validés",
      badgeBg: "#00DD9E",
      badgeText: "#043327",
      scoreBg: "#009B6F",
      scoreText: "#E9FFF8",
    };
  if (score >= 70)
    return {
      letter: "B",
      title: "Bon",
      subtitle: "Quelques vérifications recommandées",
      badgeBg: "#FFC671",
      badgeText: "#4A3004",
      scoreBg: "#E09E3B",
      scoreText: "#FFF7E9",
    };
  if (score >= 50)
    return {
      letter: "C",
      title: "Moyen",
      subtitle: "Points de vigilance à vérifier",
      badgeBg: "#F4C6C4",
      badgeText: "#5A1D1A",
      scoreBg: "#D69492",
      scoreText: "#FFF3F3",
    };
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

function buildFirstConclusion(conclusion: string, score: number) {
  const clean = stripMarkdown(conclusion);
  if (clean) {
    const sentences = clean.split(/(?<=[.!?])\s+/);
    return sentences.slice(0, 2).join(" ");
  }
  if (score >= 80)
    return "Ce devis respecte les standards du marché. L'artisan est vérifié et les matériaux sont correctement tarifés.";
  if (score >= 60)
    return "Ce devis est globalement correct mais demande quelques vérifications avant signature.";
  return "Ce devis présente des points de vigilance importants avant de vous engager.";
}

const PROFESSION_MATCHES: Array<[string, string[]]> = [
  ["plomberie", ["plombier", "plomberie"]],
  ["electricite", ["electricien", "electricite", "electrique", "courant"]],
  ["maconnerie", ["macon", "maconnerie", "beton", "parpaing", "fondation"]],
  ["carrelage", ["carreleur", "carrelage", "faience", "revetement sol"]],
  ["peinture", ["peintre", "peinture", "enduit", "papier peint"]],
  [
    "toiture",
    ["couvreur", "toiture", "couverture", "tuile", "ardoise", "zinguerie"],
  ],
  ["menuiserie", ["menuisier", "menuiserie", "porte", "fenetre", "volet"]],
  ["charpente", ["charpentier", "charpente", "ossature bois"]],
  ["platrerie", ["plaquiste", "cloison", "platre", "faux plafond"]],
  [
    "chauffage",
    [
      "chauffagiste",
      "chauffage",
      "chaudiere",
      "poele",
      "climatisation",
      "vmr",
      "vmc",
    ],
  ],
  ["isolation", ["isolation", "isolant", "thermique", "phonique"]],
  ["terrassement", ["terrassier", "terrassement", "excavation", "nivellement"]],
  ["jardinage", ["jardinier", "jardinage", "espaces verts", "elagage"]],
  ["vitrerie", ["vitrier", "vitrerie", "double vitrage", "vitrage"]],
  ["serrurerie", ["serrurier", "serrurerie", "verrou", "interphone"]],
  ["ravalement", ["facade", "ravalement", "bardage", "isolation exterieure"]],
];

function extractProfession(
  conclusion: string,
  details: Record<string, string>,
): string {
  const rawText = [conclusion, ...Object.values(details)].join(" ");
  const normalized = rawText
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  for (const [label, keywords] of PROFESSION_MATCHES) {
    for (const kw of keywords) {
      if (normalized.includes(kw)) return label;
    }
  }
  return "";
}

function buildNegotiationTip(details: Record<string, string>, score: number) {
  const acompte = details["Acompte"] || "";
  if (acompte && getAcompteLevel(acompte) !== "positive") {
    return "L'acompte est trop élevé. Proposez 30% à la signature et le solde à l'achèvement.";
  }
  if (score < 70)
    return "Demandez des devis comparatifs à d'autres artisans pour négocier les tarifs.";
  return "Les tarifs sont cohérents. Vous pouvez négocier les délais de paiement.";
}

export default function AnalysisResults({
  isLoading,
  isAnalyzed,
  analysis,
  handleShareResults,
  resultsRef,
  showAlternativeBanner = false,
  variant = "dashboard",
}: AnalysisResultsProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRiskPopup, setShowRiskPopup] = useState(false);
  const totalPages = 2;

  const normalizedDetails = normalizeDetails(analysis?.details || {});
  const fallbackScore = estimateScoreFromDetails(normalizedDetails);
  const normalizedScore = clampScore(
    typeof analysis?.reliability === "number"
      ? analysis.reliability
      : fallbackScore,
  );
  const gradeTheme = getGradeTheme(normalizedScore);
  const detailEntries = Object.entries(normalizedDetails);

  const profession = extractProfession(
    analysis?.conclusion || "",
    normalizedDetails,
  );
  const recommUrl = profession
    ? `/dashboard/clients/artisans-recommandes?search=${encodeURIComponent(profession)}`
    : "/dashboard/clients/artisans-recommandes";
  const aiOpinion = buildFirstConclusion(
    analysis?.conclusion || "",
    normalizedScore,
  );
  const negotiationTip = buildNegotiationTip(
    normalizedDetails,
    normalizedScore,
  );

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? 95 : prev + 1));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isAnalyzed && normalizedScore < 65) {
      const timer = setTimeout(() => setShowRiskPopup(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzed, normalizedScore]);

  const DetailIcon = ({
    sentiment,
  }: {
    sentiment: "positive" | "warning" | "negative";
  }) => {
    if (sentiment === "negative")
      return <FiAlertCircle className="text-[#D55350]" size={20} />;
    if (sentiment === "warning")
      return <FiAlertTriangle className="text-[#E3A23E]" size={20} />;
    return <FiCheckCircle className="text-[#00B983]" size={20} />;
  };

  if (isLoading) {
    return (
      <div
        ref={resultsRef}
        className="bg-white rounded-xl p-6 md:p-8 w-full max-w-4xl mx-auto shadow-sm"
      >
        <div className="flex flex-col items-center gap-4">
          <img src={ICONS.quoteAnalysis} alt="Analyse" className="w-16 h-16" />
          <p className="text-md text-dvianeutral-10 text-center font-medium">
            Analyse en cours
          </p>
          <p className="text-sm text-gray-500 text-center">
            Notre IA analyse en détail votre devis. Cela prendra quelques
            instants.
          </p>
        </div>
        <div className="relative w-full h-2.5 overflow-hidden rounded-3xl bg-white mt-4">
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: `${progress}%`, transition: "width 0.1s ease-out" }}
            className="flex h-full items-center justify-center bg-dviaprimary-60 text-white rounded-3xl"
          />
        </div>
      </div>
    );
  }

  if (!isAnalyzed || !analysis) return null;

  // ─── Modal variant (simplified) ───
  if (variant === "modal") {
    return (
      <div
        ref={resultsRef}
        className="bg-white rounded-xl p-6 w-full max-w-4xl mx-auto"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#372F2D]">
                {gradeTheme.title}
              </h3>
              <p className="text-sm text-[#5E5E5E] mt-1">
                {gradeTheme.subtitle}
              </p>
            </div>
            <div className="relative flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-semibold"
                style={{
                  backgroundColor: gradeTheme.badgeBg,
                  color: gradeTheme.badgeText,
                }}
              >
                {gradeTheme.letter}
              </div>
              <div
                className="absolute -bottom-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: gradeTheme.scoreBg,
                  color: gradeTheme.scoreText,
                }}
              >
                {normalizedScore}/100
              </div>
            </div>
          </div>

          <div className="border-t border-dvianeutral-50 pt-4">
            <h4 className="font-semibold text-dvianeutral-10 mb-2">
              L&apos;avis de l&apos;IA
            </h4>
            <p className="text-sm text-[#4D4D4D] leading-relaxed">
              {aiOpinion}
            </p>
          </div>

          <div className="border-t border-dvianeutral-50 pt-4">
            <h4 className="font-semibold text-dvianeutral-10 mb-3">
              Détail de l&apos;analyse
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {detailEntries.map(([key, value]) => {
                const sentiment = classifyDetailByKey(key, value);
                return (
                  <div key={key} className="flex items-start gap-2">
                    <DetailIcon sentiment={sentiment} />
                    <div>
                      <p className="text-sm font-semibold text-dvianeutral-10">
                        {stripMarkdown(key)}
                      </p>
                      <p className="text-xs text-dvianeutralvariant-40">
                        {stripMarkdown(value)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mt-2">
            <button
              onClick={handleShareResults}
              className="border border-dviaprimary-40 text-dviaprimary-40 hover:bg-dviaprimary-40 hover:text-white font-medium py-2 px-6 rounded-8px transition text-sm cursor-pointer"
            >
              Partager l&apos;analyse
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Dashboard variant ───
  return (
    <div ref={resultsRef} className="relative w-full max-w-4xl mx-auto">
      {/* Page 1 */}
      {currentPage === 1 && (
        <div className="flex flex-col gap-5">
          {/* Score header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#372F2D]">
                  {gradeTheme.title}
                </h2>
                <p className="text-sm text-[#5E5E5E] mt-1">
                  {gradeTheme.subtitle}
                </p>
              </div>
              <div className="relative flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{
                    backgroundColor: gradeTheme.badgeBg,
                    color: gradeTheme.badgeText,
                  }}
                >
                  {gradeTheme.letter}
                </div>
                <span
                  className="text-[10px] font-semibold mt-0.5"
                  style={{ color: gradeTheme.scoreBg }}
                >
                  {normalizedScore}/100
                </span>
              </div>
            </div>
            <div className="relative group/save">
              <button className="p-2 rounded-8px border border-dvianeutral-50 hover:bg-dvianeutral-94 cursor-not-allowed opacity-60">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-dvianeutral-10 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/save:opacity-100 transition-opacity z-50">
                Indisponible pour le moment
              </div>
            </div>
          </div>

          {/* Trouver une alternative banner */}
          <button
            onClick={() => router.push(recommUrl)}
            className="flex items-center justify-between w-full bg-dviaprimary-40 rounded-xl px-5 py-3.5 cursor-pointer hover:bg-dviaprimary-30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <svg
                  width="18"
                  height="18"
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
              <div className="text-left">
                <p className="text-white font-semibold text-sm">
                  Trouver une alternative
                </p>
                <p className="text-white/70 text-xs">
                  3 artisans fiables disponibles
                </p>
              </div>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Détails du devis */}
          {(analysis.artisanName ||
            analysis.montantTotal ||
            analysis.dateEmission) && (
            <div>
              <h3 className="font-bold text-lg text-dvianeutral-10 mb-3">
                Détails du devis
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Artisan", value: analysis.artisanName },
                  { label: "Montant", value: analysis.montantTotal },
                  { label: "Date d'émission", value: analysis.dateEmission },
                ]
                  .filter((row) => row.value)
                  .map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-dvianeutralvariant-40">
                        {row.label}
                      </span>
                      <span className="font-medium text-dvianeutral-10">
                        {row.value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <hr className="border-dvianeutral-50" />

          {/* L'avis de l'IA */}
          <div>
            <h3 className="font-bold text-lg text-dvianeutral-10 mb-2">
              L&apos;avis de l&apos;IA
            </h3>
            <p className="text-sm text-[#4D4D4D] leading-relaxed">
              {aiOpinion}
            </p>
          </div>

          <hr className="border-dvianeutral-50" />

          {/* Détail de l'analyse */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg text-dvianeutral-10">
                Détail de l&apos;analyse
              </h3>
              <button
                onClick={() => setCurrentPage(2)}
                className="text-sm text-dviaprimary-40 hover:underline cursor-pointer"
              >
                Voir plus
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {detailEntries.slice(0, 4).map(([key, value]) => {
                const sentiment = classifyDetailByKey(key, value);
                return (
                  <div key={key} className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      <DetailIcon sentiment={sentiment} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dvianeutral-10">
                        {stripMarkdown(key)}
                      </p>
                      <p className="text-xs text-dvianeutralvariant-40 truncate">
                        {stripMarkdown(value)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-dvianeutral-50" />

          {/* Conseils de négociation */}
          <div>
            <h3 className="font-bold text-lg text-dvianeutral-10 mb-3">
              Conseils de négociation
            </h3>
            <div className="bg-dvianeutral-96 border border-dvianeutral-50 rounded-xl p-4">
              <p className="text-sm text-dvianeutral-10 leading-relaxed">
                {negotiationTip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page 2 - Détails complets */}
      {currentPage === 2 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-bold text-dvianeutral-10">
            Détail complet de l&apos;analyse
          </h2>
          <div className="flex flex-col gap-1">
            {detailEntries.map(([key, value], index) => {
              const sentiment = classifyDetailByKey(key, value);
              return (
                <div
                  key={key}
                  className={`py-4 ${index < detailEntries.length - 1 ? "border-b border-dvianeutral-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <DetailIcon sentiment={sentiment} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-dvianeutral-10">
                        {stripMarkdown(key)}
                      </p>
                      <p className="text-sm text-dvianeutralvariant-40 mt-1">
                        {stripMarkdown(value)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Conclusion complète */}
          <div className="bg-dvianeutral-96 border border-dvianeutral-50 rounded-xl p-5">
            <h4 className="font-semibold text-dvianeutral-10 mb-2">
              Conclusion
            </h4>
            <p className="text-sm text-[#4D4D4D] leading-relaxed whitespace-pre-line">
              {stripMarkdown(analysis.conclusion)}
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleShareResults}
              className="border border-dviaprimary-40 text-dviaprimary-40 hover:bg-dviaprimary-40 hover:text-white font-medium py-2 px-5 rounded-8px transition text-sm cursor-pointer"
            >
              Partager l&apos;analyse
            </button>
            <button
              onClick={() => router.push(recommUrl)}
              className="bg-dviaprimary-40 text-white font-medium py-2 px-5 rounded-8px hover:shadow-md transition text-sm cursor-pointer"
            >
              Trouver des artisans
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 bg-dvianeutral-94 border-t border-dvianeutral-50">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-full border border-dvianeutral-50 transition-colors cursor-pointer ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-dvianeutral-94"}`}
        >
          <FaChevronLeft size={16} className="text-dvianeutralvariant-90" />
        </button>
        <span className="text-sm text-dvianeutralvariant-40 font-medium">
          {currentPage}/{totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full border border-dvianeutral-50 transition-colors cursor-pointer ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-dvianeutral-94"}`}
        >
          <FaChevronRight size={16} className="text-dvianeutralvariant-90" />
        </button>
      </div>

      {/* Popup Devis risqué */}
      {showRiskPopup && normalizedScore < 65 && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FEE2E2] border border-[#FECACA] rounded-xl p-4 w-[300px] shadow-lg animate-in slide-in-from-right">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="text-[#D55350]" size={20} />
              <div>
                <p className="font-bold text-sm text-[#991B1B]">Devis risqué</p>
                <p className="text-xs text-[#991B1B]/70">
                  Ne signez pas tout de suite
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRiskPopup(false)}
              className="text-[#991B1B]/50 hover:text-[#991B1B] cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-[#991B1B]/80 mb-3">
            Ce prix est {100 - normalizedScore}% au-dessus de la moyenne. Voici
            3 artisans notés 4.8/5+ disponibles pour une contre-offre :
          </p>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-[#991B1B]/20 flex items-center justify-center -ml-1 first:ml-0"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#991B1B"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            ))}
            <span className="text-xs text-[#991B1B]/60 ml-1">+3 dispos</span>
          </div>
          <button
            onClick={() => {
              setShowRiskPopup(false);
              router.push(recommUrl);
            }}
            className="w-full bg-[#D55350] text-white text-sm font-medium py-2 rounded-8px hover:bg-[#B91C1C] transition-colors cursor-pointer"
          >
            Voir les artisans
          </button>
        </div>
      )}
    </div>
  );
}
