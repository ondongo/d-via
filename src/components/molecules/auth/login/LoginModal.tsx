"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ComplexModal } from "@/components/atoms/ui/modals/ComplexModal";

type LoginClientStep = "signin" | "forgot-password" | "phone-verification";
type LoginMode = "client" | "artisan";

interface LoginClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignupClient?: () => void;
  mode?: LoginMode;
}

export default function LoginModal({
  isOpen,
  onClose,
  onOpenSignupClient,
  mode = "client",
}: LoginClientModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<LoginClientStep>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep("signin");
      setShowPassword(false);
      setFocusedField(null);
      setGoogleLoading(false);
    }
  }, [isOpen]);

  const modalTitle = useMemo(() => {
    if (step === "forgot-password") {
      return "Mot de passe oublié";
    }
    return "Content de vous revoir";
  }, [step]);

  const handleSignin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email ou mot de passe incorrect.");
        return;
      }

      toast.success("Connexion réussie.");
      onClose();
      router.push(mode === "artisan" ? "/dashboard" : "/dashboard/clients");
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetLink = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep("phone-verification");
  };

  const goToClientSignup = () => {
    if (onOpenSignupClient) {
      onClose();
      onOpenSignupClient();
      return;
    }
    onClose();
    router.push("/");
  };

  const goToArtisanSignin = () => {
    onClose();
    setStep("signin");
  };

  const handleGoogleClick = async () => {
    if (googleLoading) return;

    setGoogleLoading(true);
    try {
      const callbackUrl = mode === "artisan" ? "/dashboard" : "/dashboard/clients";
      const provider = mode === "artisan" ? "google-artisan" : "google";

      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Impossible de se connecter avec Google.");
        setGoogleLoading(false);
        return;
      }

      onClose();
      router.replace(result?.url ?? callbackUrl);
    } catch {
      toast.error("Erreur pendant la connexion Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <ComplexModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      className="md:w-[560px] md:max-h-[90vh]"
      mobileClassName="w-full rounded-t-2xl max-h-[90dvh]"
    >
      <div className="w-full">
        {step === "signin" && (
          <form className="flex flex-col gap-4" onSubmit={handleSignin}>
            <p className="text-body-small text-dvianeutralvariant-30 my-2">
              {mode === "artisan"
                ? "Connectez-vous pour accéder à votre espace artisan."
                : "Connectez-vous pour accéder à votre espace personnel."}
            </p>

            <div className="relative">
              <input
                id="client-login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="email@exemple.com"
                className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
                required
              />
              <label
                htmlFor="client-login-email"
                className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                  focusedField === "email"
                    ? "text-dvianeutral-60"
                    : "text-dvianeutral-50"
                }`}
              >
                Email
              </label>
            </div>

            <div className="relative">
              <input
                id="client-login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="********"
                className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 pr-12 focus:border-dvianeutral-60 focus:outline-none"
                required
              />
              <label
                htmlFor="client-login-password"
                className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                  focusedField === "password"
                    ? "text-dvianeutral-60"
                    : "text-dvianeutral-50"
                }`}
              >
                Mot de passe
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dvianeutralvariant-30 transition-colors duration-200 hover:text-dvianeutral-10"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="remember-client-login"
                className="flex cursor-pointer items-center gap-2 text-body-small text-dvianeutralvariant-60"
              >
                <input
                  id="remember-client-login"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-dvianeutralvariant-90 bg-transparent"
                  style={{ backgroundColor: "transparent" }}
                />
                Se souvenir de moi
              </label>

              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setStep("forgot-password");
                }}
                className="text-body-small text-dviaprimary-40 hover:underline font-semibold cursor-pointer"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-1 w-full rounded-8px bg-dviaprimary-40 py-2.5 text-label-large text-white transition-shadow duration-300 hover:shadow-sm ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="my-1 flex items-center justify-center">
              <span className="px-3 text-[11px] uppercase tracking-wide text-[#6A7282] font-medium">
                ou continuer avec
              </span>  
            </div>

            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={googleLoading}
              className={`flex w-full items-center justify-center gap-2 rounded-md text-dviaprimary-40 font-medium border border-dvianeutral-50 py-2.5 text-body-small hover:bg-dvianeutral-94 ${
                googleLoading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              <Image src="/google.svg" alt="Google" width={18} height={18} />
              {googleLoading ? "Redirection..." : "Google"}
            </button>

            <div className="mt-1 flex flex-col gap-1 text-center text-body-small">
              {mode === "client" ? (
                <button
                  type="button"
                  onClick={goToClientSignup}
                  className="text-dvianeutralvariant-60"
                >
                  Pas encore de compte client ?{" "}
                  <span className="font-semibold text-dviaprimary-40 hover:underline">
                    Créer un compte
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push("/signup");
                  }}
                  className="text-dvianeutralvariant-60"
                >
                  Pas encore de compte artisan ?{" "}
                  <span className="font-semibold text-dviaprimary-40 hover:underline">
                    Commencer l&apos;inscription
                  </span>
                </button>
              )}
            </div>
          </form>
        )}

        {step === "forgot-password" && (
          <form className="flex flex-col gap-4" onSubmit={handleSendResetLink}>
            <p className="text-body-medium text-dvianeutralvariant-30 my-2">
              Entrez votre adresse e-mail pour recevoir un lien de <br />
              réinitialisation.
            </p>

            <div className="relative">
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
                onFocus={() => setFocusedField("resetEmail")}
                onBlur={() => setFocusedField(null)}
                placeholder="email@exemple.com"
                className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
                required
              />
              <label
                htmlFor="reset-email"
                className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                  focusedField === "resetEmail"
                    ? "text-dvianeutral-60"
                    : "text-dvianeutral-50"
                }`}
              >
                Email
              </label>
            </div>

            <div className="mt-1 flex items-center justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setStep("signin")}
                className="flex-1 rounded-8px border border-dvianeutral-50 px-4 py-2 text-body-small text-dvianeutral-30"
              >
                Retour
              </button>
              <button
                type="submit"
                className="flex-1 rounded-8px bg-dviaprimary-40 px-4 py-2 text-body-small text-white"
              >
                Envoyer le lien
              </button>
            </div>
          </form>
        )}

      </div>
    </ComplexModal>
  );
}
