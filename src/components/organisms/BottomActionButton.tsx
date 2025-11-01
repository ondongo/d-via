"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FiFileText } from "react-icons/fi";

export default function BottomActionButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isOnArtisanPage = pathname === "/artisans";

  const handleClick = () => {
    if (isOnArtisanPage) {
      router.push("/signup");
    } else {
      router.push("/dashboard/clients/search");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-dvianeutral-96 px-4 py-6  z-[99999] md:hidden flex justify-center">
      <button
        onClick={handleClick}
        className={`text-label-large leading-label-large tracking-label-large px-4 py-1 border rounded-8px text-sm font-medium
               hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px] h-[40px] ${
                 isOnArtisanPage
                   ? "text-dviaprimary-40 bg-transparent border-dvianeutral-50"
                   : "text-white bg-dviaprimary-40 shadow-lg border-transparent"
               }`}
      >
        {isOnArtisanPage
          ? "Commencer en tant qu'artisan "
          : "Commencer en tant que client"}
      </button>
    </div>
  );
}
