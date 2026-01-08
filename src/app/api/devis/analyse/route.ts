import { NextRequest, NextResponse } from 'next/server';
import { computeCredibility, extractAll, ExtractedDevis } from '@/lib/devisCredibility';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text: string | undefined = body?.text;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Le champ 'text' est requis" }, { status: 400 });
    }

    const extracted: ExtractedDevis = extractAll(text);
    const credibility = computeCredibility(extracted);

    return NextResponse.json({ ...extracted, credibility });
  } catch (err: any) {
    console.error('Error in /api/devis/analyse:', err);
    return NextResponse.json({ error: 'Erreur interne', message: err?.message }, { status: 500 });
  }
}

