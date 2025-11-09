import { NextRequest, NextResponse } from "next/server";
import { createStripeCustomer } from "@/services/database/stripe-customer";


export async function POST(request: NextRequest) {
  try {
    const { priceId, userEmail, userName, userId } = await request.json();

    if (!priceId || !userEmail || !userId) {
      return NextResponse.json(
        { error: "priceId, userEmail et userId sont requis" },
        { status: 400 }
      );
    }

    const customer = await createStripeCustomer({
      email: userEmail,
      name: userName,
      userId: userId,
    });

  
    const { stripe } = await import("@/configs/stripe/stripe");

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.HOST_URL}/dashboard?success=true`,
      cancel_url: `${process.env.HOST_URL}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
