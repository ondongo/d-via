"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardClientCreditsHeader from "../molecules/dashboard/DashboardClientCreditsHeader";

export default function HeaderDashboard() {
  const router = useRouter();

  return (
    <header className="h-[80px] border-b border-dvianeutral-50 flex items-center justify-between px-6">
      <button onClick={() => router.push("/")} className="cursor-pointer">
        <Image
          src="/logos/logo.png"
          alt="D-VIA"
          width={80}
          height={28}
          className="h-7 w-auto object-contain"
          priority
        />
      </button>

      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="px-6 md:px-0">
            <DashboardClientCreditsHeader />
          </div>
        </div>
        <button className="relative cursor-pointer text-dvianeutralvariant-40 hover:text-dviaprimary-40 transition-colors">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
      </div>
    </header>
  );
}
