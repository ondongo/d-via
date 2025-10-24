import { useSession } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    userId: session?.user?.id,
    isAuthenticated: !!session,
    isLoading: status === "loading",
  };
};
