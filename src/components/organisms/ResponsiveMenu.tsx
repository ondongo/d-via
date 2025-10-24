"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { NavItem } from "./NavItem";

export default function ResponsiveMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Menu desktop */}
      <div className="hidden md:flex flex-row gap-2 justify-center items-center">
        <NavItem
          title="Vous êtes un particulier"
          path="/"
          isActive={pathname === "/"}
        />
        <NavItem
          title="Vous êtes un artisan"
          path="/artisans"
          isActive={pathname === "/artisans"}
        />

        <NavItem
          title="Blog"
          path="/blog"
          isActive={pathname === "/blog"}
        />

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
      <div className="flex md:hidden items-center">
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

      {/* Menu mobile slide depuis la gauche */}
      <div
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

      {/* Overlay semi-transparent */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0  bg-opacity-20 z-[9999998] md:hidden"
        />
      )}
    </nav>
  );
}
