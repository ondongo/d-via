"use client";

import { useState } from "react";
import type { AnalysisGrade, AnalysisHistoryItem } from "@/hooks/useAnalysisHistory";

const GRADE_COLORS: Record<AnalysisGrade, string> = {
  A: "bg-[#00DD9E] text-[#043327]",
  B: "bg-[#FFC671] text-[#4A3004]",
  C: "bg-[#F4C6C4] text-[#5A1D1A]",
  D: "bg-[#340100] text-white",
};

function formatRelativeDate(iso: string): string {
  const now = Date.now();
  const diff = now - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 2) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  if (days === 1) return "Hier";
  return `Il y a ${days} jours`;
}

interface Props {
  history: AnalysisHistoryItem[];
  onRemove: (id: string) => void;
  isLoading?: boolean;
}

export default function AnalysisHistorySidebar({ history, onRemove, isLoading }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "saved">("all");

  const filtered = history.filter((item) =>
    item.fileName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="hidden md:flex flex-col w-[240px] shrink-0 border-r border-dvianeutral-50 min-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="sticky top-0 z-10 px-4 pt-5 pb-3">
        <p className="text-base font-bold text-dvianeutral-10 mb-4">
          Historique
        </p>

        <div className="flex items-center gap-2 border border-dvianeutral-50 focus-within:border-dviaprimary-40 rounded-8px px-3 py-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6A7282" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs text-dvianeutralvariant-30 outline-none bg-transparent placeholder:text-dvianeutralvariant-60"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`text-xs px-3 py-1.5 rounded-28px font-medium transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-dviaprimary-40 text-white"
                : "border border-dvianeutral-50 text-dvianeutralvariant-40 hover:bg-dvianeutral-96"
            }`}
          >
            {filter === "all" && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="inline mr-1 -mt-0.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            Tous
          </button>
          <button
            onClick={() => setFilter("saved")}
            className={`text-xs px-3 py-1.5 rounded-28px font-medium transition-colors cursor-pointer ${
              filter === "saved"
                ? "bg-dviaprimary-40 text-white"
                : "border border-dvianeutral-50 text-dvianeutralvariant-40 hover:bg-dvianeutral-96"
            }`}
          >
            Enregistrer
          </button>
        </div>
      </div>

      <div className="flex-1 px-3 py-2">
        {isLoading ? (
          <ul className="flex flex-col gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 px-2 py-2.5 rounded-8px animate-pulse"
              >
                <div className="w-8 h-8 shrink-0 bg-dvianeutral-94 rounded-8px" />
                <div className="flex-1 min-w-0">
                  <div className="h-3 bg-dvianeutral-94 rounded w-24 mb-1.5" />
                  <div className="h-2.5 bg-dvianeutral-94 rounded w-16" />
                </div>
                <div className="w-11 h-11 shrink-0 bg-dvianeutral-94 rounded-full" />
              </li>
            ))}
          </ul>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D0B8A2" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="text-xs text-dvianeutralvariant-60">
              {search ? "Aucun résultat" : "Aucune analyse pour l'instant"}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-0.5 mt-1">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="group flex items-center gap-2.5 px-2 py-2.5 rounded-8px bg-dvianeutral-96 hover:bg-dvianeutral-96 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 shrink-0 bg-dvianeutral-96 rounded-8px flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A7282" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-dvianeutral-10 truncate">
                    {item.fileName}
                  </p>
                  <p className="text-[10px] font-medium text-dvianeutralvariant-60">
                    {formatRelativeDate(item.date)}
                  </p>
                </div>

                <div
                  className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${GRADE_COLORS[item.grade]}`}
                >
                  {item.grade}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
