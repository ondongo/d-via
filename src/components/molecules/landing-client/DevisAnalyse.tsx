"use client";
import { ICONS } from "@/constants/icons";
import { Modal } from "@/components/atoms/ui/modals/CustomModal";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useRef } from "react";
import AnalysisResults from "./AnalysisResults";
import { toast } from "react-toastify";
import { ComplexModal } from "@/components/atoms/ui/modals/ComplexModal";

function DevisAnalyse() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState<{
    base64: string | null;
    name: string | null;
    type: string | null;
  }>({
    base64: null,
    name: null,
    type: null,
  });

  const [extractedText, setExtractedText] = useState("");
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFileData({
      base64: null,
      name: null,
      type: null,
    });

    setIsLoading(false);
    setIsAnalyzed(false);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
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
          setFileData({
            base64: base64String,
            name: file.name,
            type: file.type,
          });
        };
        reader.onerror = () => {
          toast.error("Erreur lors de la lecture du fichier.");
        };
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
                  name: file.name.replace(
                    /\.(png|gif|bmp|webp|tiff)$/i,
                    ".jpg",
                  ),
                  type: "image/jpeg",
                });
              };
              convertedReader.readAsDataURL(blob);
            },
            "image/jpeg",
            0.95,
          );
        };

        img.onerror = () => {
          toast.error("Erreur lors du chargement de l'image.");
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const [analysis, setAnalysis] = useState<{
    reliability: number | null;
    details: Record<string, string>;
    conclusion: string;
  }>({
    reliability: null,
    details: {}, // Objet avec des clés et des chaînes de caractères
    conclusion: "",
  });

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

      /*
       Étape 1 : Extraction du texte via DocumentAI
      */
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(extractPayload),
      });

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
        setExtractedText(extractedText);
        console.log("Texte extrait :", extractedText);

        /*
         Étape 2 : Recherche RAG pour récupérer les contextes pertinents
        */
        let contexts = "";
        try {
          const askResponse = await fetch("/api/rag/ask", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: extractedText.substring(0, 500), // Utiliser les 500 premiers caractères comme question
              namespace: "devis",
              topK: 5,
            }),
          });

          const askData = await askResponse.json();
          if (askData.status === 200 && askData.contexts) {
            contexts = askData.contexts;
            console.log("Contextes RAG récupérés :", contexts);
          }
        } catch (error) {
          console.log(
            "Erreur lors de la récupération des contextes RAG :",
            error,
          );
        }

        /*
         Étape 3 : Analyse via Mistral avec contextes RAG
        */
        const analyzeResponse = await fetch("/api/rag/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: extractedText,
            contexts: contexts, // Enrichir l'analyse avec les contextes
          }),
        });

        const analyzeData = await analyzeResponse.json();

        if (analyzeData.status === 200) {
          setAnalysis({
            reliability: analyzeData.reliability,
            details: analyzeData.details,
            conclusion: analyzeData.conclusion,
          });
          setIsAnalyzed(true);

          console.log("Analyse réussie :", analyzeData);
        } else {
          console.log("Erreur d'analyse :", analyzeData.error);
          toast.error("Erreur lors de l'analyse du devis");
        }
      } else {
        console.log("Erreur d'extraction :", extractData.message);
        toast.error("Erreur survenue lors de l'analyse ");
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
        console.log("Partage annulé ou non pris en charge :", error);
      }
    } else {
      alert(
        "Le partage n'est pas pris en charge sur votre navigateur. Copiez manuellement le contenu.",
      );
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => openModal()}
          className="my-5 text-white text-[12px] md:text-label-large leading-label-large tracking-label-large px-4 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px] flex items-center gap-2 bg-dviaprimary-40"
        >
          <img src={ICONS.draft} alt="Icône draft" className="w-4 h-4" />
          Analyser un devis
        </button>
      </div>

      <ComplexModal
        onClose={closeModal}
        title={"Analyser votre devis"}
        isOpen={modalOpen}
        className="md:w-[750px] md:max-h-[90vh] overflow-hidden"
      >
        <div className="max-h-[calc(90vh-100px)]">
          {!isAnalyzed && !isLoading ? (
            <>
              {!fileData.base64 ? (
                <>
                  <div className="w-full mb-5">
                    <div
                      {...getRootProps()}
                      className="flex flex-col items-center justify-center py-24 w-full border border-gray-300 border-dashed rounded-2xl cursor-pointer bg-white hover:bg-dvianeutral-96 hover:border-dvianeutral-40"
                    >
                      <div className="mb-3 flex items-center justify-center">
                        <img
                          src="/illustrations/DevisUpload.svg"
                          alt="Upload illustration"
                          className="w-[240px] h-[240px]"
                        />
                      </div>
                      <h2 className="text-center text-gray-400   text-xs font-normal leading-4 mb-1">
                        Format PDF, PNG ou JPG, moins de 50MB
                      </h2>
                      <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">
                        Glissez votre devis ici ou{" "}
                        <span className="text-dviaprimary-40">
                          choisissez un fichier
                        </span>
                      </h4>
                      <input {...getInputProps()} className="hidden" />
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                          <h5 className="text-gray-400   text-xs font-normal leading-4">
                            Fichier actif
                          </h5>
                        </div>
                      </div>
                      <div
                        onClick={() =>
                          setFileData({
                            base64: null,
                            name: null,
                            type: null,
                          })
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
                      <div className="relative  w-full h-2.5  overflow-hidden rounded-3xl bg-white">
                        <div
                          role="progressbar"
                          aria-valuenow={uploadProgress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          style={{
                            width: `${uploadProgress}%`,
                            transition: "width 0.02s ease-out",
                          }}
                          className="flex h-full items-center justify-center bg-dviaprimary-60  text-white rounded-3xl"
                        ></div>
                      </div>
                      <span className="ml-2 bg-white p-1 px-2  rounded-full  text-gray-800 text-xs font-medium flex justify-center items-center ">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                </>
              )}
              <div className="w-full flex justify-end mt-2 mb-5">
                <button
                  onClick={handleExtractAndAnalyze}
                  disabled={isLoading}
                  className={`text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-8 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px] flex items-center justify-center gap-2 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Analyse en cours...
                    </>
                  ) : (
                    "Analyser le devis"
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="w-full mb-5">
              {" "}
              <AnalysisResults
                isLoading={isLoading}
                isAnalyzed={isAnalyzed}
                analysis={analysis}
                resultsRef={resultsRef}
                handleShareResults={handleShareResults}
                variant="modal"
              />
            </div>
          )}
        </div>
      </ComplexModal>
    </>
  );
}

export default DevisAnalyse;
