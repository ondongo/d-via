import { useRef } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function AnalysisResults({
  isLoading,
  isAnalyzed,
  analysis,
  handleShareResults,
  resultsRef,
}: any) {
  return (
    <div ref={resultsRef}>
      <div className="flex-1 bg-white rounded-md p-8 shadow-sm  h-auto mb-20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Résultats de l’analyse</h2>

          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-4 border-dviaprimary-40 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Analyse en cours...</p>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Les résultats de votre analyse apparaîtront ici une fois le devis
          analysé.
        </p>

        <div>
          {isLoading ? (
            <div className="w-[500px] space-y-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-2 bg-gray-200 rounded w-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            isAnalyzed &&
            analysis && (
              <div className="mt-8 p-6 bg-white rounded-md shadow-sm w-full">
                {/* Fiabilité globale */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Résultats de l’analyse</h2>
                  <div className="px-3 py-1 bg-green-100 text-green-700 font-bold text-sm rounded-md">
                    Confiance : {analysis.reliability || "N/A"}%
                  </div>
                </div>

                {/* Détails des critères */}
                <div className="space-y-4">
                  {Object.entries(analysis.details).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-4 shadow-md bg-white p-4 rounded-md"
                    >
                      <div
                        className={`w-1.5 h-20 rounded-md ${
                          typeof value === "string" && value.includes("Non")
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      />
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            typeof value === "string" && value.includes("Non")
                              ? "bg-red-100"
                              : "bg-green-100"
                          }`}
                        >
                          {typeof value === "string" &&
                          value.includes("Non") ? (
                            <FiAlertCircle className="text-red-500" size={20} />
                          ) : (
                            <FiCheckCircle
                              className="text-green-500"
                              size={20}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-md font-bold">{key}</p>
                          <p className="text-sm text-gray-600">
                            {String(value)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Conclusion */}
                <div className="mt-6">
                  <p className="text-md font-bold text-gray-700">
                    Conclusion :
                  </p>
                  <p className="text-gray-600">{analysis.conclusion}</p>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col md:flex-row justify-end gap-4">
               
                  <button
                    className="cursor-pointer border border-dviaprimary-40 text-dviaprimary-40 hover:bg-dviaprimary-70 font-medium py-2 px-4 rounded-md"
                    onClick={handleShareResults}
                  >
                    Partager l’analyse
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
