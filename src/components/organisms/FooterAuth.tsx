"use client";
import { usePathname } from "next/navigation";
import { useSignupStore } from "@/stores/signupStore";
import { useSignupForm } from "@/hooks/useSignupForm";
import { useGlobalState } from "@/providers/globalState";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signupCookies } from "@/utils/cookies";

export default function FooterAuth() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentStep,
    setCurrentStep,
    getStepPart,
    setStepPart,
    handleStepAction,
    loading,
    code,
    phoneNumber,
    siret,
    companyName,
    legalName,
    legalStatus,
    setCompanyName,
    setLegalName,
    setLegalStatus,
    setSiret,
    completedSteps,
    stepParts,
  } = useSignupStore();
  const { coordinates, setSelectedAddress, setCoordinates } = useGlobalState();
  const { collectCurrentFormData, saveFormData, loadFormData } = useSignupForm();

  useEffect(() => {
    // Restaurer l'état depuis localStorage si isSave est true
    const savedData = loadFormData();
    if (savedData.isSave && savedData.currentStep) {
      setCurrentStep(savedData.currentStep);
      if (savedData.stepParts) {
        Object.entries(savedData.stepParts).forEach(([step, part]) => {
          setStepPart(Number(step), part as number);
        });
      }
      if (savedData.completedSteps && Array.isArray(savedData.completedSteps)) {
        savedData.completedSteps.forEach((step: number) => {
          useSignupStore.getState().markStepCompleted(step);
        });
      }
      // Restaurer l'adresse et les coordonnées
      if (savedData.address) {
        setSelectedAddress(savedData.address);
        sessionStorage.setItem("selectedAddress", savedData.address);
      }
      if (savedData.coordinates && Array.isArray(savedData.coordinates) && savedData.coordinates.length === 2) {
        setCoordinates(savedData.coordinates as [number, number]);
      }
      
      // Restaurer les valeurs du formulaire Step2 dans le store
      if (savedData.companyName) setCompanyName(savedData.companyName);
      if (savedData.legalName) setLegalName(savedData.legalName);
      if (savedData.legalStatus) setLegalStatus(savedData.legalStatus);
      if (savedData.siret) setSiret(savedData.siret);
      
      // Ne pas supprimer les cookies ici - ils doivent rester pour permettre la redirection
      // Les cookies seront supprimés uniquement quand :
      // 1. L'utilisateur complète toutes les étapes (ligne 147)
      // 2. L'utilisateur clique sur "Quitter" dans HeaderAuth (ligne 32)
    }

    // L'onboarding n'est pas une étape, donc on ne met pas à jour currentStep
    if (pathname === "/signup" || pathname === "/signup/") {
      // Onboarding - ne pas mettre à jour currentStep
      return;
    }

    if (pathname === "/signup/step1") {
      setCurrentStep(1);
      // Vérifier si on a un code en cours de vérification dans sessionStorage
      // Si oui, on est en partie 2, sinon on est en partie 1
      const storedPhone = sessionStorage.getItem("phoneNumber");
      const codeSent = sessionStorage.getItem("codeSent"); // Flag pour savoir si le code a été envoyé
      if (storedPhone && codeSent === "true") {
        setStepPart(1, 2);
      } else {
        setStepPart(1, 1);
        // Nettoyer le flag si on revient en partie 1
        sessionStorage.removeItem("codeSent");
      }
    } else if (pathname === "/signup/step2") {
      // Step2 : Situer le lieu de l'entreprise (2 parties)
      setCurrentStep(2);
      const storedAddress = sessionStorage.getItem("selectedAddress");
      if (storedAddress && !getStepPart(2)) {
        setStepPart(2, 2); // Si adresse existe, on est en partie 2
      } else {
        setStepPart(2, 1); // Sinon partie 1
      }
    } else if (pathname === "/signup/step3") {
      // Step3 : Identifiez votre entreprise (1 partie)
      setCurrentStep(3);
      setStepPart(3, 1);
    } else if (pathname === "/signup/step4") {
      // Step4 : Présentez votre profil pro (3 parties)
      setCurrentStep(4);
      // Charger la partie depuis localStorage si disponible
      const data = localStorage.getItem("signupFormData");
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed.stepParts && parsed.stepParts[4]) {
            setStepPart(4, parsed.stepParts[4]);
          } else {
            setStepPart(4, 1);
          }
        } catch {
          setStepPart(4, 1);
        }
      } else {
        setStepPart(4, 1);
      }
    }
  }, [pathname, setCurrentStep, setStepPart, loadFormData, setCompanyName, setLegalName, setLegalStatus, setSiret, setSelectedAddress, setCoordinates]);


  const handleNext = async () => {
    // Sauvegarder toutes les données avant de passer à l'étape suivante (silent pour éviter le toast)
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
    }, true);
    
    // Si on complète la dernière étape, nettoyer les cookies
    if (currentStep === 4 && getStepPart(4) === 3) {
      try {
        await fetch("/api/auth/signup/clear-cookies", {
          method: "POST",
        });
      } catch (error) {
        console.error("Erreur lors du nettoyage des cookies:", error);
      }
      // Fallback: nettoyer aussi côté client
      signupCookies.clear();
    }
    
    await handleStepAction(router);
  };

  const isOnboarding = pathname === "/signup" || pathname === "/signup/";

  const totalSteps = 4;

  const isButtonDisabled = () => {
    if (isOnboarding) return false;

    if (currentStep > totalSteps || loading) return true;
    if (currentStep === 1) {
      const step1Part = getStepPart(1);
      if (step1Part === 1 && !phoneNumber.trim()) return true;
      if (step1Part === 2 && (!code || code.length !== 6)) return true;
    }
    if (currentStep === 2) {
      const step2Part = getStepPart(2);
      if (step2Part === 1) {
        // Vérifier les champs du formulaire Step2 partie 1 depuis le store
        const companyNameTrimmed = companyName?.trim() || "";
        const legalNameTrimmed = legalName?.trim() || "";
        const siretTrimmed = siret?.trim() || "";
        const legalStatusValue = legalStatus || "";
        
        // Le bouton est désactivé si au moins un champ requis est vide
        if (!companyNameTrimmed || !legalNameTrimmed || !siretTrimmed || !legalStatusValue) return true;
      }
      if (step2Part === 2) {
        // Partie 2 : Vérifier que l'adresse est sélectionnée
        const storedAddress = sessionStorage.getItem("selectedAddress");
        if (!storedAddress || !storedAddress.trim()) return true;
      }
    }
    if (currentStep === 3) {
      // Validation Step3 peut être ajoutée ici
    }
    if (currentStep === 4) {
      const step4Part = getStepPart(4);
      // Validation Step4 peut être ajoutée ici selon les parties
    }
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-dvianeutral-96 z-[99999]">
      <div className="flex items-center gap-2 w-full">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`transition-colors duration-300 flex-1 ${
              completedSteps.has(step) ? "bg-dviaprimary-40" : "bg-[#818181]"
            }`}
            style={{
              height: "4px",
            }}
          />
        ))}
      </div>

      <div className="w-full flex items-center justify-end px-4 py-6">
        <button
          onClick={handleNext}
          className="text-label-large leading-label-large tracking-label-large px-4 py-2 rounded-8px text-sm font-medium text-white bg-dviaprimary-40 hover:opacity-90 transition-opacity duration-300 cursor-pointer h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isButtonDisabled()}
        >
          {loading ? "Chargement..." : "Suivant"}
        </button>
      </div>
    </div>
  );
}
