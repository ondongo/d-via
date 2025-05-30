"use client";
import { useGlobalState } from "@/providers/globalState";
import React, { useState } from "react";

function OverviewStep({
  onAddressClick,
  city,
  handleUpdateEstimation,
}: {
  onAddressClick: () => void;
  city: string;
  handleUpdateEstimation: any;
}) {
  const { setJob, setExperienceYears } = useGlobalState();
  return (
    <>
      {" "}
      <div className="flex flex-col gap-2 py-6 border-dvianeutral-50 border-b-1 w-full px-16 md:px-4">
        <p className="text-dvianeutralvariant-30 text-[14px] leading-title-small tracking-title-small font-[400]">
          Adresse ou zone
        </p>
        <div
          onClick={onAddressClick}
          className="cursor-pointer mx-4 bg-white border border-dvianeutralvariant-30 rounded-full px-5 py-4 flex items-center space-x-2 text-dvianeutral-10 "
        >
          <img
            className="w-4 h-4 text-dvianeutralvariant-30"
            src="/icons/LocationBlue.svg"
          />

          <span className="text-sm font-bold text-dvianeutralvariant-30 text-nowrap">
            {city.length > 20 ? city.slice(0, 40).trim() + "…" : city}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-6 border-dvianeutral-50 border-b-1 w-full px-16 md:px-4">
        <p className="text-dvianeutralvariant-30 text-[14px] leading-title-small tracking-title-small font-[400]">
          Métier
        </p>

        <div
          className={` mx-4 border px-5 py-4  flex items-center gap-2 
              rounded-full border-dvianeutralvariant-30 bg-white
          }`}
        >
          <img src="/icons/SearchBlue.svg" alt="loc" className="w-4 h-4" />
          <input
            onChange={(e) => setJob(e.target.value)}
            type="text"
            placeholder="Quel est votre métier ?"
            className="flex-1 text-sm font-bold text-dvianeutralvariant-30 outline-none placeholder:dvianeutralvariant-30 placeholder:text-sm placeholder:font-normal"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 p-6 border-dvianeutral-50 border-b-1 w-full px-16 md:px-4">
        <p className="text-dvianeutralvariant-30 text-[14px] leading-title-small tracking-title-small font-[400]">
          Années d&apos;expériences
        </p>
        <div
          className={` mx-4 border px-5 py-4  flex items-center gap-2 
              rounded-full border-dvianeutralvariant-30 bg-white
          }`}
        >
          <img src="/icons/SearchBlue.svg" alt="loc" className="w-4 h-4" />
          <input
            onChange={(e) => setExperienceYears(Number(e.target.value))}
            type="number"
            min={1}
            placeholder="Combien d'années d'experiences ?"
            className="flex-1 text-sm font-bold text-dvianeutralvariant-30 outline-none placeholder:dvianeutralvariant-30 placeholder:text-sm placeholder:font-normal"
          />
        </div>
      </div>
      <button onClick={handleUpdateEstimation} className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px] mb-4">
        Mettre à jour l’estimation
      </button>
    </>
  );
}

export default OverviewStep;
