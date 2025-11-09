"use client";
import { usePathname } from "next/navigation";
import { useSignup } from "@/providers/SignupContext";
import { useEffect } from "react";

export default function FooterAuth() {
  const pathname = usePathname();
  const {
    currentStep,
    setCurrentStep,
    handleStepAction,
    loading,
    code,
    phoneNumber,
  } = useSignup();

  useEffect(() => {
    if (pathname === "/signup/step1") {
      setCurrentStep(1);
    } else if (pathname === "/signup/step2") {
      setCurrentStep(2);
    }
    if (pathname === "/signup/step3") {
      setCurrentStep(3);
    }
  }, [pathname, setCurrentStep]);

  // Fonction pour déclencher l'action du step actuel
  const handleNext = async () => {
    await handleStepAction();
  };

  // Déterminer si le bouton doit être désactivé
  const isButtonDisabled = () => {
    if (currentStep >= 4 || loading) return true;
    if (currentStep === 1 && !phoneNumber.trim()) return true;
    if (currentStep === 2 && (!code || code.length !== 6)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-dvianeutral-96 z-[99999]">
      <div className="flex items-center gap-2 w-full">
        {[1, 2, 3, 4].map((step) => (
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
