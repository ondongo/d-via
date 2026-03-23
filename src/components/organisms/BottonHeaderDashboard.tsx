"use client";
import { ICONS } from "@/constants/icons";
import { usePathname, useRouter } from "next/navigation";

export default function BottomHeaderDashboard() {
  const router = useRouter();
  const pathname = usePathname();


  return (
    <div className="fixed bottom-0 left-0 w-full bg-dvianeutral-96 px-4 py-3  z-[99999] md:hidden flex justify-center">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col justify-center items-center gap-2 leading-label-medium text-label-medium tracking-label-medium font-semibold">
          <button
            onClick={() => router.push("/dashboard/clients")}
            className={`rounded-28px px-5 py-2 transition-all duration-200 hover:bg-dviasecondary-90 cursor-pointer ${
              pathname === "/dashboard/clients" ? "bg-dviasecondary-90" : ""
            }`}
          >
            <img
              src={
                pathname === "/dashboard/clients"
                  ? ICONS.dashboardNav.quoteAnalysisActive
                  : ICONS.dashboardNav.quoteAnalysis
              }
              alt="Analyse de devis"
              className="w-[24px] h-[24px]"
            />
          </button>
          <span className="max-w-[70px] group-hover:max-w-[120px] truncate overflow-hidden whitespace-nowrap text-center transition-all duration-300 ease-in-out">
            Analyse de devis
          </span>
        </div>

        <div className="flex flex-col justify-center items-center gap-2 text-dvianeutralvariant-30 leading-label-medium text-label-medium tracking-label-medium">
          <button
            onClick={() => router.push("/dashboard/clients/search")}
            className={`rounded-28px px-5 py-2 transition-all duration-200 hover:bg-dviasecondary-90 cursor-pointer ${
              pathname === "/dashboard/clients/search"
                ? "bg-dviasecondary-90"
                : ""
            }`}
          >
            <img
              src={
                pathname === "/dashboard/clients/search"
                  ? ICONS.dashboardNav.artisansActive
                  : ICONS.dashboardNav.artisans
              }
              alt="Artisans"
              className="w-[24px] h-[24px]"
            />
          </button>
          Artisans
        </div>

        <div className="flex flex-col justify-center items-center gap-2 text-dvianeutralvariant-30 leading-label-medium text-label-medium tracking-label-medium">
          <button
            onClick={() => router.push("/dashboard/clients/messages")}
            className={`rounded-28px px-5 py-2 transition-all duration-200 hover:bg-dviasecondary-90 cursor-pointer ${
              pathname.startsWith("/dashboard/clients/messages")
                ? "bg-dviasecondary-90"
                : ""
            }`}
          >
            <img
              src={
                pathname.startsWith("/dashboard/clients/messages")
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
