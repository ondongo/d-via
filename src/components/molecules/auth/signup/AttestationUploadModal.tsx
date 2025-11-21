"use client";
import React, { useState } from "react";
import { Modal } from "@/components/atoms/ui/modals/CustomModal";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { SimpleModal } from "@/components/atoms/ui/modals/SimpleModal";

interface AttestationUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AttestationUploadModal({
  isOpen,
  onClose,
}: AttestationUploadModalProps) {
  const router = useRouter();
  const [fileData, setFileData] = useState<{
    base64: string | null;
    name: string | null;
    type: string | null;
  }>({
    base64: null,
    name: null,
    type: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData({
          base64: reader.result?.toString().split(",")[1] || null,
          name: file.name,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });

  const handleProcess = async () => {
    if (!fileData.base64) {
      toast.error("Veuillez télécharger un fichier.");
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Appeler l'API pour extraire les informations de l'attestation décennale
      // Pour l'instant, on redirige vers signup avec un flag
      // L'API devrait retourner les données préremplies
      
      // Simuler un traitement
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Rediriger vers signup avec les données préremplies
      // router.push("/signup?mode=rapid");
      toast.success("Attestation téléchargée avec succès !");
      router.push("/signup");
      onClose();
    } catch (error) {
      console.error("Erreur lors du traitement:", error);
      toast.error("Erreur lors du traitement de l'attestation");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setFileData({
      base64: null,
      name: null,
      type: null,
    });
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Téléchargez attestation décennale"
      className="w-[350px] md:w-[535px]"
      description="Vos informations seront extraites du document"
    >
      <div className="pb-6 w-full">
        {!fileData.base64 ? (
          <div className="w-full mb-5">
            <div
              {...getRootProps()}
              className="flex flex-col items-center justify-center py-24 px-4 w-full border border-dvianeutralvariant-12 border-dashed rounded-2xl cursor-pointer hover:border-dvianeutral-40"
            >
              <div className="mb-3 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <g id="Upload 02">
                    <path
                      id="icon"
                      d="M16.296 25.3935L19.9997 21.6667L23.7034 25.3935M19.9997 35V21.759M10.7404 27.3611H9.855C6.253 27.3611 3.33301 24.4411 3.33301 20.8391C3.33301 17.2371 6.253 14.3171 9.855 14.3171V14.3171C10.344 14.3171 10.736 13.9195 10.7816 13.4326C11.2243 8.70174 15.1824 5 19.9997 5C25.1134 5 29.2589 9.1714 29.2589 14.3171H30.1444C33.7463 14.3171 36.6663 17.2371 36.6663 20.8391C36.6663 24.4411 33.7463 27.3611 30.1444 27.3611H29.2589"
                      stroke="#E16A26"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </div>
              <h2 className="text-center text-gray-400 text-xs font-normal leading-4 mb-1">
                Format PDF, PNG ou JPG, moins de 50MB
              </h2>
              <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">
                Glissez votre attestation décennale ici ou{" "}
                <span className="text-dviaprimary-40">
                  choisissez un fichier
                </span>
              </h4>
              <input {...getInputProps()} className="hidden" />
            </div>
          </div>
        ) : (
          <>
            <div className="w-full grid gap-1 p-4 mb-4">
              {fileData.type?.startsWith("image/") ? (
                <div className="w-full h-[250px] md:h-[400px] overflow-hidden rounded-12px mb-4">
                  <img
                    src={`data:${fileData.type};base64,${fileData.base64}`}
                    alt="Aperçu de l'attestation"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : fileData.type === "application/pdf" ? (
                <div className="w-full h-[250px] md:h-[400px] mb-4">
                  <iframe
                    src={`data:application/pdf;base64,${fileData.base64}`}
                    title="Aperçu PDF"
                    width="100%"
                    height="100%"
                    className="w-full h-full rounded-12px"
                  />
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-2">
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
                  <div className="flex flex-col">
                    <p className="text-dvianeutral-10 text-sm font-medium">
                      {fileData.name}
                    </p>
                    <p className="text-dvianeutral-50 text-xs">
                      {fileData.type === "application/pdf"
                        ? "PDF"
                        : fileData.type?.startsWith("image/")
                        ? "Image"
                        : "Fichier"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-dvianeutral-50 hover:text-dvianeutral-10 cursor-pointer"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-8px font-medium text-sm border border-dvianeutral-50 text-dvianeutral-10 hover:bg-dvianeutral-96 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleProcess}
            disabled={!fileData.base64 || isProcessing}
            className={`flex-1 py-3 px-4 rounded-8px font-medium text-sm transition-all ${
              fileData.base64 && !isProcessing
                ? "bg-dviaprimary-40 text-white hover:bg-dviaprimary-50 cursor-pointer"
                : "bg-dviaprimary-40 text-white hover:bg-dviaprimary-50 cursor-not-allowed"
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Traitement en cours...
              </div>
            ) : (
              "Continuer"
            )}
          </button>
        </div>
      </div>
    </SimpleModal>
  );
}

