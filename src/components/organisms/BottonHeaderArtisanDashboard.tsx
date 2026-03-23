"use client";

import { ICONS } from "@/constants/icons";
import { usePathname, useRouter } from "next/navigation";

export default function BottomHeaderArtisanDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-dvianeutral-96 px-4 py-3 z-[99999] md:hidden flex justify-center">
      <div className="flex flex-row justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center gap-2 text-dvianeutralvariant-30 leading-label-medium text-label-medium tracking-label-medium font-semibold">
          <button
            onClick={() => router.push("/dashboard/artisan/messages")}
            className={`rounded-28px px-5 py-2 transition-all duration-200 hover:bg-dviasecondary-90 cursor-pointer ${
              pathname.startsWith("/dashboard/artisan/messages")
                ? "bg-dviasecondary-90"
                : ""
            }`}
          >
            <img
              src={
                pathname.startsWith("/dashboard/artisan/messages")
                  ? ICONS.dashboardNav.messagesActive
                  : ICONS.dashboardNav.messages
              }
              alt="Messages"
              className="h-6 w-6"
            />
          </button>
          Messages
        </div>
      </div>
    </div>
  );
}
