"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import SignupModeModal from "@/components/molecules/auth/signup/SignupModeModal";
import AttestationUploadModal from "@/components/molecules/auth/signup/AttestationUploadModal";
import LoginClientModal from "@/components/molecules/auth/login/LoginModal";
import SignupClientModal from "@/components/molecules/auth/signup-client/SignupClientModal";

export default function BottomActionButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isOnArtisanPage = pathname === "/artisans";
  const [isSignupModeModalOpen, setIsSignupModeModalOpen] = useState(false);
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);
  const [isClientLoginModalOpen, setIsClientLoginModalOpen] = useState(false);
  const [isClientSignupModalOpen, setIsClientSignupModalOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<"client" | "artisan">("client");

  const handleClick = () => {
    if (isOnArtisanPage) {
      setIsSignupModeModalOpen(true);
    } else {
      router.push("/dashboard/clients/search");
    }
  };

  const handleSelectRapid = () => {
    setIsSignupModeModalOpen(false);
    setIsAttestationModalOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 z-[99999] flex w-full justify-center bg-dvianeutral-96 px-4 py-6 md:hidden">
        {session ? (
          <button
            onClick={handleClick}
            className={`text-label-large leading-label-large tracking-label-large h-[40px] w-full max-w-[260px] cursor-pointer rounded-8px border px-4 py-1 text-sm font-medium transition-shadow duration-300 hover:shadow-sm ${
              isOnArtisanPage
                ? "border-dvianeutral-50 bg-transparent text-dviaprimary-40"
                : "border-transparent bg-dviaprimary-40 text-white shadow-lg"
            }`}
          >
            {isOnArtisanPage ? "Dashboard Artisan" : "Dashboard Client"}
          </button>
        ) : (
          <div className="flex w-full max-w-[360px] gap-3 items-center justify-center">
            <button
              onClick={() => {
                if (isOnArtisanPage) {
                  setLoginMode("artisan");
                  setIsClientLoginModalOpen(true);
                } else {
                  setLoginMode("client");
                  setIsClientLoginModalOpen(true);
                }
              }}
              className="text-label-large leading-label-large tracking-label-large h-[40px] cursor-pointer rounded-8px border border-dvianeutral-50 bg-transparent px-4 py-1 text-sm font-medium text-dviaprimary-40 transition-shadow duration-300 hover:shadow-sm"
            >
              Connexion
            </button>

            <button
              onClick={() => {
                if (isOnArtisanPage) {
                  handleClick();
                } else {
                  setIsClientSignupModalOpen(true);
                }
              }}
              className="text-label-large leading-label-large tracking-label-large h-[40px] cursor-pointer rounded-8px border border-transparent bg-dviaprimary-40 px-4 py-1 text-sm font-medium text-white shadow-lg transition-shadow duration-300 hover:shadow-sm"
            >
              Inscription
            </button>
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

      <LoginClientModal
        isOpen={isClientLoginModalOpen}
        onClose={() => setIsClientLoginModalOpen(false)}
        onOpenSignupClient={() => setIsClientSignupModalOpen(true)}
        mode={loginMode}
      />

      <SignupClientModal
        isOpen={isClientSignupModalOpen}
        onClose={() => setIsClientSignupModalOpen(false)}
        onOpenLoginClient={() => setIsClientLoginModalOpen(true)}
      />
    </>
  );
}
