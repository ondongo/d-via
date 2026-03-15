"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DashboardClientCreditsHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [analysisCredits, setAnalysisCredits] = useState<number>(1);

  useEffect(() => {
    const creditsFromStorage = window.localStorage.getItem("dvia_analysis_credits");
    if (!creditsFromStorage) return;

    const parsedCredits = Number(creditsFromStorage);
    if (!Number.isNaN(parsedCredits) && parsedCredits >= 0) {
      setAnalysisCredits(parsedCredits);
    }
  }, []);

  if (pathname !== "/dashboard/clients") {
    return null;
  }

  return (
    <div className="w-full md:w-auto p-4 rounded-2xl border border-dvianeutral-50 bg-dvianeutral-96 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <p className="text-dvianeutral-10 text-base md:text-lg font-medium">
          Crédits restants : <span className="font-bold ">{analysisCredits}</span>
        </p>
      </div>
      <a
        href="/pricing"
        className="inline-flex items-center justify-center text-white text-sm font-medium bg-dviaprimary-40 px-4 py-2 rounded-8px hover:shadow-sm transition-shadow duration-300"
      >
        Recharger mes crédits
      </a>
    </div>
  );
}
