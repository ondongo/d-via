"use client";

import { getAnalysisEntitlement } from "@/actions/analysis";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DashboardClientCreditsHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState<number | null>(null);

  const loadCredits = useCallback(async () => {
    if (status !== "authenticated" || !session?.user) {
      setCredits(null);
      return;
    }
    try {
      const result = await getAnalysisEntitlement();
      if (result.ok && result.data.mode === "user") {
        setCredits(result.data.credits);
      }
    } catch {
      /* ignore */
    }
  }, [session?.user, status]);

  useEffect(() => {
    void loadCredits();
  }, [loadCredits]);

  useEffect(() => {
    const onRefresh = () => {
      void loadCredits();
    };
    window.addEventListener("dvia-entitlement-changed", onRefresh);
    return () =>
      window.removeEventListener("dvia-entitlement-changed", onRefresh);
  }, [loadCredits]);

  if (pathname !== "/dashboard/clients") {
    return null;
  }

  if (status === "loading") {
    return null;
  }

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="w-full md:w-auto p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <p className="text-dvianeutral-10 text-base md:text-lg font-medium">
          Crédits restants :{" "}
          <span className="font-bold ">
            {credits === null ? "…" : credits}
          </span>
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
