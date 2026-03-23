/** Crédits crédités par price Stripe (metadata webhook / checkout). */
export const STRIPE_PRICE_ANALYSIS_CREDITS: Record<string, number> = {
  price_1SLe96D2zF3CMgdYupzJm7gF: 10,
  price_1SLe9ZD2zF3CMgdYsmFTrRFP: 30,
};

export function creditsForStripePrice(priceId: string): number {
  return STRIPE_PRICE_ANALYSIS_CREDITS[priceId] ?? 0;
}
