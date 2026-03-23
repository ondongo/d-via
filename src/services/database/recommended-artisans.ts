"use server";

import type { Artisan } from "@prisma/client";
import { prisma } from "@/configs/prisma/prisma";

export type RecommendedArtisanCard = {
  id: string;
  initiale: string;
  nom: string;
  specialite: string;
  note: number;
  avis: number;
  verifie: boolean;
  localisation: string;
  distance: string;
  disponibilite: string;
  certifications: string[];
};

function mapArtisanToCard(a: Artisan): RecommendedArtisanCard {
  const nom =
    a.companyName?.trim() ||
    `${a.firstName} ${a.lastName}`.trim() ||
    "Artisan";
  const spec =
    a.profession?.trim() ||
    a.category?.trim() ||
    a.services?.trim()?.slice(0, 80) ||
    "—";
  const certs =
    a.certifications.length > 0
      ? a.certifications
      : (a.specialties
          ?.split(/[,;]/)
          .map((s) => s.trim())
          .filter(Boolean) ?? []
        ).slice(0, 4);

  return {
    id: a.id,
    initiale: nom.charAt(0).toUpperCase(),
    nom,
    specialite: spec,
    note: a.rating ?? 0,
    avis: a.reviews ?? 0,
    verifie: a.verified,
    localisation: a.location || a.address || "—",
    distance:
      a.distance != null && !Number.isNaN(a.distance)
        ? `${Math.round(a.distance)} km`
        : "—",
    disponibilite: a.availability || "—",
    certifications: certs,
  };
}

/** Les 1 à 5 meilleurs artisans (tri note / avis), filtre métier côté UI. */
export async function getTopRecommendedArtisans(
  limit = 5,
): Promise<RecommendedArtisanCard[]> {
  const take = Math.min(Math.max(limit, 1), 5);
  const rows = await prisma.artisan.findMany({
    orderBy: [
      { verified: "desc" },
      { rating: "desc" },
      { reviews: "desc" },
    ],
    take,
  });
  return rows.map(mapArtisanToCard);
}
