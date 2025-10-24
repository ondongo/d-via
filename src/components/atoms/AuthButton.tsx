"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthButtonProps {
  children: React.ReactNode;
  className?: string;
  redirectTo?: string;
}

export default function AuthButton({ 
  children, 
  className = "", 
  redirectTo = "/dashboard" 
}: AuthButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  const handleAuth = () => {
    if (status === "authenticated") {
      signOut();
    } else {
      signIn("google", { callbackUrl: redirectTo });
    }
  };

  return (
    <button
      onClick={handleAuth}
      className={className}
      disabled={status === "loading"}
    >
      {status === "loading" ? "Chargement..." : children}
    </button>
  );
}
