"use client";

import { useRouter } from "next/navigation";
import type { AnalysisCreditState } from "@/hooks/useAnalysisHistory";

interface Props {
  state: AnalysisCreditState;
}

export default function CreditStateBlock({ state }: Props) {
  const router = useRouter();

  if (
    state === "guest_free_analysis_available" ||
    state === "authenticated_with_credits"
  ) {
    return null;
  }

  if (state === "guest_free_analysis_used") {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 px-6 text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-dvianeutral-94 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E16A26"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>

        <div>
          <h2 className="text-headline-small leading-headline-small font-semibold text-dvianeutral-10 mb-2">
            Analyse gratuite utilisée
          </h2>
          <p className="text-body-medium text-dvianeutralvariant-60 max-w-sm">
            Vous avez déjà utilisé votre analyse gratuite. Connectez-vous ou
            achetez des crédits pour continuer.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button
            onClick={() => router.push("/signin")}
            className="flex-1 bg-dviaprimary-40 text-white text-sm font-medium py-3 px-6 rounded-8px hover:shadow-md transition-shadow duration-300 cursor-pointer"
          >
            Se connecter
          </button>
          <button
            onClick={() => router.push("/pricing")}
            className="flex-1 border border-dviaprimary-40 text-dviaprimary-40 text-sm font-medium py-3 px-6 rounded-8px hover:bg-dviaprimary-99 transition-colors duration-200 cursor-pointer"
          >
            Acheter des crédits
          </button>
        </div>
      </div>
    );
  }

  // authenticated_without_credits
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-6 text-center gap-6">
      <div className="w-16 h-16 rounded-full bg-dvianeutral-94 flex items-center justify-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E16A26"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      </div>

      <div>
        <h2 className="text-headline-small leading-headline-small font-semibold text-dvianeutral-10 mb-2">
          Plus de crédits disponibles
        </h2>
        <p className="text-body-medium text-dvianeutralvariant-60 max-w-sm">
          Vous avez épuisé vos crédits d&apos;analyse. Rechargez votre compte
          pour analyser de nouveaux devis.
        </p>
      </div>

      <button
        onClick={() => router.push("/pricing")}
        className="bg-dviaprimary-40 text-white text-sm font-medium py-3 px-8 rounded-8px hover:shadow-md transition-shadow duration-300 cursor-pointer"
      >
        Acheter des crédits
      </button>
    </div>
  );
}
