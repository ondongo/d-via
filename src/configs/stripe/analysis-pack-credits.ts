/** Crédits crédités par price Stripe (metadata webhook / checkout). */
export const STRIPE_PRICE_ANALYSIS_CREDITS: Record<string, number> = {
  price_1TE7hRD2zF3CMgdYXgYVPf1U: 1,
  price_1TE7i5D2zF3CMgdYlGxZw2ZH: 3,
  price_1TE7ifD2zF3CMgdY7LRTW02J: 5,
  price_1TE7j0D2zF3CMgdY6MwtcDJX: 10,
};

export function creditsForStripePrice(priceId: string): number {
  return STRIPE_PRICE_ANALYSIS_CREDITS[priceId] ?? 0;
}
