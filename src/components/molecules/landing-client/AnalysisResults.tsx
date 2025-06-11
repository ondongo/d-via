"use client"
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function AnalysisResults({
  isLoading,
  isAnalyzed,
  analysis,
  handleShareResults,
  resultsRef,
}: any) {
  const router = useRouter();
  return (
    <div
      ref={resultsRef}
      className="bg-white rounded-xl p-6 md:p-8 w-full max-w-4xl mx-auto shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Résultats de l’analyse
        </h2>

        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-4 border-dviaprimary-40 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Analyse en cours...</p>
          </div>
        )}
      </div>

      {!isAnalyzed && !isLoading && (
        <p className="text-sm text-gray-500 mb-6">
          Les résultats de votre analyse apparaîtront ici une fois le devis
          analysé.
        </p>
      )}

      {isLoading ? (
        <div className="w-full max-w-md space-y-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-2 bg-gray-200 rounded w-full animate-pulse"
              />
            ))}
          </div>
        </div>
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
