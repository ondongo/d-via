"use client";
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
      // Appeler l'API checkout qui gérera la création du client Stripe
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userEmail: session.user.email,
          userName: session.user.name || undefined,
          userId: session.user.id || "",
        }),
      });

      const { url, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }
      
      if (url) {
        window.location.href = url;
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
