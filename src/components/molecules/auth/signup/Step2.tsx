"use client";

import { useState } from "react";
import { useSignup } from "@/providers/SignupContext";

export default function Step2() {
  const { phoneNumber, setPhoneNumber, error, success, setError } = useSignup();
  const [isFocused, setIsFocused] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^\d+\s\-()]/g, "");
    setPhoneNumber(cleanedValue);
    setError("");
  };

  return (
    <div className="flex flex-col border-dvianeutral-50 border-1 rounded-8px p-8 max-w-[600px] min-h-[272px] gap-4">
      <h1 className="whitespace-nowrap hidden md:block text-[54px] font-bold leading-display-large tracking-display-large text-dvianeutral-10">
        Test OTP
      </h1>

      <p className="font-normal text-body-small leading-body-small tracking-body-small gap-5 md:text-[16px] text-dvianeutral-10 md:leading-headline-small md:tracking-headline-small">
        Entrez votre numéro de téléphone pour recevoir un code de vérification
      </p>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            id="phone-input"
            type="tel"
            placeholder="+33 7 89 54 36 18"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none"
          />
          <label
            htmlFor="phone-input"
            className={`absolute left-4 -top-2.5 text-xs bg-[var(--background)] px-1 pointer-events-none z-10 transition-colors duration-200 ${
              isFocused ? "text-dvianeutral-60" : "text-dvianeutral-50"
            }`}
          >
            Téléphone
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {success && <p className="text-green-500 text-sm">{success}</p>}
      </div>
    </div>
  );
}
