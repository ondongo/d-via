"use client";

import { useState, useEffect } from "react";
import { useSignup } from "@/providers/SignupContext";
import { useGlobalState } from "@/providers/globalState";

export default function Step2() {
  const { setError } = useSignup();
  const { selectedAddress, setSelectedAddress } = useGlobalState();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Charger l'adresse depuis sessionStorage au montage
  useEffect(() => {
    const storedAddress = sessionStorage.getItem("selectedAddress");
    if (storedAddress) {
      setSelectedAddress(storedAddress);
    }
  }, [setSelectedAddress]);

  // Sauvegarder l'adresse dans sessionStorage quand elle change
  useEffect(() => {
    if (selectedAddress) {
      sessionStorage.setItem("selectedAddress", selectedAddress);
    }
  }, [selectedAddress]);

  return (
    <div className="flex flex-col border-dvianeutral-50 border-1 rounded-8px p-8 max-w-[600px] min-h-[272px] gap-4">
      <div className="flex flex-col gap-4 w-full">
        {/* Champ d'adresse */}
        <div className="relative">
          <input
            id="address-input"
            type="text"
            placeholder="Entrez l'adresse de votre entreprise"
            value={selectedAddress || ""}
            onChange={(e) => {
              setSelectedAddress(e.target.value);
              setError("");
            }}
            onFocus={() => setFocusedField("address")}
            onBlur={() => setFocusedField(null)}
            className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none"
          />
          <label
            htmlFor="address-input"
            className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
              focusedField === "address"
                ? "text-dvianeutral-60"
                : "text-dvianeutral-50"
            }`}
          >
            Adresse de l'entreprise
          </label>
        </div>
      </div>
    </div>
  );
}
