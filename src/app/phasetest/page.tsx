"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const TEST_PHASE_STORAGE_KEY = "dvia_test_phase_accepted";

export default function PhaseTestPage() {
  const router = useRouter();

  const handleAccept = () => {
    try {
      localStorage.setItem(TEST_PHASE_STORAGE_KEY, "true");
      document.cookie = `${TEST_PHASE_STORAGE_KEY}=true; path=/; max-age=31536000; SameSite=Lax`;
      router.replace("/");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[999999]">
      <div className="bg-dvianeutral-90 rounded-2xl w-[90%] max-w-[500px] shadow-lg overflow-hidden">
        <div className="flex flex-col gap-6 p-6 md:p-8">
          <div className="cursor-pointer flex items-start">
            <Image
              src="/logos/logo.png"
              alt="Logo"
              width={120}
              height={0}
              style={{ maxWidth: "213px", maxHeight: "80px" }}
            />
          </div>

          <p className="text-dvianeutralvariant-50 text-title-medium-size leading-headline-medium tracking-headline-medium">
            Bienvenue sur DVIA
          </p>

          <p className="text-dvianeutralvariant-50 text-body-small leading-body-small tracking-body-small">
            Nous sommes ravis de vous avoir ici. Veuillez noter que ce site est
            actuellement en phase de test. Cela signifie que certaines
            fonctionnalités peuvent ne pas fonctionner comme prévu ou être
            temporaires. De plus, toutes les transactions effectuées sont
            fictives et aucune information réelle n&apos;est traitée. Nous vous
            remercions de votre compréhension et de votre patience. Tous les
            retours sont appréciés pendant cette phase !
          </p>

          <div className="flex w-full justify-center align-center">
            <button
              onClick={handleAccept}
              className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-8 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px] flex items-center justify-center gap-2 h-[44px]"
            >
              J&apos;ai compris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
