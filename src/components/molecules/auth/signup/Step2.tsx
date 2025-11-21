"use client";

import { useState, useEffect } from "react";
import { useSignupForm } from "@/hooks/useSignupForm";
import { useSignupStore } from "@/stores/signupStore";
import MapsSearch from "../../maps/MapsSearch";

export default function Step2() {
  const { loadFormData } = useSignupForm();
  const { 
    getStepPart, 
    siret, 
    setSiret,
    companyName,
    legalName,
    legalStatus,
    address,
    setCompanyName,
    setLegalName,
    setLegalStatus,
    setAddress
  } = useSignupStore();
  const step2Part = getStepPart(2);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Charger les données au montage depuis localStorage et sessionStorage si nécessaire
  useEffect(() => {
    const data = loadFormData();
    if (data.companyName && !companyName) setCompanyName(data.companyName);
    if (data.legalName && !legalName) setLegalName(data.legalName);
    if (data.legalStatus && !legalStatus) setLegalStatus(data.legalStatus);
    if (data.siret && !siret) {
      setSiret(data.siret);
    }
    
    // Charger l'adresse depuis sessionStorage si elle n'est pas dans le store
    if (typeof window !== "undefined" && !address) {
      const storedAddress = sessionStorage.getItem("selectedAddress");
      if (storedAddress) {
        setAddress(storedAddress);
      }
    }
  }, [loadFormData, siret, setSiret, companyName, legalName, legalStatus, address, setCompanyName, setLegalName, setLegalStatus, setAddress]);

  // Partie 2 : Localisation avec carte
  if (step2Part === 2) {
    return (
      <>
        <MapsSearch />
      </>
    );
  }

  // Partie 1 : Formulaire d'adresse
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
              onChange={(e) => {
                setSiret(e.target.value);
              }}
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
            }}
            onFocus={() => setFocusedField("legalStatus")}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none appearance-none bg-transparent cursor-pointer"
          >
            <option value="">Sélectionnez un statut juridique</option>
            <option value="SARL">
              SARL - Société à Responsabilité Limitée
            </option>
            <option value="SAS">SAS - Société par Actions Simplifiée</option>
            <option value="EURL">
              EURL - Entreprise Unipersonnelle à Responsabilité Limitée
            </option>
            <option value="SA">SA - Société Anonyme</option>
            <option value="SNC">SNC - Société en Nom Collectif</option>
            <option value="SASU">
              SASU - Société par Actions Simplifiée Unipersonnelle
            </option>
            <option value="SCI">SCI - Société Civile Immobilière</option>
            <option value="SCP">SCP - Société Civile Professionnelle</option>
            <option value="EIRL">
              EIRL - Entreprise Individuelle à Responsabilité Limitée
            </option>
            <option value="Auto-entrepreneur">
              Auto-entrepreneur / Micro-entreprise
            </option>
            <option value="Entreprise individuelle">
              Entreprise individuelle
            </option>
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
