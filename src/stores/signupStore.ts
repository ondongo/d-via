import { create } from "zustand";
import { toast } from "react-toastify";

interface SignupState {

  /******************************************************
   * Navigation state
   ******************************************************/
  currentStep: number;
  stepParts: Record<number, number>;
  completedSteps: Set<number>;

  /******************************************************
   * Form data
   ******************************************************/
  phoneNumber: string;
  code: string;
  siret: string;
  companyExists: boolean | null;
  siretVerified: boolean;
  // Step1
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // Step2
  address: string;
  coordinates: [number, number] | null;
  companyName: string;
  legalName: string;
  legalStatus: string;
  // Step4
  services: string;
  experienceYears: string;
  specialties: string;
  description: string;
  // Save state
  isSave: boolean;

  /******************************************************
   * UI state
   ******************************************************/
  loading: boolean;
  error: string;
  success: string;

  /******************************************************
   * Actions
   ******************************************************/
  setCurrentStep: (step: number) => void;
  setStepPart: (step: number, part: number) => void;
  getStepPart: (step: number) => number;
  markStepCompleted: (step: number) => void;
  isStepCompleted: (step: number) => boolean;

  setPhoneNumber: (phone: string) => void;
  setCode: (code: string) => void;
  setSiret: (siret: string) => void;
  setCompanyExists: (exists: boolean | null) => void;
  setSiretVerified: (verified: boolean) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setAddress: (address: string) => void;
  setCoordinates: (coordinates: [number, number] | null) => void;
  setCompanyName: (companyName: string) => void;
  setLegalName: (legalName: string) => void;
  setLegalStatus: (legalStatus: string) => void;
  setServices: (services: string) => void;
  setExperienceYears: (experienceYears: string) => void;
  setSpecialties: (specialties: string) => void;
  setDescription: (description: string) => void;
  setIsSave: (isSave: boolean) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;

  resetStore: () => void;

  verifySiret: (siret: string) => Promise<void>;
  handleStep1Part1Action: (router: any) => Promise<void>;
  handleStep1Part2Action: (router: any) => Promise<void>;
  handleStepAction: (router: any) => Promise<void>;
}

export const useSignupStore = create<SignupState>((set, get) => ({
  /******************************************************
   * Initial state
   ******************************************************/
  currentStep: 0,
  stepParts: { 1: 1, 2: 1, 3: 1, 4: 1 },
  completedSteps: new Set<number>(),
  phoneNumber: "",
  code: "",
  siret: "",
  companyExists: null,
  siretVerified: false,
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  address: "",
  coordinates: null,
  companyName: "",
  legalName: "",
  legalStatus: "",
  services: "",
  experienceYears: "",
  specialties: "",
  description: "",
  isSave: false,
  loading: false,
  error: "",
  success: "",

  /******************************************************
   * Navigation actions
   ******************************************************/
  setCurrentStep: (step) => set({ currentStep: step }),

  setStepPart: (step, part) =>
    set((state) => ({
      stepParts: { ...state.stepParts, [step]: part },
    })),

  getStepPart: (step) => {
    const state = get();
    return state.stepParts[step] || 1;
  },

  markStepCompleted: (step) =>
    set((state) => {
      const newSet = new Set(state.completedSteps);
      newSet.add(step);
      return { completedSteps: newSet };
    }),

  isStepCompleted: (step) => {
    const state = get();
    return state.completedSteps.has(step);
  },

  /******************************************************
   * Form data setters
   ******************************************************/
  setPhoneNumber: (phone) => set({ phoneNumber: phone }),
  setCode: (code) => set({ code }),
  setSiret: (siret) => set({ siret }),
  setCompanyExists: (exists) => set({ companyExists: exists }),
  setSiretVerified: (verified) => set({ siretVerified: verified }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setAddress: (address) => set({ address }),
  setCoordinates: (coordinates) => set({ coordinates }),
  setCompanyName: (companyName) => set({ companyName }),
  setLegalName: (legalName) => set({ legalName }),
  setLegalStatus: (legalStatus) => set({ legalStatus }),
  setServices: (services) => set({ services }),
  setExperienceYears: (experienceYears) => set({ experienceYears }),
  setSpecialties: (specialties) => set({ specialties }),
  setDescription: (description) => set({ description }),
  setIsSave: (isSave) => set({ isSave }),

  /******************************************************
   * UI state setters
   ******************************************************/
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),

  /******************************************************
   * Reset store to initial state
   ******************************************************/
  resetStore: () => set({
    currentStep: 0,
    stepParts: { 1: 1, 2: 1, 3: 1, 4: 1 },
    completedSteps: new Set<number>(),
    phoneNumber: "",
    code: "",
    siret: "",
    companyExists: null,
    siretVerified: false,
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
    coordinates: null,
    companyName: "",
    legalName: "",
    legalStatus: "",
    services: "",
    experienceYears: "",
    specialties: "",
    description: "",
    isSave: false,
    loading: false,
    error: "",
    success: "",
  }),

  /******************************************************
   * Validate phone number
   ******************************************************/
  validatePhoneNumber: (phone: string): boolean => {
    const cleaned = phone.replace(/[\s\-()]/g, "");
    if (!cleaned.startsWith("+")) {
      return false;
    }
    const digits = cleaned.substring(1);
    return /^\d{10,14}$/.test(digits);
  },

  /******************************************************
   * Verify SIRET
   ******************************************************/
  verifySiret: async (siretValue: string) => {
    if (siretValue.length !== 14 || !/^\d{14}$/.test(siretValue)) {
      set({ companyExists: null, siretVerified: false });
      return;
    }

    set({ loading: true, error: "" });
    try {
      const response = await fetch("/api/verify_siret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siret: siretValue }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.isExist !== undefined) {
          set({
            companyExists: data.isExist,
            siretVerified: true,
          });
          if (data.isExist) {
            toast.success(
              data.nomEntreprise
                ? `SIRET vérifié avec succès : ${data.nomEntreprise}`
                : "SIRET vérifié avec succès"
            );
          } else {
            toast.error("SIRET introuvable dans le répertoire Sirene");
          }
          if (data.nomEntreprise) {
            sessionStorage.setItem(
              `siret_${siretValue}_nomEntreprise`,
              data.nomEntreprise
            );
          }
        } else if (data.validSiret === false) {
          set({
            companyExists: false,
            siretVerified: true,
          });
          set({ error: "SIRET introuvable dans le répertoire Sirene" });
          toast.error("SIRET introuvable dans le répertoire Sirene");
        }
      } else {
        const errorMessage = data.error || "Erreur lors de la vérification du SIRET";
        set({
          error: errorMessage,
          companyExists: null,
          siretVerified: false,
        });
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = "Erreur de connexion lors de la vérification du SIRET";
      set({
        error: errorMessage,
        companyExists: null,
        siretVerified: false,
      });
      toast.error(errorMessage);
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  /******************************************************
   * Step 1 Part 1 Action: Send OTP
   ******************************************************/
  handleStep1Part1Action: async (router) => {
    const state = get();
    if (!state.phoneNumber.trim()) {
      toast.error("Veuillez entrer un numéro de téléphone");
      return;
    }

    const cleaned = state.phoneNumber.replace(/[\s\-()]/g, "");
    if (!cleaned.startsWith("+") || !/^\d{10,14}$/.test(cleaned.substring(1))) {
      toast.error(
        "Veuillez entrer un numéro de téléphone valide (ex: +33 7 89 54 36 18)"
      );
      return;
    }

    set({ loading: true, error: "", success: "" });

    try {
      const response = await fetch("/api/twilio/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: state.phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Code envoyé avec succès !");
        sessionStorage.setItem("phoneNumber", state.phoneNumber);
        sessionStorage.setItem("codeSent", "true");
        // Stocker le timestamp d'envoi pour vérifier l'expiration (5 minutes)
        sessionStorage.setItem("codeSentAt", Date.now().toString());
        set((prev) => ({
          stepParts: { ...prev.stepParts, 1: 2 },
        }));
      } else {
        toast.error(data.error || "Erreur lors de l'envoi du code");
      }
    } catch (err: any) {
      toast.error("Erreur de connexion. Veuillez réessayer.");
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  /******************************************************
   * Step 1 Part 2 Action: Verify OTP
   ******************************************************/
  handleStep1Part2Action: async (router) => {
    const state = get();
    if (!state.phoneNumber) {
      toast.error("Numéro de téléphone non trouvé. Veuillez recommencer.");
      return;
    }

    if (!state.code || state.code.length !== 6) {
      toast.error("Veuillez entrer un code à 6 chiffres");
      return;
    }

    // Vérifier si le code a expiré (5 minutes = 300000 ms)
    const codeSentAt = sessionStorage.getItem("codeSentAt");
    const CODE_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes
    if (codeSentAt) {
      const elapsed = Date.now() - parseInt(codeSentAt, 10);
      if (elapsed > CODE_EXPIRATION_TIME) {
        // Le code a expiré, renvoyer automatiquement un nouveau code
        toast.info("Le code a expiré. Un nouveau code est en cours d'envoi...");
        await state.handleStep1Part1Action(router);
        toast.info("Veuillez utiliser le nouveau code reçu.");
        return;
      }
    }

    set({ loading: true, error: "", success: "" });

    try {
      const response = await fetch("/api/twilio/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: state.phoneNumber,
          code: state.code,
        }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        toast.success("Code vérifié avec succès !");
        sessionStorage.removeItem("codeSent");
        sessionStorage.removeItem("codeSentAt");
        const newCompleted = new Set(state.completedSteps);
        newCompleted.add(1);
        set({
          completedSteps: newCompleted,
          currentStep: 2,
        });
        router.push("/signup/step2");
      } else {
        // Si le code est expiré selon l'API, renvoyer automatiquement
        if (data.error && (data.error.includes("expiré") || data.error.includes("not found"))) {
          toast.info("Le code a expiré. Un nouveau code est en cours d'envoi...");
          await state.handleStep1Part1Action(router);
          toast.info("Veuillez utiliser le nouveau code reçu.");
        } else {
          toast.error(data.error || "Code invalide ou expiré");
        }
      }
    } catch (err: any) {
      toast.error("Erreur de connexion. Veuillez réessayer.");
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  /******************************************************
   * Main step action handler
   ******************************************************/
  handleStepAction: async (router) => {
    const state = get();

    if (state.currentStep === 0) {
      set({ currentStep: 1, stepParts: { 1: 1 } });
      router.push("/signup/step1");
    } else if (state.currentStep === 1) {
      const step1Part = state.stepParts[1] || 1;
      if (step1Part === 1) {
        await state.handleStep1Part1Action(router);
      } else if (step1Part === 2) {
        await state.handleStep1Part2Action(router);
      }
    } else if (state.currentStep === 2) {
      const step2Part = state.stepParts[2] || 1;
      if (step2Part === 1) {
        // Partie 1 : Valider les champs du formulaire et passer à la partie 2 (carte)
        // Ne pas vérifier l'adresse ici, elle sera vérifiée à la partie 2
        set((prev) => ({
          stepParts: { ...prev.stepParts, 2: 2 },
        }));
      } else if (step2Part === 2) {
        // Partie 2 : Valider l'adresse et passer à Step3
        // Vérifier l'adresse dans le store d'abord, puis dans sessionStorage
        const address = state.address || sessionStorage.getItem("selectedAddress");
        if (!address || !address.trim()) {
          toast.error("Veuillez renseigner l'adresse de votre entreprise");
          return;
        }
        const newCompleted = new Set(state.completedSteps);
        newCompleted.add(2);
        set({
          completedSteps: newCompleted,
          currentStep: 3,
        });
        router.push("/signup/step3");
      }
    } else if (state.currentStep === 3) {
      // Step3 : Identifiez votre entreprise (1 partie)
      const newCompleted = new Set(state.completedSteps);
      newCompleted.add(3);
      set({
        completedSteps: newCompleted,
        currentStep: 4,
      });
      router.push("/signup/step4");
    } else if (state.currentStep === 4) {
      const step4Part = state.stepParts[4] || 1;
      if (step4Part === 1) {
        // Partie 1 : Passer à partie 2
        set((prev) => ({
          stepParts: { ...prev.stepParts, 4: 2 },
        }));
      } else if (step4Part === 2) {
        // Partie 2 : Passer à partie 3
        set((prev) => ({
          stepParts: { ...prev.stepParts, 4: 3 },
        }));
      } else if (step4Part === 3) {
        // Partie 3 : Compléter Step4
        const newCompleted = new Set(state.completedSteps);
        newCompleted.add(4);
        set({
          completedSteps: newCompleted,
          currentStep: 5, // Ou dashboard selon votre flow
        });
        // router.push("/dashboard");
      }
    }
  },
}));

/******************************************************
 * Load phone numƒber from sessionStorage on mount
 ******************************************************/
if (typeof window !== "undefined") {
  const storedPhone = sessionStorage.getItem("phoneNumber");
  if (storedPhone) {
    useSignupStore.getState().setPhoneNumber(storedPhone);
  }
}
