"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";
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
    setIsSave 
  } = useSignupStore();
  const { saveFormData, collectCurrentFormData, clearFormData } = useSignupForm();
  const { coordinates } = useGlobalState();
  const { resetStore } = useSignupStore();

  const handleClickHome = () => {
    // Nettoyer les cookies
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
    
    // Sauvegarder dans un cookie pour le middleware (expire dans 7 jours)
    signupCookies.setSavedStep(currentStep);
    signupCookies.setIsSave(true);
    
    // Attendre un peu pour s'assurer que les cookies sont écrits
    // Puis rediriger vers la page d'accueil
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Utiliser window.location pour forcer un rechargement complet et permettre au middleware de s'exécuter
    window.location.href = "/";
  };

  // Afficher "Enregistrer et quitter" seulement à partir de l'étape 2
  const showSaveAndExit = currentStep >= 2;

  return (
    <div className="flex flex-row justify-between p-4">
      <div onClick={handleClickHome} className="cursor-pointer flex items-center">
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
        <SaveAndExitButton onClick={handleClickHome}>
          Quitter
        </SaveAndExitButton>
      )}
    </div>
  );
}

export default HeaderAuth;
