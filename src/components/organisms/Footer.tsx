import React from "react";
import Image from "next/image";
import { MdSend } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="flex flex-col md:flex-row items-center md:items-start justify-center p-8 border-t border-dvianeutral-50 mt-10 gap-10 md:gap-24">
      {/* Logo + description ou autre */}
      <div className="flex flex-col gap-4 max-w-xs items-center">
        <Image
          src="/logos/logo.png"
          alt="Logo"
          width={150}
          height={80}
          style={{ objectFit: "contain" }}
        />

        <div className="flex flex-col gap-2 items-cente">
          <p className="text-dvianeutralvariant-30 text-sm leading-relaxed">
            contact@d-via.com
          </p>

          <p className="text-dvianeutralvariant-30 text-sm leading-relaxed">
            +33 2 89 54 36 17
          </p>
        </div>

        <button
          className="relative px-3 py-3 rounded-full text-dvianeutral-10 flex items-center justify-center cursor-pointer overflow-hidden"
          aria-label="Envoyer"
        >
          <span className="absolute inset-0 bg-dvianeutral-10 opacity-10 rounded-full transition hover:opacity-30"></span>

          <FaInstagram className="h-4 w-4 relative z-10" />
        </button>

        <p className="text-dvianeutralvariant-30 text-sm leading-relaxed">
          © {new Date().getFullYear()} D-VIA. Tous droits réservés.
        </p>
      </div>

      <div className="flex flex-row gap-10 md:gap-24">
        {/* Colonne Société */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-[14px] md:text-[16px] text-dvianeutral-10 leading-headline-small tracking-headline-small mb-4">
            Société
          </p>
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50 transition text-sm"
          >
            À propos de nous
          </a>
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50 transition text-sm"
          >
            Carrières
          </a>
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50 transition text-sm"
          >
            Blog
          </a>
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50 transition text-sm"
          >
            Contactez-nous
          </a>{" "}
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50 transition text-sm"
          >
            Tarifs
          </a>{" "}
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50 transition text-sm"
          >
            Témoignages
          </a>
        </div>

        {/* Colonne Support */}
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-[14px] md:text-[16px] text-dvianeutral-10 leading-headline-small tracking-headline-small mb-4">
            Support
          </p>
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50 transition text-sm"
          >
            Centre d&apos;aide
          </a>
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50 transition text-sm"
          >
            Conditions d&apos;utilisation
          </a>
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50transition text-sm"
          >
            Mentions légales
          </a>
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50 transition text-sm"
          >
            Politique de confidentialité
          </a>
          <a
            href="#"
            className="text-dvianeutralvariant-30 hover:text-dvianeutralvariant-50 transition text-sm"
          >
            Statut
          </a>
        </div>
      </div>

      {/* Colonne Restez informés */}
      <div className="flex flex-col gap-4 max-w-sm">
        <p className="font-semibold text-[14px] md:text-[16px] text-dvianeutral-10 leading-headline-small tracking-headline-small mb-2">
          Restez informés
        </p>
        <form className="relative w-full max-w-sm">
          <input
            type="email"
            placeholder="Votre email"
            className="w-full pr-12 p-2 border border-dvianeutral-50 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-dviaprimary-40 text-dvianeutralvariant-30 placeholder:text-dvianeutralvariant-30 placeholder:text-sm text-sm"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-dviaprimary-40 hover:bg-dviaprimary-60 text-white flex items-center justify-center cursor-pointer"
            aria-label="Envoyer"
          >
            <MdSend className="h-4 w-4" />
          </button>
        </form>
      </div>
    </footer>
  );
}

export default Footer;
