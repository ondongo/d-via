"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ICONS } from "@/constants/icons";
import { ConversationFull } from "@/types/conversation";
import AlertMessage from "@/components/molecules/dashboard/messages/AlertMessage";
import QuoteCard from "@/components/molecules/dashboard/messages/QuoteCard";
import { Modal } from "@/components/atoms/ui/modals/CustomModal";

export default function ConversationPanelArtisan({ conv, onSendMessage }: { conv: ConversationFull; onSendMessage: (text: string, type?: "TEXT" | "QUOTE", payload?: any) => void }) {
  const [inputValue, setInputValue] = useState("");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteRef, setQuoteRef] = useState("");
  const [quoteTitle, setQuoteTitle] = useState("Proposition de devis");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    // setMessages(conv.messages);
  }, [conv.id, conv.messages]);

  const openQuoteModal = () => {
    const stamp = new Date();
    const quoteNum = Math.floor(Math.random() * 900 + 100);
    setQuoteRef(
      `DEV-${stamp.getFullYear()}-${String(stamp.getMonth() + 1).padStart(2, "0")}-${quoteNum}`,
    );
    setQuoteTitle("Proposition de devis");
    setQuoteAmount("");
    setQuoteModalOpen(true);
  };

  const normalizeAmount = (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return "";
      let normalized = trimmed
        .replace(/\s*€\s*t{1,2}c{1,2}\s*$/i, "")
        .replace(/\s*€\s*$/i, "")
        .trim();

      return `${normalized}€ TTC`;
    };

  const handeSubmitQuote = () => {
    const formattedAmount = normalizeAmount(quoteAmount);
    if (!quoteRef.trim() || !quoteTitle.trim() || !formattedAmount) return;

    onSendMessage("Proposition de devis", "QUOTE", {
        ref: quoteRef.trim(),
        title: quoteTitle.trim(),
        amount: formattedAmount,
        status: "Pending",
    });
    setQuoteModalOpen(false);
  };

  const handleSendText = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue, "TEXT");
    setInputValue("");
  };

  const name = conv.client?.name ?? "Client";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="grid min-h-0 w-full flex-1 grid-rows-[auto_1fr_auto]">
      <div className="flex shrink-0 items-center gap-3 border-b border-dvianeutral-50 px-5 py-3">
        <div className="relative shrink-0 w-16 h-16">
          <div className="w-16 h-16 rounded-full bg-dviaprimary-90 flex items-center justify-center text-dviaprimary-10 font-semibold text-sm">
            {initial}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-dvianeutral-10 leading-tight">{name}</p>
        </div>
      </div>

      <div className="min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-4">
        {conv.messages.map((msg) => {
          if (msg.contentType === "ALERT") {
            return <AlertMessage key={msg.id} text={msg.text || ""} />;
          }

          if (msg.contentType === "TEXT") {
            const isClient = msg.from === "CLIENT";
            const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={msg.id} className={`flex flex-col px-5 ${isClient ? "items-start" : "items-end"} gap-1`}>
                <div
                  className={`max-w-[72%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    !isClient // Artisan (me) is right, Client is left
                      ? "bg-dviaprimary-40 text-white rounded-tr-sm"
                      : "bg-dvianeutral-96 border border-dvianeutral-50 text-dvianeutral-10 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-dvianeutralvariant-60 px-1">{time}</span>
              </div>
            );
          }

          if (msg.contentType === "QUOTE") {
             const payload = msg.payload as any;
             const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
             return (
               <div key={msg.id} className="flex flex-col items-end gap-1 px-5">
                 <QuoteCard
                   quoteRef={payload?.ref}
                   title={payload?.title}
                   amount={payload?.amount}
                   status={payload?.status}
                 />
                 <span className="text-[10px] text-dvianeutralvariant-60 px-1">{time}</span>
               </div>
             )
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
          placeholder="Répondre au client..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendText();
          }}
          className="flex-1 text-sm text-dvianeutralvariant-30 outline-none placeholder:text-dvianeutralvariant-60 bg-transparent border border-dvianeutral-50 rounded-8px px-4 py-2"
        />
        <button
          className="cursor-pointer transition-colors shrink-0 text-dviaprimary-40"
          onClick={handleSendText}
        >
            <Image src={ICONS.sendPrimary} alt="send" width={28} height={28}/>
        </button>
      </div>

      <Modal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        title="Soumettre un devis"
        className="w-[92vw] max-w-[560px]"
      >
        <form onSubmit={(e) => { e.preventDefault(); handeSubmitQuote(); }} className="w-full px-4 md:px-6 pb-2 grid gap-4">
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
              value={"Pending"} // Controlled but static?
              onChange={() => {}} // No-op
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

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="px-4 py-2 text-sm text-dvianeutralvariant-40 hover:bg-dvianeutral-94 rounded-8px transition-colors bg-white hover:text-dviaprimary-40 border border-dvianeutral-50"
            >
              Annuler
            </button>
            <button
              onClick={handeSubmitQuote}
              className="px-4 py-2 text-sm bg-dviaprimary-40 text-white rounded-8px hover:bg-dviaprimary-50 transition-colors"
            >
              Envoyer le devis
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
