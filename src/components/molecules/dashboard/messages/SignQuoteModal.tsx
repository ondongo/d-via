"use client";

import { useRef, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import { Modal } from "@/components/atoms/ui/modals/CustomModal";

export type SignQuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  quoteRef: string;
  quoteTitle: string;
  amount: string;
  onSigned?: (payload: { dataUrl: string; quoteRef: string }) => void;
};


export default function SignQuoteModal({
  isOpen,
  onClose,
  quoteRef,
  quoteTitle,
  amount,
  onSigned,
}: SignQuoteModalProps) {
  const sigRef = useRef<SignatureCanvas>(null);

  const handleClear = useCallback(() => {
    sigRef.current?.clear();
  }, []);

  const handleConfirm = useCallback(() => {
    const pad = sigRef.current;
    if (!pad || pad.isEmpty()) {
      toast.warning("Veuillez apposer votre signature dans la zone prévue.");
      return;
    }
    const dataUrl = pad.toDataURL("image/png");
    onSigned?.({ dataUrl, quoteRef });
    toast.success("Signature enregistrée (démo). Le devis sera traité prochainement.");
    pad.clear();
    onClose();
  }, [onClose, onSigned, quoteRef]);

  const handleClose = useCallback(() => {
    sigRef.current?.clear();
    onClose();
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Signer le devis"
      className="w-[min(100vw-2rem,440px)] max-h-[90dvh]"
    >
      <div className="flex w-full flex-col gap-4 px-4 pb-2">
        <div className="rounded-8px border border-dvianeutral-50 bg-dvianeutral-96 px-3 py-2 text-sm">
          <p className="text-dvianeutralvariant-60 text-xs">Réf. {quoteRef}</p>
          <p className="font-semibold text-dvianeutral-10">{quoteTitle}</p>
          <p className="text-dviaprimary-40 font-bold">{amount}</p>
        </div>

        <div>
          <p className="text-dvianeutralvariant-40 mb-2 text-xs font-medium">
            Signez dans le cadre ci-dessous
          </p>
          <SignatureCanvas
            ref={sigRef}
            penColor="#112648"
            minWidth={0.8}
            maxWidth={2.2}
            velocityFilterWeight={0.7}
            canvasProps={{
              className:
                "w-full max-w-full touch-none cursor-crosshair rounded-8px border border-dvianeutral-50 bg-white",
              width: 400,
              height: 200,
            }}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="order-2 rounded-8px border border-dvianeutral-50 px-4 py-2 text-sm  text-dvianeutralvariant-40 transition-colors hover:border-dviaprimary-40 hover:text-dviaprimary-40 sm:order-1"
          >
            Effacer
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="order-1 rounded-8px bg-dviaprimary-40 px-4 py-2 text-sm font-medium text-white shadow-sm transition-shadow hover:shadow-md sm:order-3"
          >
            Valider la signature
          </button>
        </div>
      </div>
    </Modal>
  );
}
