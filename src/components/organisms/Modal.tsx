"use client";

import React, { useEffect, useRef, useState } from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  onCapture?: () => void;
  onImport?: (file?: File) => void;
  children?: React.ReactNode;
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopCamera();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    // Stop camera when modal closes
    if (!open) stopCamera();
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && onImport) onImport(f);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOpen(true);
      if (onCapture) onCapture();
    } catch (err) {
      console.error("getUserMedia error:", err);
      setCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (blob) setCapturedBlob(blob);
    }, "image/jpeg", 0.92);
  };

  const useCapture = () => {
    if (!capturedBlob || !onImport) return;
    const file = new File([capturedBlob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" });
    onImport(file);
    stopCamera();
    setCapturedBlob(null);
  };

  if (!open) return null;

  return (
    <div aria-modal role="dialog" className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={() => { stopCamera(); onClose(); }} />

      {/* Card */}
      <div className="relative w-full md:w-[560px] max-w-[560px] mx-auto rounded-12px bg-dvianeutral-96 shadow-lg border border-dvianeutral-60">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dvianeutral-60">
          <h3 className="text-dvianeutral-10 text-[18px] font-semibold">{title}</h3>
          <button aria-label="Fermer" onClick={() => { stopCamera(); onClose(); }} className="p-2 rounded-8px hover:bg-dvianeutral-94 text-dvianeutral-20">✕</button>
        </div>

        {/* Body actions */}
        <div className="px-5 py-6">
          {/* Bloc caméra (desktop) */}
          {cameraOpen ? (
            <div className="mb-4">
              <div className="rounded-12px overflow-hidden border border-dvianeutral-60 bg-black/20">
                <video ref={videoRef} className="w-full h-[240px] bg-black" playsInline muted />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="mt-3 flex items-center gap-3">
                <button onClick={captureFrame} className="px-4 py-2 rounded-8px border border-dvianeutral-50 bg-dvianeutral-94 hover:bg-dvianeutral-92 text-sm">Capturer</button>
                <button onClick={useCapture} disabled={!capturedBlob} className="px-4 py-2 rounded-8px border border-dviaprimary-40 bg-dviaprimary-94 hover:bg-dviaprimary-92 text-sm disabled:opacity-50">Utiliser</button>
                <button onClick={stopCamera} className="px-4 py-2 rounded-8px border border-dvianeutral-50 bg-dvianeutral-94 hover:bg-dvianeutral-92 text-sm">Arrêter</button>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Action: Prendre une photo */}
            <button onClick={startCamera} className="flex flex-col items-center gap-2 p-4 rounded-12px border border-dvianeutral-50 bg-dvianeutral-94 hover:bg-dvianeutral-92 transition-colors cursor-pointer">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-8px bg-dvianeutral-90 border border-dvianeutral-60 text-dvianeutral-10">
                <img src="/icons/photo.svg" alt="" className="w-5 h-5" />
              </span>
              <span className="text-dvianeutral-20 text-sm font-medium">Prendre une photo</span>
            </button>

            {/* Action: Importer fichier */}
            <label className="flex flex-col items-center gap-2 p-4 rounded-12px border border-dviaprimary-40 bg-dviaprimary-94 hover:bg-dviaprimary-92 transition-colors cursor-pointer">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-8px bg-dviaprimary-90 border border-dviaprimary-50">
                <img src="/icons/document.svg" alt="camera" className="w-5 h-5" />
              </span>
              <span className="text-dviaprimary-40 text-sm font-medium mt-2">Importer fichier</span>
              <input type="file" accept="application/pdf,image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* Slot optionnel */}
          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
