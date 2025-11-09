"use client";

import { useState } from "react";
import { useSignup } from "@/providers/SignupContext";

export default function Step3() {
  const { error, success, setError } = useSignup();
  const [companyName, setCompanyName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [siret, setSiret] = useState("");
  const [legalStatus, setLegalStatus] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSiretChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/\s/g, "");
    if (cleanedValue.length <= 14) {
      setSiret(cleanedValue);
      setError("");
    }
  };

  return (
    <div className="flex flex-col border-dvianeutral-50 p-8 max-w-[600px] min-h-[272px] gap-4">
      <div className="flex flex-col gap-4 w-full">
        {/* Nom de l'entreprise */}
        <div className="relative">
          <input
            id="companyName-input"
            type="text"
            placeholder="Nom de l'entreprise"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              setError("");
            }}
            onFocus={() => setFocusedField("companyName")}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none"
          />
          <label
            htmlFor="companyName-input"
            className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
              focusedField === "companyName"
                ? "text-dvianeutral-60"
                : "text-dvianeutral-50"
            }`}
          >
            Nom de l'entreprise
          </label>
        </div>

        {/* Raison sociale et Numéro SIRET en 2 colonnes */}
        <div className="flex gap-4 w-full">
          <div className="relative flex-1">
            <input
              id="legalName-input"
              type="text"
              placeholder="Raison sociale"
              value={legalName}
              onChange={(e) => {
                setLegalName(e.target.value);
                setError("");
              }}
              onFocus={() => setFocusedField("legalName")}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none"
            />
            <label
              htmlFor="legalName-input"
              className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
                focusedField === "legalName"
                  ? "text-dvianeutral-60"
                  : "text-dvianeutral-50"
              }`}
            >
              Raison sociale
            </label>
          </div>
          <div className="relative flex-1">
            <input
              id="siret-input"
              type="text"
              placeholder="12345678901234"
              value={siret}
              onChange={handleSiretChange}
              onFocus={() => setFocusedField("siret")}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none"
            />
            <label
              htmlFor="siret-input"
              className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
                focusedField === "siret"
                  ? "text-dvianeutral-60"
                  : "text-dvianeutral-50"
              }`}
            >
              Numéro SIRET
            </label>
          </div>
        </div>

        {/* Statut juridique */}
        <div className="relative">
          <select
            id="legalStatus-input"
            value={legalStatus}
            onChange={(e) => {
              setLegalStatus(e.target.value);
              setError("");
            }}
            onFocus={() => setFocusedField("legalStatus")}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none appearance-none bg-transparent cursor-pointer"
          >
            <option value="">Sélectionnez un statut juridique</option>
            <option value="SARL">SARL - Société à Responsabilité Limitée</option>
            <option value="SAS">SAS - Société par Actions Simplifiée</option>
            <option value="EURL">EURL - Entreprise Unipersonnelle à Responsabilité Limitée</option>
            <option value="SA">SA - Société Anonyme</option>
            <option value="SNC">SNC - Société en Nom Collectif</option>
            <option value="SASU">SASU - Société par Actions Simplifiée Unipersonnelle</option>
            <option value="SCI">SCI - Société Civile Immobilière</option>
            <option value="SCP">SCP - Société Civile Professionnelle</option>
            <option value="EIRL">EIRL - Entreprise Individuelle à Responsabilité Limitée</option>
            <option value="Auto-entrepreneur">Auto-entrepreneur / Micro-entreprise</option>
            <option value="Entreprise individuelle">Entreprise individuelle</option>
            <option value="Autre">Autre</option>
          </select>
          <label
            htmlFor="legalStatus-input"
            className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
              focusedField === "legalStatus" || legalStatus
                ? "text-dvianeutral-60"
                : "text-dvianeutral-50"
            }`}
          >
            Statut juridique
          </label>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-dvianeutralvariant-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}

