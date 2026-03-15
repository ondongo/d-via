"use client";
import { usePathname } from "next/navigation";
import { NavItem } from "./NavItem";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export default function ResponsiveMenu() {
  const pathname = usePathname();
  const { data: session } = useSession();
  //const [isOpen, setIsOpen] = useState(false);
  const isOnArtisanPage = pathname === "/artisans";

  const handleSwitchAudience = async () => {
    if (!session) return true;

    await signOut({ redirect: false });
    return true;
  };

  return (
    <nav className="relative">
      {/* Menu desktop */}
      <div className="flex flex-row gap-2 justify-center items-center">
        {!isOnArtisanPage && (
          <NavItem
            title="Je suis un artisan"
            path="/artisans"
            isActive={pathname === "/"}
            onClick={handleSwitchAudience}
            icon={
              <Image
                src="/icons/artisans.svg"
                alt="Artisans"
                width={18}
                height={18}
              />
            }
          />
        )}

        {isOnArtisanPage && (
          <NavItem
            title="Je cherche un artisan"
            path="/"
            isActive={pathname === "/artisans"}
            onClick={handleSwitchAudience}
            icon={
              <Image
                src="/icons/particulars.svg"
                alt="Particulars"
                width={18}
                height={18}
              />
            }
          />
        )}
        {/*         {pathname !== "/artisans" && (
          <NavItem
            title="Tarifs"
            path="/pricing"
            isActive={pathname === "/pricing"}
          />
        )} */}

        {/* {pathname == "/artisans" && (
          <NavItem
            title="Abonnements"
            path="/coming"
            onClick={() => setIsOpen(false)}
          />
        )} */}
      </div>

      {/* Bouton hamburger mobile */}
      {/*  <div className="flex md:hidden items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="p-2"
        >
          <svg
            className="w-6 h-6 text-dvianeutral-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              // X icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
 */}
      {/*       {/* Menu mobile slide depuis la gauche */}
      {/*   <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-[9999999] transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden pt-16 px-4`}
      >
        <NavItem
          title="Pour les clients"
          path="/"
          isActive={pathname === "/"}
          onClick={() => setIsOpen(false)}
        />
        <NavItem
          title="Pour les artisans"
          path="/artisans"
          isActive={pathname === "/artisans"}
          onClick={() => setIsOpen(false)}
        />
        {pathname !== "/artisans" && (
          <NavItem
            title="Tarifs"
            path="/pricing"
            isActive={pathname === "/pricing"}
            onClick={() => setIsOpen(false)}
          />
        )}

        {pathname == "/artisans" && (
          <NavItem
            title="Abonnements"
            path="/coming"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
 */}
      {/* Overlay semi-transparent */}
      {/* {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0  bg-opacity-20 z-[9999998] md:hidden"
        />
      )}  */}
    </nav>
  );
}
