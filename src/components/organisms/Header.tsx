"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ResponsiveMenu from "./ResponsiveMenu";
import { useSession } from "next-auth/react";
import SignupModeModal from "@/components/molecules/auth/signup/SignupModeModal";
import AttestationUploadModal from "@/components/molecules/auth/signup/AttestationUploadModal";
import LoginClientModal from "@/components/molecules/auth/login/LoginModal";
import SignupClientModal from "@/components/molecules/auth/signup-client/SignupClientModal";
import { toast } from "react-toastify";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  useEffect(() => {
    const authError = searchParams.get("authError");
    if (authError === "artisan-google") {
      toast.error(
        "Ce compte est lié au parcours artisan. Veuillez utiliser l'inscription/connexion artisan."
      );
      router.replace(pathname);
      return;
    }
    if (authError === "artisan-google-signup-required") {
      toast.info(
        "Aucun compte artisan trouvé avec Google. Veuillez compléter l'inscription artisan."
      );
      router.replace(pathname);
    }
  }, [pathname, router, searchParams]);

  return (
    <div className="flex flex-row justify-between p-4 border-b-1 border-dvianeutral-50 ">
      <div
        onClick={handleClickHome}
        className="cursor-pointer flex items-center"
      >
        <Image
          src="/logos/logo.png"
          alt="Logo"
          width={90}
          height={0}
          style={{ maxWidth: "213px", maxHeight: "80px" }}
        />
      </div>

      <div className="flex flex-row gap-4 justify-center items-center">
        <ResponsiveMenu />

        <div className="hidden md:block">
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
              {isOnArtisanPage ? "Dashboard Artisan" : "Dashboard Client"}
            </button>
          ) : (
            // Afficher à la fois Connexion et Inscription quand l'utilisateur n'est pas connecté
            <div className="flex gap-4 items-center">
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
                className={`text-label-large leading-label-large tracking-label-large px-4 py-1 border rounded-8px text-sm font-medium
                hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[140px] h-[40px] text-dviaprimary-40 bg-transparent border-dvianeutral-50`}
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
                className={`text-label-large leading-label-large tracking-label-large px-4 py-1 border rounded-8px text-sm font-medium
                hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px] h-[40px] 
                text-white bg-dviaprimary-40 shadow-lg border-transparent`}
              >
                Inscription
              </button>
            </div>
          )}
        </div>
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
    </div>
  );
}

export default Header;
