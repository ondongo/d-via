"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import ResponsiveMenu from "./ResponsiveMenu";
import AuthButton from "@/components/atoms/auth/AuthButton";
import { useSession } from "next-auth/react";
import SignupModeModal from "@/components/molecules/auth/signup/SignupModeModal";
import AttestationUploadModal from "@/components/molecules/auth/signup/AttestationUploadModal";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isOnArtisanPage = pathname === "/artisans";
  const [isSignupModeModalOpen, setIsSignupModeModalOpen] = useState(false);
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);

  const handleClick = () => {
    if (isOnArtisanPage) {
      setIsSignupModeModalOpen(true);
    } else {
      router.push("/dashboard/clients");
    }
  };

  const handleClickHome = () => {
    router.push("/");
  };

  const handleSelectRapid = () => {
    setIsSignupModeModalOpen(false);
    setIsAttestationModalOpen(true);
  };
  return (
    <div className="flex flex-row justify-between p-4  border-b-1 border-dvianeutral-50 ">
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
              onClick={isOnArtisanPage ? handleClick : undefined}
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

      <SignupModeModal
        isOpen={isSignupModeModalOpen}
        onClose={() => setIsSignupModeModalOpen(false)}
        onSelectRapid={handleSelectRapid}
      />

      <AttestationUploadModal
        isOpen={isAttestationModalOpen}
        onClose={() => setIsAttestationModalOpen(false)}
      />
    </div>
  );
}

export default Header;
