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
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;
      const amountTotal = typeof session.amount_total === "number" ? session.amount_total : 0;
      const currency = (session.currency || "eur").toUpperCase();

      if (userId && Number.isFinite(credits) && credits > 0) {
        await prisma.$transaction(async (tx) => {
          // Idempotence: Stripe peut relivrer le même événement.
          const existing = await tx.payment.findUnique({
            where: { stripeSessionId: session.id },
            select: { id: true },
          });

          if (!existing) {
            await tx.payment.create({
              data: {
                userId,
                stripeSessionId: session.id,
                stripeEventId: event.id,
                stripePaymentIntentId: paymentIntentId || undefined,
                amount: amountTotal,
                currency,
                status: "SUCCEEDED",
                creditsAdded: credits,
                paidAt: new Date(),
                metadata: session.metadata || undefined,
              },
            });
            await tx.user.update({
              where: { id: userId },
              data: { analysisCredits: { increment: credits } },
            });
          } else {
            await tx.payment.update({
              where: { stripeSessionId: session.id },
              data: {
                stripeEventId: event.id,
                stripePaymentIntentId: paymentIntentId || undefined,
                amount: amountTotal,
                currency,
                status: "SUCCEEDED",
                paidAt: new Date(),
                metadata: session.metadata || undefined,
              },
            });
          }
        });
      } else if (userId) {
        // On garde une trace paiement même si metadata credits manque.
        await prisma.payment.upsert({
          where: { stripeSessionId: session.id },
          update: {
            stripeEventId: event.id,
            stripePaymentIntentId: paymentIntentId || undefined,
            amount: amountTotal,
            currency,
            status: "SUCCEEDED",
            paidAt: new Date(),
            metadata: session.metadata || undefined,
          },
          create: {
            userId,
            stripeSessionId: session.id,
            stripeEventId: event.id,
            stripePaymentIntentId: paymentIntentId || undefined,
            amount: amountTotal,
            currency,
            status: "SUCCEEDED",
            paidAt: new Date(),
            metadata: session.metadata || undefined,
          },
        });
      } else {
        console.warn(
          "checkout.session.completed sans userId exploitable",
          session.id,
        );
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await prisma.payment.updateMany({
        where: { stripeSessionId: session.id },
        data: { status: "CANCELED" },
      });
    } else if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const userId =
        typeof intent.metadata?.userId === "string" ? intent.metadata.userId : "";
      if (userId) {
        await prisma.payment.upsert({
          where: {
            stripeSessionId: `pi_${intent.id}`,
          },
          update: {
            stripePaymentIntentId: intent.id,
            stripeEventId: event.id,
            amount: intent.amount,
            currency: (intent.currency || "eur").toUpperCase(),
            status: "FAILED",
            metadata: intent.metadata || undefined,
          },
          create: {
              userId,
            stripeSessionId: `pi_${intent.id}`,
            stripePaymentIntentId: intent.id,
            stripeEventId: event.id,
            amount: intent.amount,
            currency: (intent.currency || "eur").toUpperCase(),
            status: "FAILED",
            metadata: intent.metadata || undefined,
          },
        });
      }
    }
  } catch (e) {
    console.error("Stripe webhook handler:", e);
    return NextResponse.json({ error: "Traitement échoué" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
