"use client";

import { useSignupStore } from "@/stores/signupStore";
import { LoadingModal } from "@/components/atoms/ui/modals/LoadingModal";

export default function SignupLoadingModal() {
  const isCreatingAccount = useSignupStore((state) => state.isCreatingAccount);

  return (
    <LoadingModal
      isOpen={isCreatingAccount}
      title="Inscription en cours..."
      message="Nous créons votre compte artisan et configurons votre profil. Cela ne prendra que quelques instants."
    />
  );
}

