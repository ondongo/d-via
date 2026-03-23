"use client";

import { createStripeCheckoutSession } from "@/actions/stripe-checkout";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface StripeCheckoutButtonProps {
  priceId: string;
  children: React.ReactNode;
  className?: string;
}

export default function StripeCheckoutButton({ 
  priceId, 
  children, 
  className = "" 
}: StripeCheckoutButtonProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!session?.user?.email) {
      alert("Veuillez vous connecter pour effectuer un achat");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createStripeCheckoutSession(priceId);
      if (result.ok === false) {
        throw new Error(result.error);
      }
      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error("Erreur lors de la création de la session de paiement");
      }
    } catch (error) {
      console.error("Erreur lors du checkout:", error);
      alert("Erreur lors du traitement du paiement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className={className}
      disabled={isLoading || !session}
    >
      {isLoading ? "Traitement..." : children}
    </button>
  );
}
