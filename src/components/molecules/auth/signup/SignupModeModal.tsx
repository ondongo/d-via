"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SimpleModal } from "@/components/atoms/ui/modals/SimpleModal";

interface SignupModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRapid: () => void;
}

export default function SignupModeModal({
  isOpen,
  onClose,
  onSelectRapid,
}: SignupModeModalProps) {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<"rapid" | "classic" | null>(
    null
  );

  const handleContinue = () => {
    if (selectedMode === "classic") {
      router.push("/signup");
      onClose();
    } else if (selectedMode === "rapid") {
      onSelectRapid();
    }
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Choisissez votre mode d'inscription"
      className="w-[350px] md:w-[535px]"
      description="Sélectionnez l'option qui vous convient le mieux"
    >
      <div className="pb-6">
        <div className="flex flex-col gap-4 mb-6">
          {/* Inscription rapide */}
          <div
            onClick={() => setSelectedMode("rapid")}
            className={`border-1 rounded-12px p-4 cursor-pointer transition-all ${
              selectedMode === "rapid" && "border-dvianeutralvariant-12"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMode === "rapid" &&
                    "border-dviaprimary-40 bg-dviaprimary-40"
                  }`}
                >
                  {selectedMode === "rapid" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2 ">
                  <h3 className="text-dvianeutralvariant-50 text-md mb-1">
                    Inscription rapide
                  </h3>
                  <div className="border-1 rounded-12px p-4 flex items-center justify-center gap-2 max-w-[145px] max-h-[32px]">
                    <img src="/icons/star_shine.svg" alt="star_shine" />
                    <p className="text-dvianeutralvariant-50 text-sm">
                      Recommandé
                    </p>
                  </div>
                </div>{" "}
                <p className="text-dvianeutralvariant-90 text-sm">
                  Téléchargez votre attestation décennale et vos informations
                  seront automatiquement préremplies
                </p>
              </div>

              <img src="/icons/Rapid.svg" alt="classic_icon" />
            </div>
          </div>

          {/* Inscription classique */}
          <div
            onClick={() => setSelectedMode("classic")}
            className={`border-1 rounded-12px p-4 cursor-pointer transition-all ${
              selectedMode === "classic" && "border-dvianeutralvariant-12"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMode === "classic" &&
                    "border-dviaprimary-40 bg-dviaprimary-40"
                  }`}
                >
                  {selectedMode === "classic" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-dvianeutralvariant-50 text-md mb-1">
                  Inscription classique
                </h3>
                <p className="text-dvianeutralvariant-90 text-sm">
                  Remplissez manuellement toutes vos informations
                </p>
              </div>

              <img src="/icons/Classic.svg" alt="classic_icon" />
            </div>
          </div>
        </div>

        {/* Bouton continuer */}
        <button
          onClick={handleContinue}
          disabled={!selectedMode}
          className={`w-full py-3 px-4 my-6 rounded-8px font-medium text-sm transition-all ${
            selectedMode
              ? "bg-dviaprimary-40 text-white hover:bg-dviaprimary-50 cursor-pointer"
              : "bg-dviaprimary-40 text-white hover:bg-dviaprimary-50  cursor-not-allowed"
          }`}
        >
          Continuer
        </button>

        {/* Description du bas */}
        <p className="text-dvianeutralvariant-60 text-xs">
          L'attestation décennale est obligatoire pour les professionnels du BTP
        </p>
      </div>
    </SimpleModal>
  );
}
