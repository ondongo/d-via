"use client";

import { useState } from "react";
import { CONVERSATIONS } from "@/components/molecules/dashboard/messages/conversations.mock";
import ConversationList from "@/components/molecules/dashboard/messages/ConversationList";
import ConversationPanel from "@/components/molecules/dashboard/messages/ConversationPanel";
import EmptyConversation from "@/components/molecules/dashboard/messages/EmptyConversation";

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(CONVERSATIONS[0]?.id ?? null);
  const [mobileView, setMobileView] = useState<"list" | "conversation">("list");

  const selectedConv = CONVERSATIONS.find((c) => c.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileView("conversation");
  };

  return (
    <div className="flex h-[calc(100dvh-80px)] max-h-[calc(100dvh-80px)] w-full shrink-0 overflow-hidden max-md:h-[calc(100dvh-80px-5.5rem)] max-md:max-h-[calc(100dvh-80px-5.5rem)]">
      {/* Left panel — conversation list */}
      <div
        className={`flex w-full shrink-0 flex-col border-r border-dvianeutral-50 md:w-[320px] md:flex ${
          mobileView === "conversation" ? "hidden md:flex" : "flex"
        } min-h-0`}
      >
        <ConversationList selectedId={selectedId} onSelect={handleSelect} />
      </div>

      {/* Right panel — active conversation */}
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col ${
          mobileView === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        {mobileView === "conversation" && (
          <button
            onClick={() => setMobileView("list")}
            className="md:hidden flex items-center gap-1 text-sm text-dvianeutralvariant-40 px-4 pt-3 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
        )}
        {selectedConv ? <ConversationPanel conv={selectedConv} /> : <EmptyConversation />}
      </div>
    </div>
  );
}
