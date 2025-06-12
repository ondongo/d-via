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
      router.push("/coming");
    } else {
      router.push("/dashboard/clients/search");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-dvianeutral-96 px-4 py-6  z-[99999] md:hidden flex justify-center">
      <button
        onClick={handleClick}
        className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-1 shadow-lg border rounded-8px border-transparent text-sm font-medium
               hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[260px]  h-[40px]"
      >
        {isOnArtisanPage
          ? "Commencer en tant qu'artisan "
          : "Commencer en tant que client"}
      </button>
    </div>
  );
}
