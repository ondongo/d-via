"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import type { Conversation, Message } from "@/components/molecules/dashboard/messages/conversations.mock";
import AlertMessage from "@/components/molecules/dashboard/messages/AlertMessage";
import QuoteCard from "@/components/molecules/dashboard/messages/QuoteCard";
import { Modal } from "@/components/atoms/ui/modals/CustomModal";

export default function ConversationPanelArtisan({ conv }: { conv: Conversation }) {
  type QuoteStatus = "Pending" | "Accepted" | "Refused";
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>(conv.messages);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteRef, setQuoteRef] = useState("");
  const [quoteTitle, setQuoteTitle] = useState("Proposition de devis");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus>("Pending");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setMessages(conv.messages);
  }, [conv.id, conv.messages]);

  const openQuoteModal = () => {
    const stamp = new Date();
    const quoteNum = Math.floor(Math.random() * 900 + 100);
    setQuoteRef(
      `DEV-${stamp.getFullYear()}-${String(stamp.getMonth() + 1).padStart(2, "0")}-${quoteNum}`,
    );
    setQuoteTitle("Proposition de devis");
    setQuoteAmount("");
    setQuoteStatus("Pending");
    setQuoteModalOpen(true);
  };

  const submitQuote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formattedAmount = normalizeAmount(quoteAmount);
    if (!quoteRef.trim() || !quoteTitle.trim() || !formattedAmount) return;

    const stamp = new Date();
    const time = `${stamp.getHours()}h${String(stamp.getMinutes()).padStart(2, "0")}`;
    const next: Message = {
      id: `q-${Date.now()}`,
      from: "artisan",
      content: {
        type: "quote",
        ref: quoteRef.trim(),
        title: quoteTitle.trim(),
        amount: formattedAmount,
        status: quoteStatus as "Pending" | "Accepted" | "Refused",
      },
      time,
    };
    setMessages((prev) => [...prev, next]);
    setQuoteModalOpen(false);
  };

  const normalizeAmount = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const normalized = trimmed
      .replace(/\s*€\s*t{1,2}c{1,2}\s*$/i, "")
      .replace(/\s*€\s*$/i, "")
      .trim();
    return `${normalized}€ TTC`;
  };

  return (
    <div className="grid min-h-0 w-full flex-1 grid-rows-[auto_1fr_auto]">
      <div className="flex shrink-0 items-center gap-3 border-b border-dvianeutral-50 px-5 py-3">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-dviaprimary-90 flex items-center justify-center text-dviaprimary-10 font-semibold text-sm">
            {conv.initial}
          </div>
          {conv.verified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[#00B983] rounded-full border border-white flex items-center justify-center">
              <Image src={ICONS.badgeCertified} alt="certified" width={12} height={12} />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-dvianeutral-10 leading-tight">{conv.name}</p>
          <p className="text-xs text-dvianeutralvariant-60">{conv.company}</p>
        </div>
      </div>

      <div className="min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-4">
        {messages.map((msg) => {
          if (msg.content.type === "alert") {
            return <AlertMessage key={msg.id} text={msg.content.text} />;
          }

          if (msg.content.type === "text") {
            const isClient = msg.from === "client";
            return (
              <div key={msg.id} className={`flex flex-col px-5 ${isClient ? "items-start" : "items-end"} gap-1`}>
                <div
                  className={`max-w-[72%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    isClient
                      ? "bg-dvianeutral-96 border border-dvianeutral-50 text-dvianeutral-10 rounded-tl-sm"
                      : "bg-dviaprimary-40 text-white rounded-tr-sm"
                  }`}
                >
                  {msg.content.text}
                </div>
                {msg.time && <span className="text-[10px] text-dvianeutralvariant-60 px-1">{msg.time}</span>}
              </div>
            );
          }

          if (msg.content.type === "quote") {
            return (
              <div key={msg.id} className="flex flex-col items-end gap-1 px-5">
                <QuoteCard
                  quoteRef={msg.content.ref}
                  title={msg.content.title}
                  amount={msg.content.amount}
                  status={msg.content.status}
                  canSign={false}
                />
                {msg.time && <span className="text-[10px] text-dvianeutralvariant-60 px-1">{msg.time}</span>}
              </div>
            );
          }

          return null;
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-dvianeutral-50 px-4 py-3">
        <button
          type="button"
          onClick={openQuoteModal}
          className="rounded-8px border border-dviaprimary-40 text-dviaprimary-40 px-3 py-2 text-xs font-medium hover:bg-dviaprimary-99 transition-colors cursor-pointer whitespace-nowrap"
        >
          Soumettre un devis
        </button>
        <input
          type="text"
          placeholder="Écrire un message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 text-sm text-dvianeutralvariant-30 outline-none placeholder:text-dvianeutralvariant-60 bg-transparent border border-dvianeutral-50 rounded-8px px-4 py-2"
        />
        <button className="cursor-pointer transition-colors shrink-0 text-dviaprimary-40">
          <Image src={ICONS.sendPrimary} alt="send" width={28} height={28} />
        </button>
      </div>

      <Modal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        title="Soumettre un devis"
        className="w-[92vw] max-w-[560px]"
      >
        <form onSubmit={submitQuote} className="w-full px-4 md:px-6 pb-2 grid gap-4">
          <div className="relative">
            <input
              id="artisan-quote-ref"
              type="text"
              value={quoteRef}
              onChange={(e) => setQuoteRef(e.target.value)}
              onFocus={() => setFocusedField("quoteRef")}
              onBlur={() => setFocusedField(null)}
              className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
              placeholder="DEV-2026-03-123"
              required
            />
            <label
              htmlFor="artisan-quote-ref"
              className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-dviaheader px-1 text-xs transition-colors duration-200 ${
                focusedField === "quoteRef"
                  ? "text-dvianeutral-60"
                  : "text-dvianeutral-50"
              }`}
            >
              Référence
            </label>
          </div>

          <div className="relative">
            <input
              id="artisan-quote-title"
              type="text"
              value={quoteTitle}
              onChange={(e) => setQuoteTitle(e.target.value)}
              onFocus={() => setFocusedField("quoteTitle")}
              onBlur={() => setFocusedField(null)}
              className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
              placeholder="Proposition de devis"
              required
            />
            <label
              htmlFor="artisan-quote-title"
              className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-dviaheader px-1 text-xs transition-colors duration-200 ${
                focusedField === "quoteTitle"
                  ? "text-dvianeutral-60"
                  : "text-dvianeutral-50"
              }`}
            >
              Titre
            </label>
          </div>

          <div className="relative">
            <input
              id="artisan-quote-amount"
              type="text"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              onFocus={() => setFocusedField("quoteAmount")}
              onBlur={() => {
                setFocusedField(null);
                setQuoteAmount((prev) => normalizeAmount(prev));
              }}
              className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
              placeholder="2 450,00€ TTC"
              required
            />
            <label
              htmlFor="artisan-quote-amount"
              className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-dviaheader px-1 text-xs transition-colors duration-200 ${
                focusedField === "quoteAmount"
                  ? "text-dvianeutral-60"
                  : "text-dvianeutral-50"
              }`}
            >
              Montant
            </label>
          </div>

          <div className="relative">
            <select
              id="artisan-quote-status"
              value={quoteStatus}
              onChange={(e) => setQuoteStatus(e.target.value as QuoteStatus)}
              onFocus={() => setFocusedField("quoteStatus")}
              onBlur={() => setFocusedField(null)}
              className="w-full rounded-md border-1 border-dvianeutral-50 bg-transparent px-4 py-3 focus:border-dvianeutral-60 focus:outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Refused">Refused</option>
            </select>
            <label
              htmlFor="artisan-quote-status"
              className={`pointer-events-none absolute left-4 -top-2.5 z-10 bg-dviaheader px-1 text-xs transition-colors duration-200 ${
                focusedField === "quoteStatus"
                  ? "text-dvianeutral-60"
                  : "text-dvianeutral-50"
              }`}
            >
              Statut
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setQuoteModalOpen(false)}
              className="px-4 py-2 rounded-8px border border-dvianeutral-50 text-sm text-dvianeutral-20 hover:bg-dvianeutral-96 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-8px bg-dviaprimary-40 text-white text-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              Envoyer le devis
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
