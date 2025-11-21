"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import SaveAndExitButton from "../atoms/auth/SaveAndExitButton";
import { useSignupStore } from "@/stores/signupStore";
import { useSignupForm } from "@/hooks/useSignupForm";
import { useGlobalState } from "@/providers/globalState";
import { signupCookies } from "@/utils/cookies";

function HeaderAuth() {
  const router = useRouter();
  const {
    currentStep,
    phoneNumber,
    code,
    siret,
    companyName,
    legalName,
    legalStatus,
    completedSteps,
    stepParts,
    setIsSave,
  } = useSignupStore();
  const { saveFormData, collectCurrentFormData, clearFormData } =
    useSignupForm();
  const { coordinates } = useGlobalState();
  const { resetStore } = useSignupStore();

  const handleClickHome = async () => {
    // Nettoyer les cookies côté serveur via API
    try {
      await fetch("/api/auth/signup/clear-cookies", {
        method: "POST",
      });
    } catch (error) {
      console.error("Erreur lors du nettoyage des cookies:", error);
    }

    // Nettoyer les cookies côté client aussi (fallback)
    signupCookies.clear();

    // Nettoyer le localStorage
    clearFormData();

    // Nettoyer le sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("phoneNumber");
      sessionStorage.removeItem("codeSent");
      sessionStorage.removeItem("selectedAddress");
    }

    // Réinitialiser le store
    resetStore();

    router.push("/artisans");
  };

  const handleSaveAndExit = async () => {
    // Collecter et sauvegarder toutes les données actuelles
    const formData = collectCurrentFormData();
    saveFormData({
      ...formData,
      phoneNumber,
      code,
      siret,
      companyName,
      legalName,
      legalStatus,
      coordinates,
      completedSteps: Array.from(completedSteps),
      stepParts,
      currentStep,
      isSave: true,
    });
    setIsSave(true);

    // Sauvegarder les cookies côté serveur via API pour garantir leur disponibilité au middleware
    try {
      const response = await fetch("/api/auth/signup/save-cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: currentStep,
          isSave: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde des cookies");
      }

      // Attendre un peu pour s'assurer que les cookies sont écrits
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Rediriger vers /artisans au lieu de / pour éviter que le middleware redirige immédiatement
      // Le middleware ne redirigera que si l'utilisateur essaie d'accéder à d'autres pages
      window.location.href = "/artisans";
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des cookies:", error);
      // Fallback: utiliser js-cookie si l'API échoue
      signupCookies.setSavedStep(currentStep);
      signupCookies.setIsSave(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      window.location.href = "/artisans";
    }
  };

  // Afficher "Enregistrer et quitter" seulement à partir de l'étape 2
  const showSaveAndExit = currentStep >= 2;

  return (
    <div className="flex flex-row justify-between p-4">
      <div
        onClick={handleClickHome}
        className="cursor-pointer flex items-center"
      >
        <Image
          src="/logos/logo.png"
          alt="Logo"
          width={90}
          height={0}
          style={{ maxWidth: "213px", maxHeight: "80px" }}
        />
      </div>

      {showSaveAndExit ? (
        <SaveAndExitButton onClick={handleSaveAndExit}>
          Enregistrer et quitter
        </SaveAndExitButton>
      ) : (
        <SaveAndExitButton onClick={handleClickHome}>Quitter</SaveAndExitButton>
      )}
    </div>
  );
}

export default HeaderAuth;
