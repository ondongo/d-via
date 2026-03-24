"use client";

import { useState } from "react";
import { ICONS } from "@/constants/icons";
import {
  CONVERSATIONS,
  STATUS_BADGE,
  type ConversationFilter,
} from "./conversations.mock";
import { ConversationSummary } from "@/types/conversation";
import Image from "next/image";

interface ConversationListProps {
  conversations: ConversationSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
  viewerRole?: "CLIENT" | "ARTISAN";
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isLoading,
  viewerRole = "CLIENT",
}: ConversationListProps) {
  const [filter, setFilter] = useState<ConversationFilter>("all");
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="px-4 py-6 border-b border-dvianeutral-50 animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-9 bg-dvianeutral-94 rounded-8px" />
            <div className="w-9 h-9 bg-dvianeutral-94 rounded-8px shrink-0" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 bg-dvianeutral-94 rounded-28px w-14" />
            <div className="h-7 bg-dvianeutral-94 rounded-28px w-20" />
            <div className="h-7 bg-dvianeutral-94 rounded-28px w-28" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 border-b border-dvianeutral-50 animate-pulse"
            >
              <div className="w-10 h-10 rounded-full bg-dvianeutral-94 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1.5">
                  <div className="h-3.5 bg-dvianeutral-94 rounded w-28" />
                  <div className="h-3 bg-dvianeutral-94 rounded w-8 shrink-0" />
                </div>
                <div className="h-3 bg-dvianeutral-94 rounded w-20 mb-1.5" />
                <div className="h-3 bg-dvianeutral-94 rounded w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filtered = conversations.filter((c) => {
    // Determine unread status for current user (Client in this context?)
    // Actually we pass 'conversations' which has isUnreadByClient.
    // Assuming this component is used by Client, we check isUnreadByClient.
    const isUnread = viewerRole === "CLIENT" ? c.isUnreadByClient : c.isUnreadByArtisan;

    // Status filter
    // Quote in progress -> pending/ongoing
    const status = c.status;

    if (filter === "unread" && !isUnread) return false;
    // ... filtering logic ...

    // Search
    const artisanName = c.artisan?.name ?? "";
    const company = c.artisan?.artisan?.companyName ?? "";

    if (
      search &&
      !artisanName.toLowerCase().includes(search.toLowerCase()) &&
      !company.toLowerCase().includes(search.toLowerCase())
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
          <Image
              src={ICONS.artisanCard.tune}
              alt="filtres avancés"
              width={16}
              height={16}
            />
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
            // Map data from ConversationSummary
            // If viewer is Artisan, show Client info. If Client, show Artisan info.
            let displayName = "Inconnu";
            let displayCompany = "";
            let displayImage = ""; // TODO use image
            let verified = false;
            let initial = "?";

            if (viewerRole === "CLIENT") {
                const artisan = conv.artisan;
                displayName = artisan?.name || "Artisan inconnu";
                displayCompany = artisan?.artisan?.companyName || "";
                verified = artisan?.artisan?.verified || false;
            } else {
                const client = conv.client;
                displayName = client?.name || "Client inconnu";
                displayCompany = "Particulier"; // or nothing
                verified = false; // Clients usually not verified like artisans
            }
            initial = displayName.charAt(0).toUpperCase();

            const lastMsg = conv.messages?.[0];
            let lastMessageText = lastMsg?.text || "";
            if (!lastMessageText && lastMsg?.contentType === 'ALERT') lastMessageText = "Message système";
            if (!lastMessageText && lastMsg?.contentType === 'QUOTE') lastMessageText = "Devis reçu";

            const time = new Date(conv.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const isUnread = viewerRole === "CLIENT" ? conv.isUnreadByClient : conv.isUnreadByArtisan;

            const statusKey = (conv.status?.toLowerCase() || 'pending') as keyof typeof STATUS_BADGE;
            const statusBadge = STATUS_BADGE[statusKey] || STATUS_BADGE.pending;

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
                <div className="relative shrink-0 w-10 h-10"> {/* Adjusted size */}
                  <div className="w-10 h-10 rounded-full bg-dviaprimary-90 flex items-center justify-center text-dviaprimary-10 font-semibold text-sm">
                    {initial}
                  </div>
                  {verified && viewerRole === "CLIENT" && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00B983] rounded-full border border-white flex items-center justify-center">
                      <img
                        src="/icons/badge-certified.svg" // Use absolute path or import
                        alt="certified"
                        className="w-2.5 h-2.5"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-baseline justify-between gap-1 mb-0.5">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isUnread
                          ? "text-dvianeutral-10"
                          : "text-dvianeutralvariant-40"
                      }`}
                    >
                      {displayName}
                    </p>
                    <span
                      className={`text-[10px] shrink-0 ${
                        isUnread
                          ? "text-dviaprimary-40 font-semibold"
                          : "text-dvianeutralvariant-60"
                      }`}
                    >
                      {time}
                    </span>
                  </div>
                  <p className="text-xs text-dvianeutralvariant-60 truncate mb-1">
                    {displayCompany}
                  </p>
                  <div className="flex items-center gap-2 justify-between">
                    <p className={`text-[11px] font-medium truncate flex-1 ${isUnread ? "text-dvianeutral-10" : "text-dvianeutralvariant-60"}`}>
                      {lastMessageText}
                    </p>
                    {conv.status.toLowerCase() === "quote_signed" && ( // Example conditional badge
                      <span
                        className={`shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded border ${statusBadge.color}`}
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
