import Image from "next/image";
import React from "react";

function Header() {
  return (
    <div className="flex flex-row justify-between p-4  border-b-1 border-dvianeutral-50">
      <Image
        src="/logos/logo.png"
        alt="Logo"
        width={120}
        height={0}
        style={{ maxWidth: "213px", maxHeight: "80px" }}
      />

      <button
        className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-1 shadow-lg border rounded-8px border-transparent text-sm font-medium
               hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px]  max-h-[40px]"
      >
        Commencer avec D-VIA
      </button>
    </div>
  );
}

export default Header;
