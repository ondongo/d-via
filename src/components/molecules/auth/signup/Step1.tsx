"use client";

import { useState, useCallback, useEffect } from "react";
import { useSignupStore } from "@/stores/signupStore";
import { useSignupForm } from "@/hooks/useSignupForm";
import CodePinInput from "@/components/atoms/auth/CodePinInput";

export default function Step1() {
  const { phoneNumber, setPhoneNumber, setError, getStepPart, code, setCode } =
    useSignupStore();
  const { loadFormData } = useSignupForm();
  const step1Part = getStepPart(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Charger les données au montage
  useEffect(() => {
    const data = loadFormData();
    if (data.firstName) setFirstName(data.firstName);
    if (data.lastName) setLastName(data.lastName);
    if (data.email) setEmail(data.email);
    if (data.password) setPassword(data.password);
  }, [loadFormData]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      setError("");
    },
    [setCode, setError]
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^\d+\s\-()]/g, "");
    setPhoneNumber(cleanedValue);
    setError("");
  };

  // Partie 2 : Saisie du code de vérification
  if (step1Part === 2) {
    return (
      <div className="flex flex-col border-dvianeutral-50 border-1 rounded-8px p-8 max-w-[600px] min-h-[272px] gap-4">
        <h1 className="whitespace-nowrap hidden md:block text-[54px] font-bold leading-display-large tracking-display-large text-dvianeutral-10">
          Entrer le code
        </h1>

        <p className="font-normal text-body-small leading-body-small tracking-body-small gap-5 md:text-[16px] text-dvianeutral-10 md:leading-headline-small md:tracking-headline-small md:mb-10">
          Nous avons envoyé un code de vérification à 6 chiffres à votre numéro
          de téléphone{" "}
          {phoneNumber && (
            <span className="text-dvianeutral-10 font-bold">{phoneNumber}</span>
          )}
        </p>

        <CodePinInput onChange={handleCodeChange} value={code} />
      </div>
    );
  }

  // Partie 1 : Formulaire d'inscription
  return (
    <div className="flex flex-col border-dvianeutral-50 p-8 max-w-[600px] min-h-[272px] gap-4">
      <div className="flex flex-col gap-4 w-full">
        {/* Nom et Prénom en 2 colonnes */}
        <div className="flex gap-4 w-full">
          <div className="relative flex-1">
            <input
              id="lastName-input"
              type="text"
              placeholder="Nom"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setError("");
              }}
              onFocus={() => setFocusedField("lastName")}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none"
            />
            <label
              htmlFor="lastName-input"
              className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
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
              id="firstName-input"
              type="text"
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setError("");
              }}
              onFocus={() => setFocusedField("firstName")}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none"
            />
            <label
              htmlFor="firstName-input"
              className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
                focusedField === "firstName"
                  ? "text-dvianeutral-60"
                  : "text-dvianeutral-50"
              }`}
            >
              Prénom
            </label>
          </div>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            id="email-input"
            type="email"
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none"
          />
          <label
            htmlFor="email-input"
            className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
              focusedField === "email"
                ? "text-dvianeutral-60"
                : "text-dvianeutral-50"
            }`}
          >
            Email
          </label>
        </div>

        {/* Mot de passe */}
        <div className="relative">
          <input
            id="password-input"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 pr-12 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none"
          />
          <label
            htmlFor="password-input"
            className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
              focusedField === "password"
                ? "text-dvianeutral-60"
                : "text-dvianeutral-50"
            }`}
          >
            Mot de passe
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-dvianeutralvariant-30 hover:text-dvianeutral-10 transition-colors duration-200 cursor-pointer z-10"
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 3m3.29 3.29L3 3m0 0l18 18m0 0l-3.29-3.29m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Téléphone */}
        <div className="relative">
          <input
            id="phone-input"
            type="tel"
            placeholder="+33 7 89 54 36 18"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onFocus={() => setFocusedField("phone")}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none"
          />
          <label
            htmlFor="phone-input"
            className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
              focusedField === "phone"
                ? "text-dvianeutral-60"
                : "text-dvianeutral-50"
            }`}
          >
            Téléphone
          </label>
        </div>
      </div>
    </div>
  );
}
