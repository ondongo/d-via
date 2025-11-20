"use client";
import { usePathname } from "next/navigation";
import { useSignup } from "@/providers/SignupContext";
import { useEffect } from "react";

export default function FooterAuth() {
  const pathname = usePathname();
  const {
    currentStep,
    setCurrentStep,
    step1Part,
    setStep1Part,
    handleStepAction,
    loading,
    code,
    phoneNumber,
  } = useSignup();

  useEffect(() => {
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
        setStep1Part(2);
      } else {
        setStep1Part(1);
        // Nettoyer le flag si on revient en partie 1
        sessionStorage.removeItem("codeSent");
      }
    } else if (pathname === "/signup/step2") {
      // Step2 : Situer le lieu de l'entreprise
      setCurrentStep(2);
    } else if (pathname === "/signup/step3") {
      // Step3 : Identifiez votre entreprise (étape 3)
      setCurrentStep(3);
    }
  }, [pathname, setCurrentStep, setStep1Part]);

  // Fonction pour déclencher l'action du step actuel
  const handleNext = async () => {
    await handleStepAction();
  };


  const isOnboarding = pathname === "/signup" || pathname === "/signup/";
  

  const totalSteps = 4; 

  const isButtonDisabled = () => {
    // Sur l'onboarding, le bouton n'est jamais désactivé
    if (isOnboarding) return false;
    
    if (currentStep >= totalSteps || loading) return true;
    if (currentStep === 1) {
      if (step1Part === 1 && !phoneNumber.trim()) return true;
      if (step1Part === 2 && (!code || code.length !== 6)) return true;
    }
    if (currentStep === 2) {
      // Valider que l'adresse est renseignée (via sessionStorage ou globalState)
      const storedAddress = sessionStorage.getItem("selectedAddress");
      if (!storedAddress || !storedAddress.trim()) return true;
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
                step <= currentStep ? "bg-dviaprimary-40" : "bg-[#818181]"
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
