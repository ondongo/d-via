"use client";
import React from "react";
import { FaFile } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
function NavigationRail() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  
  const handleClickHome = () => {
    router.push("/");
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };
  return (
    <div
      className="group fixed top-0 left-0 h-screen z-50 bg-dvianeutral-90 border-r border-dvianeutral-50 
                w-[90px] hover:w-[160px] transition-all duration-300 ease-in-out overflow-hidden"
    >
      <div className="flex flex-col py-[44px] justify-between h-full min-h-screen items-center">
        <div className="flex flex-col gap-4 justify-center items-center">
          <div onClick={handleClickHome} className="cursor-pointer">
            <img
              src="/logos/Picto.png"
              alt="Logo"
              className="w-12 h-12 mb-4 transition-all duration-200"
            />
          </div>

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

        <div className="flex flex-col items-center gap-2">
          {session?.user ? (
            <>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-dviaprimary-40">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Photo de profil"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-dviaprimary-40 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-dvianeutral-10 group-hover:block hidden transition-all duration-300">
                    {session.user.name || session.user.email}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="text-xs text-dvianeutralvariant-30 hover:text-dviaprimary-40 group-hover:block hidden transition-all duration-300"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              onClick={() => router.push("/coming")}
              className="rounded-28px px-5 py-2 transition-all duration-200 hover:bg-dviasecondary-90 cursor-pointer"
            >
              <img
                src="/dashboard/user.svg"
                alt="logo"
                className="w-[24px] h-[24px]"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavigationRail;
