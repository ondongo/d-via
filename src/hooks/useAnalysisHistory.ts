"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalysisGrade, AnalysisHistoryItem } from "@/types/analysis";

export type { AnalysisGrade, AnalysisHistoryItem } from "@/types/analysis";

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

/** Historique local pour les invités ; les comptes connectés utilisent la base (server actions). */
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
