"use client";

import { useState, useRef, useEffect } from "react";

export default function CodePinInput({
  length = 6,
  onChange,
}: {
  length?: number;
  onComplete?: (code: string) => void;
  onChange?: (code: string) => void;
}) {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Accepter seulement les chiffres
    const digit = value.replace(/[^0-9]/g, "");

    if (digit.length === 0) {
      // Permettre la suppression
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
      // Appeler onChange avec le code mis à jour
      const updatedCode = [...newCode];
      const fullCode = updatedCode.join("");
      if (onChange) {
        onChange(fullCode);
      }
    } else {
      // Prendre le dernier caractère entré
      const newCode = [...code];
      newCode[index] = digit.slice(-1);
      setCode(newCode);

      // Appeler onChange avec le code mis à jour
      const fullCode = newCode.join("");
      if (onChange) {
        onChange(fullCode);
      }

      // Passer à l'input suivant
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Si l'input est vide, revenir au précédent
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    const newCode = [...code];
    for (let i = 0; i < length && i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // Appeler onChange avec le code collé
    const fullCode = newCode.join("");
    if (onChange) {
      onChange(fullCode);
    }

    // Focus sur le dernier input rempli ou le dernier si tout est rempli
    const lastIndex = Math.min(pastedData.length - 1, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex gap-x-3 items-center">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="block w-10 h-14 text-center border-1 border-dvianeutral-50 rounded-md sm:text-sm focus:border-dvianeutral-60 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
          value={digit}
          autoFocus={index === 0}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
