"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { NavItem } from "./NavItem";
import ResponsiveMenu from "./ResponsiveMenu";
import AuthButton from "@/components/atoms/AuthButton";
import { useSession } from "next-auth/react";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isOnArtisanPage = pathname === "/artisans";

  const handleClick = () => {
    if (isOnArtisanPage) {
      router.push("/coming");
    } else {
      router.push("/dashboard/clients");
    }
  };

  const handleClickHome = () => {
    router.push("/");
  };
  return (
    <div className="flex flex-row justify-between p-4  border-b-1 border-dvianeutral-50">
      <div onClick={handleClickHome} className="cursor-pointer">
        <Image
          src="/logos/logo.png"
          alt="Logo"
          width={120}
          height={0}
          style={{ maxWidth: "213px", maxHeight: "80px" }}
        />
      </div>

      <div className="flex flex-row gap-8 justify-center items-center">
        <ResponsiveMenu />
        {session ? (
          <button
            onClick={handleClick}
            className="hidden md:block text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-1 shadow-lg border rounded-8px border-transparent text-sm font-medium
                 hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px]  min-h-[40px] max-h-[40px]"
          >
            {isOnArtisanPage
              ? "Commencer en tant qu'artisan "
              : "Commencer en tant que client"}
          </button>
        ) : (
          <div className="hidden md:flex gap-4">
            <AuthButton
              className="hidden md:block text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-1 shadow-lg border rounded-8px border-transparent text-sm font-medium
                 hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px]  min-h-[40px] max-h-[40px]"
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
