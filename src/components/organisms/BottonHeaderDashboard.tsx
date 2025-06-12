"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FiFileText } from "react-icons/fi";

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
                  ? "/dashboard/active/quick_reference_all.svg"
                  : "/dashboard/quick_reference_all.svg"
              }
              alt="logo"
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
                  ? "/dashboard/active/search.svg"
                  : "/dashboard/search.svg"
              }
              alt="logo"
              className="w-[24px] h-[24px]"
            />
          </button>
          Artisans
        </div>

        <div className="flex flex-col justify-center items-center gap-2 text-dvianeutralvariant-30 leading-label-medium text-label-medium tracking-label-medium">
          <button
            onClick={() => router.push("/coming")}
            className={`rounded-28px px-5 py-2 transition-all duration-200 hover:bg-dviasecondary-90 cursor-pointer ${
              pathname === "/dashboard/articles" ? "bg-dviasecondary-90" : ""
            }`}
          >
            <img
              src={
                pathname === "/dashboard/articles"
                  ? "/dashboard/active/articles.svg"
                  : "/dashboard/articles.svg"
              }
              alt="logo"
              className="w-[24px] h-[24px]"
            />
          </button>
          Articles
        </div>
      </div>
    </div>
  );
}
