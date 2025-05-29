"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isOnArtisanPage = pathname === "/artisans";

  const handleClick = () => {
    if (isOnArtisanPage) {
      router.push("/");
    } else {
      router.push("/artisans");
    }
  };

  const handleClickHome = () => {
    router.push("/");
  };
  return (
    <div className="flex flex-row justify-between p-4  border-b-1 border-dvianeutral-50">
      <div onClick={handleClickHome}>
        <Image
          src="/logos/logo.png"
          alt="Logo"
          width={120}
          height={0}
          style={{ maxWidth: "213px", maxHeight: "80px" }}
        />
      </div>

      <button
        onClick={handleClick}
        className="hidden md:block text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-1 shadow-lg border rounded-8px border-transparent text-sm font-medium
               hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px]  max-h-[40px]"
      >
        {isOnArtisanPage
          ? "Commencer en tant que client"
          : "Commencer en tant qu'artisan"}
      </button>
    </div>
  );
}

export default Header;
