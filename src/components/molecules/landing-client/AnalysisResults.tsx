"use client";
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

function classifyDetail(value: string): "positive" | "warning" | "negative" {
  const normalized = value.toLowerCase();

  if (NEGATIVE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "negative";
  }

  if (WARNING_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "warning";
  }

  if (POSITIVE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "positive";
  }

  return "warning";
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
      subtitle: "Prix et garanties validés",
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
      subtitle: "Points de vigilance à corriger",
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
}: AnalysisResultsProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const fallbackScore = estimateScoreFromDetails(analysis?.details || {});
  const normalizedScore = clampScore(
    typeof analysis?.reliability === "number" ? analysis.reliability : fallbackScore,
  );
  const gradeTheme = getGradeTheme(normalizedScore);
  const detailEntries = Object.entries(analysis?.details || {});

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
      className="bg-white rounded-xl p-6 md:p-8 w-full max-w-4xl mx-auto shadow-sm"
    >
      {isLoading ? (
        <>
          <div className="flex flex-col items-center gap-4">
            <img
              src="/icons/quick_reference_all.svg"
              alt="Quick reference"
              className="w-16 h-16"
            />

            <p className="text-md text-dvianeutral-10 text-center font-medium">
              Analyse en cours
            </p>

            <p className="text-sm text-gray-500 text-center">
              Notre IA analyse en détail votre devis. Cela prendra quelques
              instants.
            </p>
          </div>

          <div className="relative  w-full h-2.5  overflow-hidden rounded-3xl bg-white">
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{
                width: `${progress}%`,
                transition: "width 0.1s ease-out",
              }}
              className="flex h-full items-center justify-center bg-dviaprimary-60  text-white rounded-3xl"
            ></div>
          </div>
        </>
      ) : (
        isAnalyzed &&
        analysis && (
          <div className="space-y-6 mt-4">
            <div className="rounded-[28px] bg-[#F4F4F4] p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-[48px] md:text-[64px] leading-none font-bold text-[#372F2D]">
                    {gradeTheme.title}
                  </h3>
                  <p className="mt-3 text-[24px] text-[#5E5E5E]">
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

            <div className="rounded-[24px] bg-[#F8F8F8] p-6 md:p-8">
              <h4 className="text-[24px] md:text-[28px] font-semibold text-[#2E2E2E] mb-3">
                L&apos;avis de l&apos;IA
              </h4>
              <p className="text-[18px] md:text-[24px] leading-relaxed text-[#4D4D4D]">
                {analysis.conclusion || "Analyse terminée."}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#F8F8F8] p-6 md:p-8">
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
                  const sentiment = classifyDetail(String(value));

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
                      index < detailEntries.length - 1 ? "border-b border-[#E5E5E5]" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{icon}</div>
                      <div>
                        <p className="text-[26px] md:text-[32px] leading-tight font-semibold text-[#2F2A2A]">
                          {key}
                        </p>
                        <p className="text-[20px] md:text-[24px] text-[#868686] mt-1">
                          {String(value)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row justify-end gap-4">
              <button
                className="cursor-pointer border border-dviaprimary-40 text-dviaprimary-40 hover:bg-dviaprimary-70 hover:text-white font-medium py-2 px-4 rounded-md transition"
                onClick={handleShareResults}
              >
                Partager l’analyse
              </button>
              <button
                className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-8 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px] flex items-center justify-center gap-2 "
                onClick={() => router.push("/dashboard/clients/search")}
              >
                Trouver des artisans
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
