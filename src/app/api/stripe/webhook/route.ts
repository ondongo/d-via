import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/configs/prisma/prisma";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET manquant");
    return NextResponse.json(
      { error: "Webhook non configuré" },
      { status: 500 },
    );
  }

  const body = await req.text();
  const headerList = await headers();
  const sig = headerList.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Signature absente" }, { status: 400 });
  }

  const { stripe } = await import("@/configs/stripe/stripe");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("Stripe webhook signature:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId =
        session.metadata?.userId || session.client_reference_id || "";
      const creditsRaw = session.metadata?.credits;
      const credits = creditsRaw ? parseInt(creditsRaw, 10) : 0;

      if (userId && Number.isFinite(credits) && credits > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { analysisCredits: { increment: credits } },
        });
      } else {
        console.warn(
          "checkout.session.completed sans userId/credits metadata",
          session.id,
        );
      }
    }
  } catch (e) {
    console.error("Stripe webhook handler:", e);
    return NextResponse.json({ error: "Traitement échoué" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
