import { prisma } from "@/configs/prisma/prisma";
import { stripe } from "@/configs/stripe/stripe";

export interface CreateStripeCustomerParams {
  email: string;
  name?: string;
  userId: string;
}

export async function createStripeCustomer({
  email,
  name,
  userId,
}: CreateStripeCustomerParams) {
  try {
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: {
        userId: userId,
      },
    });

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { stripeCustomerId: customer.id },
    });

    console.log(
      `Client Stripe créé avec succès: ${customer.id} pour l'utilisateur ${userId}`
    );

    return customer;
  } catch (error) {
    console.error("Erreur lors de la création du client Stripe:", error);
    throw error;
  }
}

export async function getStripeCustomer(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user?.stripeCustomerId) {
      throw new Error("Aucun client Stripe trouvé pour cet utilisateur");
    }

    return await stripe.customers.retrieve(user.stripeCustomerId);
  } catch (error) {
    console.error("Erreur lors de la récupération du client Stripe:", error);
    throw error;
  }
}
