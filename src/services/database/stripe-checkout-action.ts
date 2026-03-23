"use server";

import { auth } from "@/configs/prisma/auth";
import { creditsForStripePrice } from "@/configs/stripe/analysis-pack-credits";
import { createStripeCustomer } from "@/services/database/stripe-customer";

export type CreateStripeCheckoutResult =
  | { ok: true; url: string | null }
  | { ok: false; error: string };

export async function createStripeCheckoutSession(
  priceId: string,
): Promise<CreateStripeCheckoutResult> {
  try {
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return { ok: false, error: "Connexion requise" };
    }

    const credits = creditsForStripePrice(priceId);
    if (credits <= 0) {
      return { ok: false, error: "Pack de crédits inconnu pour ce tarif" };
    }

    const userId = session.user.id;
    const customer = await createStripeCustomer({
      email: session.user.email,
      name: session.user.name || undefined,
      userId,
    });

    const { stripe } = await import("@/configs/stripe/stripe");

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      client_reference_id: userId,
      metadata: {
        userId,
        credits: String(credits),
      },
      success_url: `${process.env.HOST_URL}/dashboard/success`,
      cancel_url: `${process.env.HOST_URL}/pricing?canceled=true`,
    });

    return { ok: true, url: checkoutSession.url };
  } catch (e) {
    console.error("createStripeCheckoutSession", e);
    return { ok: false, error: "Erreur interne du serveur" };
  }
}
