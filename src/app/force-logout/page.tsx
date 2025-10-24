"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForceLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Déconnexion forcée et redirection
    signOut({ callbackUrl: "/" }).then(() => {
      // Vider le localStorage et sessionStorage
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Déconnexion en cours...</h1>
        <p className="text-gray-600">Veuillez patienter pendant que nous vous déconnectons.</p>
      </div>
    </div>
  );
}
