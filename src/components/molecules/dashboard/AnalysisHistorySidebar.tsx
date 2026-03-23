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
}

export default function AnalysisHistorySidebar({ history, onRemove }: Props) {
  const [search, setSearch] = useState("");

  const filtered = history.filter((item) =>
    item.fileName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="hidden md:flex flex-col w-[260px] shrink-0 border-r border-dvianeutral-50 bg-dvianeutral-90 min-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="sticky top-0 bg-dvianeutral-90 z-10 px-4 pt-4 pb-3 border-b border-dvianeutral-50">
        <p className="text-label-large leading-label-large tracking-label-large font-semibold text-dvianeutral-10 mb-3">
          Historique
        </p>

        <div className="flex items-center gap-2 bg-dvianeutral-94 border border-dvianeutral-50 rounded-8px px-3 py-2 mb-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6A7282"
            strokeWidth="2"
            strokeLinecap="round"
          >
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
          <button className="text-xs px-3 py-1.5 rounded-28px bg-dviaprimary-40 text-white font-medium">
            Tous
          </button>
          <button className="text-xs px-3 py-1.5 rounded-28px border border-dvianeutral-50 text-dvianeutralvariant-40">
            Enregistrés
          </button>
        </div>
      </div>

      <div className="flex-1 px-3 py-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D0B8A2"
              strokeWidth="1.5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="text-xs text-dvianeutralvariant-60">
              {search ? "Aucun résultat" : "Aucune analyse pour l'instant"}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1 mt-1">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="group flex items-center gap-2 px-2 py-2 rounded-8px hover:bg-dvianeutral-94 cursor-pointer transition-colors"
              >
                <div
                  className={`w-6 h-6 shrink-0 rounded flex items-center justify-center text-[10px] font-bold ${GRADE_COLORS[item.grade]}`}
                >
                  {item.grade}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-dvianeutral-10 truncate">
                    {item.fileName}
                  </p>
                  <p className="text-[10px] text-dvianeutralvariant-60">
                    {formatRelativeDate(item.date)}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-dvianeutral-50"
                  aria-label="Supprimer"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6A7282"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
