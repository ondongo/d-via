"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { NavItem } from "./NavItem";
import ResponsiveMenu from "./ResponsiveMenu";
import AuthButton from "@/components/atoms/auth/AuthButton";
import { useSession } from "next-auth/react";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isOnArtisanPage = pathname === "/artisans";

  const handleClick = () => {
    if (isOnArtisanPage) {
      router.push("/signup");
    } else {
      router.push("/dashboard/clients");
    }
  };

  const handleClickHome = () => {
    router.push("/");
  };
  return (
    <div className="flex flex-row justify-between p-4  border-b-1 border-dvianeutral-50 bg-dviaheader">
      <div onClick={handleClickHome} className="cursor-pointer flex items-center">
        <Image
          src="/logos/logo.png"
          alt="Logo"
          width={90}
          height={0}
          style={{ maxWidth: "213px", maxHeight: "80px" }}
        />
      </div>

      <div className="flex flex-row gap-8 justify-center items-center">
        <ResponsiveMenu />
        {session ? (
          <button
            onClick={handleClick}
            className={`text-label-large leading-label-large tracking-label-large px-4 py-1 border rounded-8px text-sm font-medium
              hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px] h-[40px] ${
                isOnArtisanPage
                  ? "text-dviaprimary-40 bg-transparent border-dvianeutral-50"
                  : "text-white bg-dviaprimary-40 shadow-lg border-transparent"
              }`}
          >
            {isOnArtisanPage
              ? "Commencer en tant qu'artisan "
              : "Commencer en tant que client"}
          </button>
        ) : (
          <div className="hidden md:flex gap-4">
            <AuthButton
              className={`text-label-large leading-label-large tracking-label-large px-4 py-1 border rounded-8px text-sm font-medium
                hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px] h-[40px] ${
                  isOnArtisanPage
                    ? "text-dviaprimary-40 bg-transparent border-dvianeutral-50"
                    : "text-white bg-dviaprimary-40 shadow-lg border-transparent"
                }`}
            >
              {isOnArtisanPage
                ? "Commencer en tant qu'artisan "
                : "Commencer en tant que client"}
            </AuthButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
