"use client";
import React, { useState } from "react";

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};
function InputAddress() {
  return (
    <div className="min-w-[250px] max-w-[250px] p-4 flex flex-col rounded-xl px-16 md:px-4">
      <div
        className='border px-4 py-3 flex items-center gap-2 rounded-8px border-dvianeutral-50  bg-dvianeutral-94'
      >
        <img src="/icons/LocationBlue.svg" alt="loc" className="w-4 h-4" />
        <input
          type="text"
          placeholder="Où êtes-vous situé ?"
          className="flex-1 text-sm  text-dvianeutralvariant-30 outline-none placeholder:dvianeutralvariant-30 placeholder:text-sm placeholder:font-normal"
        />
      </div>
    </div>
  );
}

export default InputAddress;
