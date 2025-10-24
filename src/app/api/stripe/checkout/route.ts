import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/configs/stripe/stripe";

export async function POST(request: NextRequest) {
  try {
    const { priceId, customerId } = await request.json();

    if (!priceId || !customerId) {
      return NextResponse.json(
        { error: "priceId et customerId sont requis" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
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
