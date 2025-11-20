"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type SignupContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  step1Part: number; // 1 = formulaire, 2 = code de vérification
  setStep1Part: (part: number) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  code: string;
  setCode: (code: string) => void;
  loading: boolean;
  error: string;
  success: string;
  handleStepAction: () => Promise<void>;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  setLoading: (loading: boolean) => void;
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [step1Part, setStep1Part] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Valider le format du numéro de téléphone
  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    if (!cleaned.startsWith("+")) {
      return false;
    }
    const digits = cleaned.substring(1);
    return /^\d{10,14}$/.test(digits);
  };

  // Action pour Step 1 : Envoyer le code
  const handleStep1Action = useCallback(async () => {
    if (!phoneNumber.trim()) {
      toast.error("Veuillez entrer un numéro de téléphone");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error(
        "Veuillez entrer un numéro de téléphone valide (ex: +33 7 89 54 36 18)"
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/twilio/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Code envoyé avec succès !");
        sessionStorage.setItem("phoneNumber", phoneNumber);
        sessionStorage.setItem("codeSent", "true"); // Flag pour indiquer que le code a été envoyé
        // Passer à la partie 2 du Step1 (saisie du code)
        setStep1Part(2);
      } else {
        toast.error(data.error || "Erreur lors de l'envoi du code");
      }
    } catch (err: any) {
      toast.error("Erreur de connexion. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, router]);

  // Action pour Step 2 : Vérifier le code
  const handleStep2Action = useCallback(async () => {
    if (!phoneNumber) {
      toast.error("Numéro de téléphone non trouvé. Veuillez recommencer.");
      return;
    }

    if (!code || code.length !== 6) {
      toast.error("Veuillez entrer un code à 6 chiffres");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/twilio/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, code }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        toast.success("Code vérifié avec succès !");
        // Nettoyer le flag car le code est vérifié
        sessionStorage.removeItem("codeSent");
        setCurrentStep(2); // Passer à Step2 : Situer le lieu de l'entreprise
        router.push("/signup/step2");
      } else {
        toast.error(data.error || "Code invalide ou expiré");
      }
    } catch (err: any) {
      toast.error("Erreur de connexion. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, code, router]);

  // Fonction principale qui appelle l'action appropriée selon le step
  const handleStepAction = useCallback(async () => {
    // currentStep === 0 correspond à l'onboarding, qui n'est pas une étape
    // On passe directement à l'étape 1 (Step1)
    if (currentStep === 0) {
      setCurrentStep(1);
      setStep1Part(1);
      router.push("/signup/step1");
    } else if (currentStep === 1) {
      if (step1Part === 1) {
        // Partie 1 : Envoyer le code
        await handleStep1Action();
      } else if (step1Part === 2) {
        // Partie 2 : Vérifier le code
        await handleStep2Action();
      }
    } else if (currentStep === 2) {
      // Step2 : Situer le lieu de l'entreprise
      // Valider l'adresse et passer à Step3
      const storedAddress = sessionStorage.getItem("selectedAddress");
      if (!storedAddress || !storedAddress.trim()) {
        toast.error("Veuillez renseigner l'adresse de votre entreprise");
        return;
      }
      setCurrentStep(3);
      router.push("/signup/step3");
    } else if (currentStep === 3) {
      // Step3 : Identifiez votre entreprise
      // Après Step3, on peut passer à l'étape suivante si elle existe
      // router.push("/signup/step4");
    } else if (currentStep === 4) {
      // Étape 4 : Fournissez vos garanties professionnelles
      // router.push("/signup/step5");
    } else if (currentStep === 5) {
      // Étape 5 : Présentez votre profil pro
      // router.push("/dashboard");
    }
  }, [currentStep, step1Part, handleStep1Action, handleStep2Action]);

  // Charger le numéro depuis sessionStorage au montage
  React.useEffect(() => {
    const storedPhone = sessionStorage.getItem("phoneNumber");
    if (storedPhone) {
      setPhoneNumber(storedPhone);
      // Ne pas mettre step1Part à 2 automatiquement - cela sera fait par FooterAuth
      // ou après l'envoi réussi du code
    }
  }, []);

  return (
    <SignupContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        step1Part,
        setStep1Part,
        phoneNumber,
        setPhoneNumber,
        code,
        setCode,
        loading,
        error,
        success,
        handleStepAction,
        setError,
        setSuccess,
        setLoading,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};

// Hook custom
export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
};
