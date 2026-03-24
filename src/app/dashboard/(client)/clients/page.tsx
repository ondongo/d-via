"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import AnalysisResults from "@/components/molecules/landing-client/AnalysisResults";
import AnalysisHistorySidebar from "@/components/molecules/dashboard/AnalysisHistorySidebar";
import CreditStateBlock from "@/components/molecules/dashboard/CreditStateBlock";
import {
  deleteAnalysisHistory,
  getAnalysisEntitlement,
} from "@/services/database/analysis-actions";
import {
  type AnalysisCreditState,
  useAnalysisHistory,
} from "@/hooks/useAnalysisHistory";
import type { EntitlementResponse } from "@/types/analysis";

function mapEntitlementToCreditState(
  data: EntitlementResponse | null,
  isAuthenticated: boolean,
): AnalysisCreditState {
  if (!data) {
    return isAuthenticated
      ? "authenticated_with_credits"
      : "guest_free_analysis_available";
  }
  if (data.mode === "user") {
    return data.credits > 0
      ? "authenticated_with_credits"
      : "authenticated_without_credits";
  }
  return data.guestFreeAvailable
    ? "guest_free_analysis_available"
    : "guest_free_analysis_used";
}

function RgpdModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[480px] mx-4 p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dvianeutralvariant-40 hover:text-dvianeutral-10 cursor-pointer"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-dvianeutral-10 mb-2">
          Protection des données
        </h2>
        <p className="text-sm text-dvianeutralvariant-40 mb-6">
          Votre vie privée est notre priorité. Voici exactement comment nous
          traitons vos documents, en toute transparence.
        </p>
        <div className="flex flex-col gap-4">
          <div className="border border-dvianeutral-50 rounded-xl p-4">
            <p className="font-medium text-dvianeutral-10 mb-2">
              À quoi servent vos documents ?
            </p>
            <p className="text-sm text-dvianeutralvariant-40 leading-relaxed">
              Uniquement à analyser vos devis — vérification des prix et des
              assurances. Vos fichiers ne sont <span className="font-medium text-dvianeutral-10">jamais utilisés pour améliorer
              notre IA sans votre accord explicite</span>. Sans autorisation de
              votre part, ils sont supprimés automatiquement après l&apos;analyse.
            </p>
          </div>
          <div className="border border-dvianeutral-50 rounded-xl p-4">
            <p className="font-medium text-dvianeutral-10 mb-2">
              Où sont stockés vos fichiers ?
            </p>
            <p className="text-sm text-dvianeutralvariant-40 leading-relaxed">
              Sur des serveurs sécurisés, hébergés en{" "}
              <span className="font-medium text-dvianeutral-10">Union Européenne</span>.
              Si vous autorisez la conservation, vos données sont chiffrées et
              vos informations personnelles anonymisées avant tout traitement.
            </p>
          </div>
          <div className="border border-dvianeutral-50 rounded-xl p-4">
            <p className="font-medium text-dvianeutral-10 mb-2">
              Pendant combien de temps ?
            </p>
            <p className="text-sm text-dvianeutralvariant-40 leading-relaxed">
              Sans votre accord, vos documents sont supprimés dès la fin de
              l&apos;analyse. Si vous les conservez, vous pouvez les supprimer
              à tout moment depuis la section{" "}
              <span className="text-dviaprimary-40 font-normal">
                Paramètres
              </span>
              .
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 bg-dviaprimary-40 text-white font-medium py-3 rounded-8px hover:bg-dviaprimary-30 transition-colors cursor-pointer"
        >
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}

function DashboardClientsPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session?.user;
  const isSessionLoading = status === "loading";

  const resultsRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [creditState, setCreditState] = useState<AnalysisCreditState>(
    "guest_free_analysis_available",
  );
  const [entitlement, setEntitlement] = useState<EntitlementResponse | null>(
    null,
  );
  const [entitlementLoading, setEntitlementLoading] = useState(true);

  const [rgpdOpen, setRgpdOpen] = useState(false);
  const [fileData, setFileData] = useState<{
    base64: string | null;
    name: string | null;
    type: string | null;
  }>({ base64: null, name: null, type: null });

  const [analysis, setAnalysis] = useState<{
    reliability: number | null;
    details: Record<string, string>;
    conclusion: string;
  }>({ reliability: null, details: {}, conclusion: "" });

  const {
    history: guestHistory,
    addToHistory,
    removeFromHistory: removeGuestHistoryItem,
  } = useAnalysisHistory();

  const refreshEntitlement = React.useCallback(async () => {
    setEntitlementLoading(true);
    try {
      const result = await getAnalysisEntitlement();
      if (result.ok) {
        setEntitlement(result.data);
        setCreditState(
          mapEntitlementToCreditState(result.data, isAuthenticated),
        );
      }
    } catch {
      /* ignore */
    } finally {
      setEntitlementLoading(false);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("dvia-entitlement-changed"));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isSessionLoading) return;
    void refreshEntitlement();
  }, [isSessionLoading, isAuthenticated, refreshEntitlement]);

  const serverHistory =
    isAuthenticated && entitlement?.mode === "user" ? entitlement.history : [];
  const historyItems = isAuthenticated ? serverHistory : guestHistory;

  const removeHistoryEntry = async (id: string) => {
    if (isAuthenticated) {
      const result = await deleteAnalysisHistory(id);
      if (result.ok) await refreshEntitlement();
      return;
    }
    removeGuestHistoryItem(id);
  };

  useEffect(() => {
    if (fileData.base64) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 20);
      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [fileData.base64]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const supportedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (!supportedTypes.includes(file.type)) {
      toast.error(
        `Format non supporté : ${file.type}. Utilisez PDF, PNG, JPEG ou JPG.`,
      );
      return;
    }

    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(",")[1] || null;
        setFileData({ base64: base64String, name: file.name, type: file.type });
      };
      reader.onerror = () =>
        toast.error("Erreur lors de la lecture du fichier.");
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("image/")) {
      const img = new Image();
      const reader = new FileReader();
      reader.onloadend = () => {
        img.src = reader.result as string;
      };
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          toast.error("Erreur lors de la conversion de l'image.");
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              toast.error("Erreur lors de la conversion de l'image.");
              return;
            }
            const convertedReader = new FileReader();
            convertedReader.onloadend = () => {
              const base64String =
                convertedReader.result?.toString().split(",")[1] || null;
              setFileData({
                base64: base64String,
                name: file.name.replace(/\.(png|gif|bmp|webp|tiff)$/i, ".jpg"),
                type: "image/jpeg",
              });
            };
            convertedReader.readAsDataURL(blob);
          },
          "image/jpeg",
          0.95,
        );
      };
      img.onerror = () => toast.error("Erreur lors du chargement de l'image.");
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 5 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === "file-too-large") {
        toast.error("Le fichier est trop volumineux. Taille maximale : 5 MB");
      } else if (rejection.errors[0].code === "file-invalid-type") {
        toast.error(
          "Format de fichier non supporté. Utilisez PDF, PNG, JPEG ou JPG.",
        );
      } else {
        toast.error("Le fichier ne peut pas être téléchargé.");
      }
    },
  });

  const handleExtractAndAnalyze = async () => {
    setIsLoading(true);
    try {
      if (!fileData.base64) {
        toast.error("Veuillez télécharger un fichier.");
        return;
      }

      const extractPayload = {
        files: [
          {
            file: fileData.base64,
            originalFilename: fileData.name,
            mimetype: fileData.type,
          },
        ],
      };

      const extractResponse = await fetch("/api/documentai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extractPayload),
      });

      if (extractResponse.status === 402) {
        const errorData = await extractResponse.json();
        toast.error(
          errorData.message || "Crédits ou analyse gratuite indisponible.",
        );
        await refreshEntitlement();
        return;
      }

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json();
        toast.error(
          errorData.message || "Erreur lors de l'extraction du document",
        );
        return;
      }

      const extractData = await extractResponse.json();
      if (extractData.status === 200) {
        const extractedText = extractData.message;

        let contexts = "";
        try {
          const askResponse = await fetch("/api/rag/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: extractedText.substring(0, 500),
              namespace: "devis",
              topK: 5,
            }),
          });
          const askData = await askResponse.json();
          if (askData.status === 200 && askData.contexts) {
            contexts = askData.contexts;
          }
        } catch (error) {
          console.log("Erreur RAG contextes :", error);
        }

        const analyzeResponse = await fetch("/api/rag/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: extractedText,
            contexts,
            fileName: fileData.name ?? undefined,
          }),
        });

        if (analyzeResponse.status === 402) {
          const err = await analyzeResponse.json();
          toast.error(err.error || "Crédits ou analyse gratuite indisponible.");
          await refreshEntitlement();
          return;
        }

        const analyzeData = await analyzeResponse.json();

        if (analyzeData.status === 200) {
          setAnalysis({
            reliability: analyzeData.reliability,
            details: analyzeData.details,
            conclusion: analyzeData.conclusion,
          });
          setIsAnalyzed(true);

          if (
            !isAuthenticated &&
            fileData.name &&
            analyzeData.reliability != null
          ) {
            addToHistory(fileData.name, analyzeData.reliability);
          }
          await refreshEntitlement();
        } else {
          toast.error("Erreur lors de l'analyse du devis");
        }
      } else {
        toast.error("Erreur survenue lors de l'analyse");
      }
    } catch (error) {
      console.log("Erreur lors du traitement :", error);
      toast.error("Erreur lors du traitement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareResults = async () => {
    const content = `
Fiabilité globale : ${analysis.reliability || "N/A"}%

Détails de l'analyse :
${Object.entries(analysis.details)
  .map(([key, value]) => `- ${key} : ${value}`)
  .join("\n")}

Conclusion :
${analysis.conclusion}
    `;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Résultats de l'analyse",
          text: content,
        });
      } catch (error) {
        console.log("Partage annulé :", error);
      }
    } else {
      alert(
        "Le partage n'est pas pris en charge sur votre navigateur. Copiez manuellement le contenu.",
      );
    }
  };

  const canAnalyze =
    entitlementLoading ||
    creditState === "guest_free_analysis_available" ||
    creditState === "authenticated_with_credits";

  /** Après une analyse réussie, les crédits passent à 0 mais on doit afficher les résultats. */
  const showCreditBlock =
    !isSessionLoading &&
    !entitlementLoading &&
    !canAnalyze &&
    !isAnalyzed &&
    !isLoading;

  return (
    <div className="flex w-full min-h-[calc(100vh-120px)]">
      <RgpdModal open={rgpdOpen} onClose={() => setRgpdOpen(false)} />

      {/* Sidebar historique — desktop uniquement */}
      <AnalysisHistorySidebar
        history={historyItems}
        isLoading={entitlementLoading}
        onRemove={(id) => {
          void removeHistoryEntry(id);
        }}
      />

      {/* Contenu principal */}
      <div className="flex-1 min-w-0 px-4 md:px-8 py-4 md:py-0">
        {/* Sous-titre */}
        {!isAnalyzed && !isLoading && canAnalyze && (
          <p className="text-dvianeutral-20 text-sm md:text-base my-6">
            Importez votre document. Notre IA vérifie les prix, les assurances
            et détecte les anomalies.
          </p>
        )}
        {(isAnalyzed || isLoading) && canAnalyze && (
          <p className="text-dvianeutral-20 text-md md:text-lg mb-6">
            Résultats de l&apos;analyse — Notre IA vérifie les prix, les
            assurances et détecte les anomalies.
          </p>
        )}

        {showCreditBlock ? (
          <CreditStateBlock state={creditState} />
        ) : (
          <>
            {!isAnalyzed && !isLoading ? (
              <>
                {!fileData.base64 ? (
                  <div className="w-full mb-5 flex justify-center">
                    <div
                      {...getRootProps()}
                      className="flex flex-col items-center justify-center py-16 w-full max-w-[800px] border border-dviaprimary-40 border-dashed rounded-2xl cursor-pointer bg-white "
                    >
                      <div className="mb-3 flex items-center justify-center">
                        <img
                          src="/illustrations/DevisUpload.svg"
                          alt="Upload illustration"
                          className="w-[200px] h-[200px]"
                        />
                      </div>
                      <div className="w-full px-4 mb-3">
                        <button className="bg-dviaprimary-40 text-white cursor-pointer font-medium py-3 px-6 rounded-8px hover:bg-dviaprimary-30 transition-colors text-sm flex items-center gap-2 w-full justify-center">
                          + Ajouter un document
                        </button>
                      </div>
                      <p className="text-center text-xs text-dvianeutralvariant-40 mb-3 w-full px-4">
                        Formats acceptés : PDF, JPG, PNG.
                      </p>
                      <div className="w-full px-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRgpdOpen(true);
                          }}
                          className="text-xs text-dvianeutralvariant-40 border border-dvianeutral-50 rounded-8px px-4 py-2 hover:bg-dvianeutral-96 transition-colors cursor-pointer w-full text-center"
                        >
                          Données sécurisées &amp; RGPD.{" "}
                          <span className="text-dviaprimary-40 font-medium">
                            En savoir plus
                          </span>
                        </button>
                      </div>
                      <input {...getInputProps()} className="hidden" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full grid gap-1 p-4">
                    {fileData.type?.startsWith("image/") ? (
                      <div className="w-full h-[250px] md:h-[400px] overflow-hidden rounded-12px mb-4">
                        <img
                          src={`data:${fileData.type};base64,${fileData.base64}`}
                          alt="Aperçu de l'image"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : fileData.type === "application/pdf" ? (
                      <div className="w-full h-[250px] md:h-[400px]">
                        <iframe
                          src={`data:application/pdf;base64,${fileData.base64}`}
                          title="Aperçu PDF"
                          width="100%"
                          height="100%"
                          className="w-full h-full"
                        />
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-2 mt-4">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 40 40"
                          fill="none"
                        >
                          <g id="Folder Open ">
                            <path
                              id="icon"
                              d="M5 28.3333V14.8271C5 10.2811 5 8.00803 6.36977 6.56177C6.43202 6.49604 6.49604 6.43202 6.56177 6.36977C8.00803 5 10.2811 5 14.8271 5H15.3287C16.5197 5 17.1151 5 17.6492 5.18666C17.9753 5.30065 18.2818 5.46465 18.5575 5.67278C19.0091 6.0136 19.3394 6.50907 20 7.5C20.6606 8.49093 20.9909 8.9864 21.4425 9.32722C21.7182 9.53535 22.0247 9.69935 22.3508 9.81334C22.8849 10 23.4803 10 24.6713 10H28.3333C31.476 10 33.0474 10 34.0237 10.9763C35 11.9526 35 13.524 35 16.6667V17.5M16.2709 35H25.8093C28.2565 35 29.4801 35 30.3757 34.3164C31.2714 33.6328 31.5942 32.4526 32.2398 30.0921L32.6956 28.4254C33.7538 24.5564 34.2829 22.622 33.2823 21.311C32.2817 20 30.2762 20 26.2651 20H16.7339C14.2961 20 13.0773 20 12.1832 20.6796C11.2891 21.3591 10.9629 22.5336 10.3105 24.8824L9.84749 26.549C8.76999 30.428 8.23125 32.3675 9.23171 33.6838C10.2322 35 12.2451 35 16.2709 35Z"
                              stroke="#E16A26"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </g>
                        </svg>
                        <div className="grid gap-1">
                          <h4 className="text-gray-900 text-sm font-normal leading-snug max-w-[120px] md:max-w-full truncate overflow-hidden whitespace-nowrap">
                            {fileData.name}
                          </h4>
                          <h5 className="text-gray-400 text-xs font-normal leading-4">
                            Fichier actif
                          </h5>
                        </div>
                      </div>
                      <div
                        onClick={() =>
                          setFileData({ base64: null, name: null, type: null })
                        }
                        className="cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <g id="Upload 3">
                            <path
                              id="icon"
                              d="M15 9L12 12M12 12L9 15M12 12L9 9M12 12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                              stroke="#E16A26"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </g>
                        </svg>
                      </div>
                    </div>

                    <div className="relative flex items-center gap-2.5 py-1.5">
                      <div className="relative w-full h-2.5 overflow-hidden rounded-3xl bg-white">
                        <div
                          role="progressbar"
                          aria-valuenow={uploadProgress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          style={{
                            width: `${uploadProgress}%`,
                            transition: "width 0.02s ease-out",
                          }}
                          className="flex h-full items-center justify-center bg-dviaprimary-60 text-white rounded-3xl"
                        />
                      </div>
                      <span className="ml-2 bg-white p-1 px-2 rounded-full text-gray-800 text-xs font-medium flex justify-center items-center">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                )}

                {fileData.base64 && (
                  <div className="w-full flex justify-center mt-3 mb-5">
                    <button
                      onClick={handleExtractAndAnalyze}
                      disabled={isLoading}
                      className={`text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-8 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer w-full max-w-[800px] flex items-center justify-center gap-2 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Analyser le devis
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full mb-5">
                <AnalysisResults
                  isLoading={isLoading}
                  isAnalyzed={isAnalyzed}
                  analysis={analysis}
                  resultsRef={resultsRef}
                  handleShareResults={handleShareResults}
                  showAlternativeBanner={true}
                  variant="dashboard"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardClientsPage;
