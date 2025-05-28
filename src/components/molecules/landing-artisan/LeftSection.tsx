"use client";
import { useLocationContext } from "@/providers/LocationProvider";
import { useState } from "react";
import { Modal } from "../../atoms/ui/modals/CustomModal";

export const LeftSection = () => {
  const { currentLocation } = useLocationContext();

  const city = currentLocation?.city || "Paris";
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4">
      <h1 className="text-4xl md:text-[44px] font-bold leading-display-large tracking-display-large  text-dvianeutral-10 text-center">
        Votre inscription pourrait
        <br />
        vous rapporter <span className="text-dviaprimary-40">35 Clients</span>
        <br />
        avec <span className="text-dvianeutral-10">D-VIA</span>
      </h1>

      <div className="flex flex-row items-center gap-2  text-dvianeutral-10 text-base md:text-lg mt-4">
        <a href="#" className="underline font-bold">
          10 km
        </a>
        <span className="font-normal"> · </span> Autour de chez vous
      </div>

      <a
        href="#"
        className="text-dvianeutralvariant-30 underline text-md leading-display-medium tracking-title-small mb-4"
      >
        Comprendre l&apos;estimation clients
      </a>

      {/* Slider */}
      <div className="relative mt-10 max-w-[349px] w-full">
        <div className="absolute -top-13 left-[30%] transform -translate-x-1/2">
          <div className="bg-dviaprimary-40 text-white px-3.5 py-2.5 rounded-full text-sm font-bold">
            10 Km
          </div>
        </div>

        <div className="w-full h-4 bg-white rounded-full relative overflow-hidden">
          <div
            className="h-full bg-dviaprimary-40 absolute top-0 left-0"
            style={{ width: "30%" }}
          />
        </div>

        <div
          className="absolute top-[-6px] h-[28px] w-[2px] bg-dviaprimary-40 rounded-full"
          style={{ left: "30%" }}
        />
      </div>

      <div className="mt-6 bg-white border border-dvianeutral-10 rounded-full px-5 py-4 flex items-center space-x-2 text-dvianeutral-10 min-w-[360px]">
        <svg
          className="w-4 h-4 text-dvianeutral-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>

        <span className="text-sm font-bold text-dvianeutral-10">{city}</span>
        <button
          onClick={() => openModal()}
          className="font-normal outline-none border-none bg-transparent   text-sm text-dvianeutral-10 w-full"
        >
          Carreleur · 3 ans d’expériences
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        showCloseButton={true}
        className="max-w-[520px] z-[99999]"
        title={"Parlez-nous de votre situation"}
      >
        sksks
      </Modal>
    </div>
  );
};
