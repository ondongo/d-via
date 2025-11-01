"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthButtonProps {
  children: React.ReactNode;
  className?: string;
  redirectTo?: string;
}

export default function AuthButton({
  children,
  className = "",
  redirectTo = "/dashboard",
}: AuthButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  const handleAuth = () => {
    const isOnArtisanPage = pathname === "/artisans";
    if (isOnArtisanPage) {
      router.push("/signup");
    } else {
      if (status === "authenticated") {
        signOut({ callbackUrl: "/" });
      } else {
        // Forcer la déconnexion avant de se reconnecter pour éviter les conflits
        signOut({ redirect: false }).then(() => {
          signIn("google", { callbackUrl: redirectTo });
        });
      }
    }
  };

  if (status === "authenticated") {
    return null;
  }

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
