"use client";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function AnalysisResults({
  isLoading,
  isAnalyzed,
  analysis,
  handleShareResults,
  resultsRef,
}: any) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

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
          <div className="mt-8">
            {/* Fiabilité globale */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">
                Fiabilité globale
              </h3>
              <div className="px-3 py-1 bg-green-100 text-green-700 font-bold text-sm rounded-md">
                Confiance : {analysis.reliability || "N/A"}%
              </div>
            </div>

            {/* Détails des critères */}
            <div className="space-y-4">
              {Object.entries(analysis.details).map(([key, value]) => {
                const isNegative =
                  typeof value === "string" && value.includes("Non");

                return (
                  <div
                    key={key}
                    className="flex items-start md:items-center gap-4 shadow-md bg-white p-4 rounded-lg"
                  >
                    <div
                      className={`w-1.5 h-20 rounded-md ${
                        isNegative ? "bg-red-500" : "bg-green-500"
                      }`}
                    />
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          isNegative ? "bg-red-100" : "bg-green-100"
                        }`}
                      >
                        {isNegative ? (
                          <FiAlertCircle className="text-red-500" size={20} />
                        ) : (
                          <FiCheckCircle className="text-green-500" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-md font-bold text-gray-800">{key}</p>
                        <p className="text-sm text-gray-600">{String(value)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Conclusion */}
            <div className="mt-8">
              <p className="text-md font-bold text-gray-700">Conclusion :</p>
              <p className="text-gray-600">{analysis.conclusion}</p>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col md:flex-row justify-end gap-4">
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
