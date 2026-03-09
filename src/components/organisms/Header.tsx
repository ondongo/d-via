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
  const [roleMode, setRoleMode] = useState<'search' | 'client'>('search');

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

  // Bascule le libellé entre 'je cherche un artisan' et 'je suis un client'
  const toggleRoleMode = () => {
    setRoleMode((prev) => (prev === 'search' ? 'client' : 'search'));
  };

  return (
    <div className="flex flex-row justify-between p-4  border-b-1 border-dvianeutral-50 ">
      <div     onClick={handleClickHome} className="cursor-pointer flex items-center">
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
        {/* Toggle rôle simple */}
        <button
          aria-pressed={roleMode === 'client'}
          onClick={toggleRoleMode}
          className="text-sm px-3 py-2 rounded-8px border border-dvianeutral-50 bg-transparent text-dviaprimary-40 hover:bg-dvianeutral-94 transition-colors"
        >
          {roleMode === 'search' ? 'Je cherche un artisan' : 'Je suis un client'}
        </button>
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
            {roleMode === 'search'
              ? "Commencer en tant que chercheur"
              : "Commencer en tant que client"}
          </button>
        ) : (
          // Afficher à la fois Connexion et Inscription quand l'utilisateur n'est pas connecté
          <div className="flex gap-4 items-center">
            <button
              onClick={() => {
                if (isOnArtisanPage) {
                  router.push('/auth/signin');
                } else {
                  router.push('/login-client');
                }
              }}
              className={`text-label-large leading-label-large tracking-label-large px-4 py-1 border rounded-8px text-sm font-medium
                hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[140px] h-[40px] text-dviaprimary-40 bg-transparent border-dvianeutral-50`}
            >
              Connexion
            </button>

            <AuthButton
              onClick={() => {
                if (isOnArtisanPage) {
                  handleClick();
                } else {
                  router.push("/signup-client/step1");
                }
              }}
              className={`text-label-large leading-label-large tracking-label-large px-4 py-1 border rounded-8px text-sm font-medium
                hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px] h-[40px] ${
                  isOnArtisanPage
                    ? "text-dviaprimary-40 bg-transparent border-dvianeutral-50"
                    : "text-white bg-dviaprimary-40 shadow-lg border-transparent"
                }`}
            >
              Inscription
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
