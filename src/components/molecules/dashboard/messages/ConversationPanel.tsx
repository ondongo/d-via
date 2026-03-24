"use client";

import { useState } from "react";
import { ICONS } from "@/constants/icons";
import { ConversationFull } from "@/types/conversation";
import AlertMessage from "./AlertMessage";
import QuoteCard from "./QuoteCard";
import Image from "next/image";

export default function ConversationPanel({ conv, onSendMessage }: { conv: ConversationFull; onSendMessage: (text: string) => void }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const name = conv.artisan?.name ?? "Artisan";
  const initial = name.charAt(0).toUpperCase();
  const verified = conv.artisan?.artisan?.verified ?? false;
  const company = conv.artisan?.artisan?.companyName ?? "";

  return (
    <div className="grid min-h-0 w-full flex-1 grid-rows-[auto_1fr_auto]">
      {/* Artisan header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-dvianeutral-50 px-5 py-3">
        <div className="relative shrink-0 w-16 h-16">
          <div className="w-16 h-16 rounded-full bg-dviaprimary-90 flex items-center justify-center text-dviaprimary-10 font-semibold text-sm">
            {initial}
          </div>
          {verified && (
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
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-dvianeutral-10 leading-tight">
            {name}
          </p>
          <p className="text-xs text-dvianeutralvariant-60">{company}</p>
        </div>
        <button className="text-dvianeutralvariant-60 hover:text-dvianeutral-10 cursor-pointer p-1">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Messages — 1fr + min-h-0 : scroll interne, barre de saisie toujours visible en bas */}
      <div className="min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-4">
        {conv.messages.map((msg) => {
          if (msg.contentType === "ALERT") {
            return <AlertMessage key={msg.id} text={msg.text || ""} />;
          }

          if (msg.contentType === "TEXT") {
            const isClient = msg.from === "CLIENT";
            const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={msg.id}
                className={`flex flex-col  px-5 ${isClient ? "items-end" : "items-start"} gap-1`}
              >
                <div
                  className={`max-w-[72%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    isClient
                      ? "bg-dviaprimary-40 text-white rounded-tr-sm"
                      : "bg-dvianeutral-96 border border-dvianeutral-50 text-dvianeutral-10 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-dvianeutralvariant-60 px-1">
                  {time}
                </span>
              </div>
            );
          }

          if (msg.contentType === "QUOTE") {
            // Need to handle payload for quote details
            // Assuming payload structure matches what QuoteCard expects
            const payload = msg.payload as any;
            const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={msg.id}
                className="flex flex-col items-start gap-1  px-5"
              >
                <QuoteCard
                  quoteRef={payload?.ref || "REF-???"}
                  title={payload?.title || "Devis"}
                  amount={payload?.amount || "0,00€"}
                  status={payload?.status || "Pending"}
                />
                <span className="text-[10px] text-dvianeutralvariant-60 px-1">
                  {time}
                </span>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Input — dernière ligne de la grille, hors zone scroll */}
      <div className="flex shrink-0 items-center gap-3 border-t border-dvianeutral-50 px-4 py-3">
        <button className="text-dvianeutralvariant-60 hover:text-dviaprimary-40 transition-colors cursor-pointer shrink-0">
          <Image
            src={ICONS.attachment}
            alt="attach"
            width={12}
            height={10}
          />
        </button>
        <button className="text-dvianeutralvariant-60 hover:text-dviaprimary-40 transition-colors cursor-pointer shrink-0">
          <Image
            src={ICONS.camera}
            alt="attach"
            width={18}
            height={18}
          />
        </button>
        <input
          type="text"
          placeholder="Décrivez votre projet ...."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          className="flex-1 text-sm text-dvianeutralvariant-30 outline-none placeholder:text-dvianeutralvariant-60 bg-transparent border border-dvianeutral-50 rounded-8px px-4 py-2"
        />
        <button
          className="cursor-pointer transition-colors shrink-0 text-dviaprimary-40"
          onClick={handleSend}
        >
          <Image src={ICONS.sendPrimary} alt="send" width={28} height={28}/>
        </button> 
      </div>
    </div>
  );
}
