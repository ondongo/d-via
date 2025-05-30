"use client";
import { useLocationContext } from "@/providers/LocationProvider";
import { useState } from "react";
import { Modal } from "../../atoms/ui/modals/CustomModal";
import OverviewStep from "./OverviewStep";
import AddressStep from "./AddressStep";
import { useGlobalState } from "@/providers/globalState";

export const LeftSection = () => {
  const [modalStep, setModalStep] = useState<"overview" | "address">(
    "overview"
  );

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    if (modalStep === "overview") {
      setModalOpen(false);
    } else {
      setModalStep("overview");
    }
  };

  const {
    selectedAddress,
    setSelectedAddress,
    job,
    experienceYears,
    setCoordinates,
    coordinates,
    map,
  } = useGlobalState();

  const handleSelectAddress = (
    address: string,
    lat?: number,
    long?: number
  ) => {
    setSelectedAddress(address);

    if (typeof lat === "number" && typeof long === "number") {
      setCoordinates([lat, long]);
    }
  };

  const handleBack = () => {
    setModalStep("overview");
  };

  const handleUpdateEstimation = () => {
    if (map && coordinates) {
      map.setView(coordinates, 13);
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4">
      {/* Pour les grands écrans (md et +) */}
      <h1 className="hidden md:block text-[44px] font-bold leading-display-large tracking-display-large text-dvianeutral-10 text-center">
        Votre inscription pourrait
        <br /> vous rapporter{" "}
        <span className="text-dviaprimary-40">35 Clients </span> avec{" "}
        <span className="text-dvianeutral-10">D-VIA</span>
      </h1>

      {/* Pour les petits écrans (en dessous de md) */}
      <h1 className="min-w-[330px]  block md:hidden text-[24px] font-bold leading-display-small tracking-display-small text-dvianeutral-10 text-center">
        Votre inscription pourrait vous rapporter
        <span className="text-dviaprimary-40"> 35 Client</span>
        <br /> avec <span className="text-dvianeutral-10">D-VIA</span>
      </h1>

      <div className="flex flex-row items-center gap-2  text-dvianeutral-10 text-base md:text-lg mt-4">
        <a href="#" className="underline font-bold">
          10 km
        </a>
        <span className="font-normal"> · </span> Autour de chez vous
      </div>

      <a
        href="#"
        className="text-dvianeutralvariant-30 underline text-sm md:text-md leading-display-medium tracking-title-small mb-4"
      >
        Comprendre l&apos;estimation clients
      </a>

      {/* Slider */}
      <div className="relative mt-10 max-w-[349px] w-full">
        <div className="absolute -top-13 left-[30%] transform -translate-x-1/2">
          <div className="bg-dviaprimary-40 text-white px-3.5 py-2.5 rounded-full text-sm font-[400] md:font-bold">
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

      <div
        onClick={() => openModal()}
        className="  cursor-pointer mt-6 bg-white border border-dvianeutralvariant-30 rounded-full px-5 py-4 flex items-center space-x-2 text-dvianeutral-10 min-w-[320px] max-w-[320px] md:min-w-[360px] md:max-w-full"
      >
        <img
          className="w-4 h-4 text-dvianeutralvariant-30"
          src="/icons/LocationBlue.svg"
        />

        <span className="text-sm font-bold text-dvianeutralvariant-30 text-nowrap">
          {selectedAddress.length > 20
            ? selectedAddress.slice(0, 12).trim() + "…"
            : selectedAddress}
        </span>
        <button className="font-normal outline-none border-none bg-transparent   text-sm text-dvianeutralvariant-30 w-full">
          {job} · {experienceYears} {experienceYears > 1 ? "ans" : "an"}{" "}
          d&apos;expérience
        </button>
      </div>

      <Modal
        onClose={closeModal}
        title={
          modalStep === "overview"
            ? "Parlez-nous de votre situation"
            : "Votre adresse ou votre zone"
        }
        isOpen={modalOpen}
      >
        <div className="flex flex-col gap-4 w-[450px] overflow-hidden items-center mx-4">
          {modalStep === "overview" ? (
            <OverviewStep
              onAddressClick={() => setModalStep("address")}
              city={selectedAddress}
              handleUpdateEstimation={handleUpdateEstimation}
            />
          ) : (
            <AddressStep
              onSelectAddress={handleSelectAddress}
              onBack={handleBack}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
