"use client";

import { useCallback, useEffect, useState } from "react";

export type AnalysisGrade = "A" | "B" | "C" | "D";

export type AnalysisHistoryItem = {
  id: string;
  fileName: string;
  date: string;
  reliability: number;
  grade: AnalysisGrade;
};

const STORAGE_KEY = "dvia_analysis_history";
const MAX_HISTORY = 20;

function reliabilityToGrade(score: number): AnalysisGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "D";
}

function readHistory(): AnalysisHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export type AnalysisCreditState =
  | "guest_free_analysis_available"
  | "guest_free_analysis_used"
  | "authenticated_with_credits"
  | "authenticated_without_credits";

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  const addToHistory = useCallback(
    (fileName: string, reliability: number) => {
      const newItem: AnalysisHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fileName,
        date: new Date().toISOString(),
        reliability,
        grade: reliabilityToGrade(reliability),
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // storage plein — on ne bloque pas
        }
        return updated;
      });
    },
    [],
  );

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  return { history, addToHistory, removeFromHistory };
}

export function readCreditState(isAuthenticated: boolean): AnalysisCreditState {
  if (typeof window === "undefined") return "guest_free_analysis_available";

  if (!isAuthenticated) {
    const used = window.localStorage.getItem("dvia_guest_analysis_used");
    return used === "true"
      ? "guest_free_analysis_used"
      : "guest_free_analysis_available";
  }

  const raw = window.localStorage.getItem("dvia_analysis_credits");
  const credits = raw !== null ? Number(raw) : 1;
  return credits > 0
    ? "authenticated_with_credits"
    : "authenticated_without_credits";
}

export function consumeCredit(isAuthenticated: boolean): void {
  if (typeof window === "undefined") return;

  if (!isAuthenticated) {
    window.localStorage.setItem("dvia_guest_analysis_used", "true");
    return;
  }

  const raw = window.localStorage.getItem("dvia_analysis_credits");
  const credits = raw !== null ? Number(raw) : 1;
  window.localStorage.setItem(
    "dvia_analysis_credits",
    String(Math.max(0, credits - 1)),
  );
}
