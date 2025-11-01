"use client";

import { useState, useEffect, useCallback } from "react";
import CodePinInput from "@/components/atoms/auth/CodePinInput";

export default function Step3() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Récupérer le numéro depuis sessionStorage
    const storedPhone = sessionStorage.getItem("phoneNumber");
    if (storedPhone) {
      setPhoneNumber(storedPhone);
    }
  }, []);

  const handleVerifyCode = useCallback(async (verificationCode: string) => {
    if (!phoneNumber) {
      setError("Numéro de téléphone non trouvé. Veuillez recommencer.");
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Veuillez entrer un code à 6 chiffres");
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
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        setSuccess("Code vérifié avec succès !");
        // Ici vous pouvez rediriger vers la prochaine étape ou faire autre chose
      } else {
        setError(data.error || "Code invalide ou expiré");
      }
    } catch (err: any) {
      setError("Erreur de connexion. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setError(""); // Effacer l'erreur quand l'utilisateur tape
  }, []);

  const handleButtonClick = () => {
    if (code && code.length === 6) {
      handleVerifyCode(code);
    }
  };

  return (
    <div className="flex flex-col border-dvianeutral-50 border-1 rounded-8px p-8 max-w-[600px] min-h-[272px] gap-4">
      <h1 className="whitespace-nowrap hidden md:block text-[54px] font-bold leading-display-large tracking-display-large text-dvianeutral-10">
        Entrer le code
      </h1>

      <p className="font-normal text-body-small leading-body-small tracking-body-small gap-5 md:text-[16px] text-dvianeutral-10 md:leading-headline-small md:tracking-headline-small md:mb-10">
        Nous avons envoyé un code de vérification à 6 chiffres à votre numéro de
        téléphone{" "}
        {phoneNumber && (
          <span className="text-dvianeutral-10 font-bold">{phoneNumber}</span>
        )}
      </p>

      <CodePinInput onChange={handleCodeChange} />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {success && (
        <p className="text-green-500 text-sm">{success}</p>
      )}

      <button
        onClick={handleButtonClick}
        disabled={loading || code.length !== 6}
        className="text-dviaprimary-40 text-label-large leading-label-large tracking-label-large bg-transparent px-6 py-1 border rounded-8px border-dvianeutral-50 text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px] min-h-[40px] max-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Vérification en cours..." : "Vérifier le code"}
      </button>

      {loading && (
        <p className="text-dvianeutral-10 text-sm">Vérification en cours...</p>
      )}
    </div>
  );
}
