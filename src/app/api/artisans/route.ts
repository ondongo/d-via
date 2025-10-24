import { NextRequest } from 'next/server';
import { prisma } from '@/configs/prisma/prisma';

// GET /api/artisans?search=&category=&verified=true&minRating=4.7&maxDistance=5
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category') || '';
    const verified = searchParams.get('verified');
    const minRatingStr = searchParams.get('minRating');
    const maxDistanceStr = searchParams.get('maxDistance');

    const minRating = minRatingStr ? parseFloat(minRatingStr) : undefined;
    const maxDistance = maxDistanceStr ? parseFloat(maxDistanceStr) : undefined;

    const where: any = {};

    if (verified === 'true') {
      where.verified = true;
    }
    if (minRating !== undefined && !Number.isNaN(minRating)) {
      where.rating = { gte: minRating };
    }
    if (maxDistance !== undefined && !Number.isNaN(maxDistance)) {
      where.distance = { lte: maxDistance };
    }
    if (category && category !== 'Tous les métiers') {
      where.category = category;
    }
    if (search) {
      // Recherche basique sur location, profession, category
      where.OR = [
        { location: { contains: search, mode: 'insensitive' } },
        { profession: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }

    const artisans = await prisma.artisan.findMany({
      where,
      orderBy: { rating: 'desc' }
    });

    return new Response(JSON.stringify({ artisans }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500 });
  }
}

