"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface TestPhaseContextType {
  hasAcceptedTestPhase: boolean;
  checkTestPhaseAcceptance: () => boolean;
}

const TestPhaseContext = createContext<TestPhaseContextType | undefined>(
  undefined
);

export const TEST_PHASE_STORAGE_KEY = "dvia_test_phase_accepted";

export function TestPhaseProvider({ children }: { children: React.ReactNode }) {
  const [hasAcceptedTestPhase, setHasAcceptedTestPhase] = useState(false);

  useEffect(() => {
    checkTestPhaseAcceptance();
  }, []);

  const checkTestPhaseAcceptance = () => {
    try {
      const accepted = localStorage.getItem(TEST_PHASE_STORAGE_KEY);
      document.cookie = `${TEST_PHASE_STORAGE_KEY}=${accepted}; path=/; max-age=31536000; SameSite=Lax`;
      const isAccepted = accepted === "true";
      setHasAcceptedTestPhase(isAccepted);
      return isAccepted;
    } catch (error) {
      console.error("Erreur lors de la lecture du localStorage:", error);
      return false;
    }
  };

  return (
    <TestPhaseContext.Provider
      value={{ hasAcceptedTestPhase, checkTestPhaseAcceptance }}
    >
      {children}
    </TestPhaseContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useTestPhase() {
  const context = useContext(TestPhaseContext);
  if (context === undefined) {
    throw new Error(
      "useTestPhase doit être utilisé à l'intérieur d'un TestPhaseProvider"
    );
  }
  return context;
}
