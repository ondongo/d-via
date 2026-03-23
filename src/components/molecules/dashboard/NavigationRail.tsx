"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { ICONS } from "@/constants/icons";

function navLabelClass(active: boolean) {
  return `max-w-[70px] group-hover:max-w-[120px] truncate overflow-hidden whitespace-nowrap text-center leading-label-medium text-label-medium tracking-label-medium transition-colors duration-200 ${
    active
      ? "text-dvianeutral-10 font-semibold"
      : "text-dvianeutralvariant-30 font-medium"
  }`;
}

function NavigationRail() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isAnalysisActive = pathname === "/dashboard/clients";
  const isArtisansActive = pathname.startsWith("/dashboard/clients/search");
  const isMessagesActive = pathname.startsWith("/dashboard/clients/messages");
  const isBlogActive = pathname.startsWith("/dashboard/clients/blog");

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


          <div className="flex flex-col justify-center items-center gap-2">
            <button
              onClick={() => router.push("/dashboard/clients")}
              className={`rounded-28px px-5 py-2 transition-all duration-200 hover:bg-dviasecondary-90 cursor-pointer ${
                isAnalysisActive ? "bg-dviasecondary-90" : ""
              }`}
            >
              <img
                src={
                  isAnalysisActive
                    ? ICONS.dashboardNav.quoteAnalysisActive
                    : ICONS.dashboardNav.quoteAnalysis
                }
                alt="Analyse de devis"
                className="w-[24px] h-[24px]"
              />
            </button>
            <span className={navLabelClass(isAnalysisActive)}>Analyse de devis</span>
          </div>

          <div className="flex flex-col justify-center items-center gap-2">
            <button
              onClick={() => router.push("/dashboard/clients/search")}
              className={`rounded-28px px-5 py-2 transition-all duration-200 hover:bg-dviasecondary-90 cursor-pointer ${
                isArtisansActive ? "bg-dviasecondary-90" : ""
              }`}
            >
              <img
                src={
                  isArtisansActive
                    ? ICONS.dashboardNav.artisansActive
                    : ICONS.dashboardNav.artisans
                }
                alt="Artisans"
                className="w-[24px] h-[24px]"
              />
            </button>
            <span className={navLabelClass(isArtisansActive)}>Artisans</span>
          </div>

          <div className="flex flex-col justify-center items-center gap-2">
            <button
              onClick={() => router.push("/dashboard/clients/messages")}
              className={`rounded-28px px-5 py-2 transition-all duration-200 hover:bg-dviasecondary-90 cursor-pointer ${
                isMessagesActive ? "bg-dviasecondary-90" : ""
              }`}
            >
              <img
                src={
                  isMessagesActive
                    ? ICONS.dashboardNav.messagesActive
                    : ICONS.dashboardNav.messages
                }
                alt="Messages"
                className="w-[24px] h-[24px]"
              />
            </button>
            <span className={navLabelClass(isMessagesActive)}>Messages</span>
          </div>

          <div className="flex flex-col justify-center items-center gap-2">
            <button
              onClick={() => router.push("/dashboard/clients/blog")}
              className={`rounded-28px px-5 py-2 transition-all duration-200 hover:bg-dviasecondary-90 cursor-pointer ${
                isBlogActive ? "bg-dviasecondary-90" : ""
              }`}
            >
              <img
                src={
                  isBlogActive
                    ? ICONS.dashboardNav.articlesActive
                    : ICONS.dashboardNav.articles
                }
                alt="Articles"
                className="w-[24px] h-[24px]"
              />
            </button>
            <span className={navLabelClass(isBlogActive)}>Articles</span>
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
                src={ICONS.dashboardNav.user}
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
