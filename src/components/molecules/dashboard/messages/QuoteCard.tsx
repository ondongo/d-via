"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { ICONS } from "@/constants/icons";
import Image from "next/image";

const SignQuoteModal = dynamic(() => import("./SignQuoteModal"), {
  ssr: false,
});

interface QuoteCardProps {
  quoteRef: string;
  title: string;
  amount: string;
  status: string;
}

export default function QuoteCard({
  quoteRef,
  title,
  amount,
  status,
}: QuoteCardProps) {
  const [signModalOpen, setSignModalOpen] = useState(false);

  const handleSigned = useCallback(
    (_payload: { dataUrl: string; quoteRef: string }) => {
      // Mock — Marvin branchera l’API / stockage signature ici
    },
    []
  );

  return (
    <>
      <div className="bg-dvianeutral-96 border border-dvianeutral-50 text-dvianeutral-10 rounded-xl rounded-tl-sm min-w-[416px]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-dvianeutral-50">
          <div className="flex items-center gap-2">
            <svg
              fill="none"
              width="18"
              height="18"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z"
                clipRule="evenodd"
                fill="#E16A26"
                fillRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold text-dvianeutral-10">
              Proposition de devis
            </span>
          </div>
          <span className="text-[10px]  text-[#381100] bg-[#FFDCA6] border border-[#FF9900] px-2 py-1 rounded">
            {status}
          </span>
        </div>

        <div className="px-4 py-4">
          <p className="text-xs text-dvianeutralvariant-60 mb-1">
            Réf : {quoteRef}
          </p>
          <p className="text-sm font-semibold text-dvianeutral-10 mb-2">
            {title}
          </p>
          <p className="text-2xl font-bold text-dvianeutral-10">{amount}</p>
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-1.5 border border-dvianeutral-50 text-xs py-2 rounded-8px text-dviaprimary-40 hover:border-dviaprimary-40 hover:text-dviaprimary-40 transition-colors cursor-pointer"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Voir le devis
          </button>
          <button
            type="button"
            onClick={() => setSignModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-dviaprimary-40 text-white text-xs py-2 rounded-8px hover:shadow-md transition-shadow cursor-pointer"
          >
            <Image
              src={ICONS.fileWhite}
              alt="file"
              width={12}
              height={12}
            />
            Signer le devis
          </button>
        </div>
      </div>

      <SignQuoteModal
        isOpen={signModalOpen}
        onClose={() => setSignModalOpen(false)}
        quoteRef={quoteRef}
        quoteTitle={title}
        amount={amount}
        onSigned={handleSigned}
      />
    </>
  );
}
