"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Step2() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  // Valider et formater le numéro de téléphone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ne permettre que les chiffres, espaces, +, - et ()
    const cleanedValue = value.replace(/[^\d+\s\-()]/g, "");
    setPhoneNumber(cleanedValue);
    setError(""); // Effacer l'erreur quand l'utilisateur tape
  };

  // Valider le format du numéro avant l'envoi
  const validatePhoneNumber = (phone: string): boolean => {
    // Supprimer les espaces, tirets et parenthèses pour la validation
    const cleaned = phone.replace(/[\s\-()]/g, "");
    // Doit commencer par + et contenir entre 10 et 15 chiffres au total
    if (!cleaned.startsWith("+")) {
      return false;
    }
    const digits = cleaned.substring(1);
    return /^\d{10,14}$/.test(digits);
  };

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError("Veuillez entrer un numéro de téléphone");
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Veuillez entrer un numéro de téléphone valide (ex: +33 7 89 54 36 18)");
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
        setSuccess("Code envoyé avec succès !");
        // Stocker le numéro dans sessionStorage pour l'utiliser dans Step3
        sessionStorage.setItem("phoneNumber", phoneNumber);
        // Optionnel: rediriger vers Step3 après quelques secondes
        setTimeout(() => {
          router.push("/signup/step3");
        }, 1500);
      } else {
        setError(data.error || "Erreur lors de l'envoi du code");
      }
    } catch (err: any) {
      setError("Erreur de connexion. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
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

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-sm">{success}</p>
        )}

        <button
          onClick={handleSendCode}
          disabled={loading}
          className="text-dviaprimary-40 text-label-large leading-label-large tracking-label-large bg-transparent px-6 py-1 border rounded-8px border-dvianeutral-50 text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px] min-h-[40px] max-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Envoi en cours..." : "Envoyer le code"}
        </button>
      </div>
    </div>
  );
}
