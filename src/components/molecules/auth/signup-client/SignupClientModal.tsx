"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CodePinInput from "@/components/atoms/auth/CodePinInput";
import { ComplexModal } from "@/components/atoms/ui/modals/ComplexModal";
import { signupClientAction } from "@/services/auth/signup-client";

type SignupClientStep = "account" | "phone-verification";

interface SignupClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLoginClient?: () => void;
}

export default function SignupClientModal({
  isOpen,
  onClose,
  onOpenLoginClient,
}: SignupClientModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<SignupClientStep>("account");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+33");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep("account");
      setLoading(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setFocusedField(null);
      setVerificationCode("");
    }
  }, [isOpen]);

  const fullPhoneNumber = `${countryCode}${phoneNumber}`
    .replace(/\s+/g, " ")
    .trim();

  const validateAccountForm = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return false;
    }

    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return false;
    }

    if (!acceptTerms) {
      toast.error(
        "Veuillez accepter les conditions d'utilisation et la politique de confidentialité."
      );
      return false;
    }

    const cleaned = fullPhoneNumber.replace(/[\s\-()]/g, "");
    if (!cleaned.startsWith("+") || !/^\+\d{10,14}$/.test(cleaned)) {
      toast.error(
        "Veuillez entrer un numéro de téléphone valide (ex: +33 7 89 54 36 18)."
      );
      return false;
    }

    return true;
  };

  const handleSendCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAccountForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/twilio/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Impossible d'envoyer le code.");
        return;
      }

      toast.success("Code envoyé avec succès.");
      setStep("phone-verification");
    } catch (error) {
      console.error(error);
      toast.error("Erreur réseau pendant l'envoi du code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndCreateAccount = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Veuillez saisir un code à 6 chiffres.");
      return;
    }

    setLoading(true);
    try {
      const verifyResponse = await fetch("/api/twilio/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
          code: verificationCode,
        }),
      });
      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.verified) {
        toast.error(verifyData.error || "Code invalide ou expiré.");
        return;
      }
      const signupData = await signupClientAction({
        firstName,
        lastName,
        email,
        password,
        phoneNumber: fullPhoneNumber,
      });

      if (!signupData.success) {
        const actionError =
          "error" in signupData
            ? signupData.error
            : "Impossible de créer votre compte client.";
        toast.error(actionError);
        return;
      }

      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginResult?.error) {
        toast.error("Compte créé, mais connexion impossible. Connectez-vous.");
        onClose();
        return;
      }

      toast.success("Inscription réussie. Bienvenue !");
      onClose();
      router.push("/dashboard/clients");
    } catch (error) {
      console.error(error);
      toast.error("Erreur réseau pendant la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComplexModal
      isOpen={isOpen}
      onClose={onClose}
      title={step === "account" ? "Créer un compte" : "Vérification du téléphone"}
      className="md:w-[560px] md:max-h-[90vh]"
      mobileClassName="w-full rounded-t-2xl max-h-[90dvh]"
    >
      <div className="w-full">
        {step === "account" && (
          <form className="flex flex-col gap-4" onSubmit={handleSendCode}>
            <p className="text-body-medium text-dvianeutralvariant-30 my-2">
              Renseignez vos informations pour commencer.
            </p>

            <div className="flex w-full gap-4">
              <div className="relative flex-1">
                <input
                  id="client-signup-lastname"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Nom"
                  className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
                />
                <label
                  htmlFor="client-signup-lastname"
                  className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                    focusedField === "lastName"
                      ? "text-dvianeutral-60"
                      : "text-dvianeutral-50"
                  }`}
                >
                  Nom
                </label>
              </div>

              <div className="relative flex-1">
                <input
                  id="client-signup-firstname"
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Prénom"
                  className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
                />
                <label
                  htmlFor="client-signup-firstname"
                  className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                    focusedField === "firstName"
                      ? "text-dvianeutral-60"
                      : "text-dvianeutral-50"
                  }`}
                >
                  Prénom
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                id="client-signup-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="email@exemple.com"
                className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
              />
              <label
                htmlFor="client-signup-email"
                className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                  focusedField === "email"
                    ? "text-dvianeutral-60"
                    : "text-dvianeutral-50"
                }`}
              >
                Email
              </label>
            </div>

            <div className="flex gap-4">
              <div className="relative w-[92px]">
                <input
                  id="client-signup-country-code"
                  type="text"
                  value={countryCode}
                  onChange={(event) =>
                    setCountryCode(event.target.value.replace(/[^\d+]/g, ""))
                  }
                  onFocus={() => setFocusedField("countryCode")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="+33"
                  className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
                />
                <label
                  htmlFor="client-signup-country-code"
                  className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                    focusedField === "countryCode"
                      ? "text-dvianeutral-60"
                      : "text-dvianeutral-50"
                  }`}
                >
                  Pays
                </label>
              </div>

              <div className="relative flex-1">
                <input
                  id="client-signup-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(
                      event.target.value.replace(/[^\d\s\-()]/g, "")
                    )
                  }
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="7 89 54 36 18"
                  className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
                />
                <label
                  htmlFor="client-signup-phone"
                  className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                    focusedField === "phone"
                      ? "text-dvianeutral-60"
                      : "text-dvianeutral-50"
                  }`}
                >
                  Téléphone
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                id="client-signup-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="********"
                className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 pr-12 focus:border-dvianeutral-60 focus:outline-none"
              />
              <label
                htmlFor="client-signup-password"
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

            <div className="relative">
              <input
                id="client-signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 pr-12 focus:border-dvianeutral-60 focus:outline-none"
              />
              <label
                htmlFor="client-signup-confirm-password"
                className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-[var(--background)] px-1 text-xs transition-colors duration-200 ${
                  focusedField === "confirmPassword"
                    ? "text-dvianeutral-60"
                    : "text-dvianeutral-50"
                }`}
              >
                Confirmer le mot de passe
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dvianeutralvariant-30 transition-colors duration-200 hover:text-dvianeutral-10"
                aria-label={
                  showConfirmPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>

            <label
              htmlFor="accept-client-terms"
              className="flex cursor-pointer items-start gap-2 text-[12px] text-dvianeutralvariant-60"
            >
              <input
                id="accept-client-terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(event) => setAcceptTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-dvianeutralvariant-90 bg-transparent"
                style={{ backgroundColor: "transparent" }}
              />
              J&apos;accepte les conditions d&apos;utilisation et la politique de
              confidentialité.
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-8px bg-dviaprimary-40 py-2.5 text-label-large text-white transition-shadow duration-300 hover:shadow-sm ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {loading ? "Envoi..." : "Créer un compte"}
            </button>

            <div className="my-1 flex items-center justify-center">
              <span className="px-3 text-[11px] uppercase tracking-wide text-[#6A7282] font-medium">
                ou continuer avec
              </span>
            </div>

            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard/clients" })}
              className="flex w-full items-center justify-center gap-2 rounded-md text-dviaprimary-40 font-medium border border-dvianeutral-50 py-2.5 text-body-small hover:bg-dvianeutral-94"
            >
              <Image src="/google.svg" alt="Google" width={18} height={18} />
              Google
            </button>

            <div className="mt-1 flex flex-col gap-1 text-center text-body-small">
              <button
                type="button"
                onClick={() => {
                  if (onOpenLoginClient) {
                    onClose();
                    onOpenLoginClient();
                    return;
                  }
                  onClose();
                }}
                className="text-dvianeutralvariant-60"
              >
                Vous avez un compte ?{" "}
                <span className="font-semibold text-dviaprimary-40 hover:underline">
                  Connexion client
                </span>
              </button>
            </div>
          </form>
        )}

        {step === "phone-verification" && (
          <div className="flex flex-col gap-5">
            <p className="text-body-small text-dvianeutral-30">
              Confirmez votre numéro pour sécuriser votre compte.
            </p>

            <div className="rounded-8px border border-dvianeutral-50 p-4">
              <h2 className="text-headline-medium text-dvianeutral-10">
                Entrer le code
              </h2>
              <p className="mt-2 text-body-small text-dvianeutral-30">
                Nous avons envoyé un code de vérification à 6 chiffres à votre
                numéro{" "}
                <span className="font-bold text-dvianeutral-10">
                  {fullPhoneNumber}
                </span>
                .
              </p>
              <div className="mt-4">
                <CodePinInput
                  value={verificationCode}
                  onChange={setVerificationCode}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setStep("account")}
                className="rounded-8px border border-dvianeutral-50 px-4 py-2 text-body-small text-dvianeutral-30"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={handleVerifyAndCreateAccount}
                disabled={loading}
                className={`rounded-8px bg-dviaprimary-40 px-4 py-2 text-body-small text-white ${
                  loading ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {loading ? "Validation..." : "Valider"}
              </button>
            </div>
          </div>
        )}
      </div>
    </ComplexModal>
  );
}
