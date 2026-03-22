"use client";

import { useState } from "react";
import { ICONS } from "@/constants/icons";
import type { Conversation } from "./conversations.mock";
import AlertMessage from "./AlertMessage";
import QuoteCard from "./QuoteCard";
import Image from "next/image";

export default function ConversationPanel({ conv }: { conv: Conversation }) {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="grid min-h-0 w-full flex-1 grid-rows-[auto_1fr_auto]">
      {/* Artisan header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-dvianeutral-50 px-5 py-3">
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
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-dvianeutral-10 leading-tight">
            {conv.name}
          </p>
          <p className="text-xs text-dvianeutralvariant-60">{conv.company}</p>
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
          if (msg.content.type === "alert") {
            return <AlertMessage key={msg.id} text={msg.content.text} />;
          }

          if (msg.content.type === "text") {
            const isClient = msg.from === "client";
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
                  {msg.content.text}
                </div>
                {msg.time && (
                  <span className="text-[10px] text-dvianeutralvariant-60 px-1">
                    {msg.time}
                  </span>
                )}
              </div>
            );
          }

          if (msg.content.type === "quote") {
            return (
              <div
                key={msg.id}
                className="flex flex-col items-start gap-1  px-5"
              >
                <QuoteCard
                  quoteRef={msg.content.ref}
                  title={msg.content.title}
                  amount={msg.content.amount}
                  status={msg.content.status}
                />
                {msg.time && (
                  <span className="text-[10px] text-dvianeutralvariant-60 px-1">
                    {msg.time}
                  </span>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Input — dernière ligne de la grille, hors zone scroll */}
      <div className="flex shrink-0 items-center gap-3 border-t border-dvianeutral-50 bg-white px-4 py-3">
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
          className="flex-1 text-sm text-dvianeutralvariant-30 outline-none placeholder:text-dvianeutralvariant-60 bg-transparent"
        />
        <button
          className={`cursor-pointer transition-colors shrink-0 ${
            inputValue.trim()
              ? "text-dviaprimary-40"
              : "text-dvianeutralvariant-60"
          }`}
        >
          <Image src={ICONS.send} alt="send" width={18} height={18} />
        </button>
      </div>
    </div>
  );
}
