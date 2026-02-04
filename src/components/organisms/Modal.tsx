"use client";

import React, { useEffect } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  onCapture?: () => void; // Prendre une photo
  onImport?: (file?: File) => void; // Importer fichier
  children?: React.ReactNode; // optionnel si besoin d’ajouter du contenu
};

// Modal d'ajout de devis (bottom sheet)
export default function Modal({
  open,
  title = "Ajout de devis",
  onClose,
  onCapture,
  onImport,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && onImport) onImport(f);
  };

  return (
    <div
      aria-modal
      role="dialog"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full md:w-[560px] max-w-[560px] mx-auto rounded-12px bg-dvianeutral-96 shadow-lg border border-dvianeutral-60">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dvianeutral-60">
          <h3 className="text-dvianeutral-10 text-[18px] font-semibold">{title}</h3>
          <button
            aria-label="Fermer"
            onClick={onClose}
            className="p-2 rounded-8px hover:bg-dvianeutral-94 text-dvianeutral-20"
          >
            ✕
          </button>
        </div>

        {/* Body actions */}
        <div className="px-5 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Action: Prendre une photo */}
            <button
                onClick={onCapture}
                className="flex flex-col items-center gap-2 p-4 rounded-12px border border-dvianeutral-50 bg-dvianeutral-94 hover:bg-dvianeutral-92 transition-colors cursor-pointer"
            >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-8px bg-dvianeutral-90 border border-dvianeutral-60 text-dvianeutral-10">
            {/* Icône appareil photo */}
            <img src="/icons/photo.svg" alt="" className="w-5 h-5" />
            </span>
              <span className="text-dvianeutral-20 text-sm font-medium">Prendre une photo</span>
            </button>

            {/* Action: Importer fichier */}

            <label className="flex flex-col items-center gap-2 p-4 rounded-12px border border-dviaprimary-40 bg-dviaprimary-94 hover:bg-dviaprimary-92 transition-colors cursor-pointer">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-8px bg-dviaprimary-90 border border-dviaprimary-50">
            {/* Icône document */}
            <img src="/icons/document.svg" alt="camera" className="w-5 h-5" />
            </span>
              <span className="text-dviaprimary-40 text-sm font-medium mt-2">Importer fichier</span>
              <input
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={handleFileChange}
              />
            </label>

          </div>

          {/* Slot optionnel */}
          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
