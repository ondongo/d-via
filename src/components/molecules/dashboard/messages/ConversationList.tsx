"use client";

import { useState } from "react";
import { ICONS } from "@/constants/icons";
import {
  CONVERSATIONS,
  STATUS_BADGE,
  type ConversationFilter,
} from "./conversations.mock";
import Image from "next/image";

interface ConversationListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  selectedId,
  onSelect,
}: ConversationListProps) {
  const [filter, setFilter] = useState<ConversationFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = CONVERSATIONS.filter((c) => {
    if (filter === "unread" && !c.unread) return false;
    if (filter === "quote_in_progress" && c.status !== "in_progress")
      return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.company.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="px-4 py-6 border-b border-dvianeutral-50">
        {/* Search */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-dvianeutral-94 border border-dvianeutral-50 rounded-8px px-3 py-2">
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
              placeholder="Rechercher un artisan, un..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-xs text-dvianeutralvariant-30 outline-none bg-transparent placeholder:text-dvianeutralvariant-60"
            />
          </div>
          <button className="border border-dvianeutral-50 bg-dvianeutral-94 p-2 rounded-8px cursor-pointer hover:border-dviaprimary-40 transition-colors shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6A7282"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="12" y1="18" x2="12" y2="18" />
            </svg>
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(
            [
              { key: "all", label: "Tout" },
              { key: "unread", label: "Non lu" },
              { key: "quote_in_progress", label: "Devis en cours" },
            ] as { key: ConversationFilter; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-28px border cursor-pointer whitespace-nowrap transition-colors shrink-0 ${
                filter === key
                  ? "bg-dviaprimary-40 text-white border-dviaprimary-40"
                  : "border-dvianeutral-50 text-dvianeutralvariant-40"
              }`}
            >
              {filter === key && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-dvianeutralvariant-60 text-xs px-4">
            Aucun message correspondant.
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = conv.id === selectedId;
            const statusBadge = STATUS_BADGE[conv.status];
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-left border-b border-dvianeutral-50 ${
                  isSelected
                    ? "bg-dvianeutral-96 border-l-2 border-l-dviaprimary-40"
                    : "hover:bg-dvianeutral-96"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full bg-dviaprimary-90 flex items-center justify-center text-dviaprimary-10 font-semibold text-sm">
                    {conv.initial}
                  </div>
                  {conv.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#00B983] rounded-full border border-white flex items-center justify-center">
                      <Image
                        src={ICONS.badgeCertified}
                        alt="certified"
                        width={12}
                        height={12}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-baseline justify-between gap-1 mb-0.5">
                    <p
                      className={`text-sm font-semibold truncate ${
                        conv.unread
                          ? "text-dvianeutral-10"
                          : "text-dvianeutralvariant-40"
                      }`}
                    >
                      {conv.name}
                    </p>
                    <span
                      className={`text-[10px] shrink-0 ${
                        conv.unread
                          ? "text-dviaprimary-40 font-semibold"
                          : "text-dvianeutralvariant-60"
                      }`}
                    >
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-xs text-dvianeutralvariant-60 truncate mb-1">
                    {conv.company}
                  </p>
                  <div className="flex items-start flex-col gap-2">
                    <p className="text-[11px] text-dvianeutralvariant-60 font-medium truncate flex-1">
                      {conv.lastMessage}
                    </p>
                    {conv.status === "quote_signed" && (
                      <span
                        className={`shrink-0 text-[9px] font-medium px-1.5 py-1 rounded border ${statusBadge.color}`}
                      >
                        {statusBadge.label}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
