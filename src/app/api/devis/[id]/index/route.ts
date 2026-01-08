import { NextRequest, NextResponse } from 'next/server';
import { chunkText } from '@/services/rag/chunk';
import { embedTexts, pineconeIndex } from '@/services/rag/vector';

export const dynamic = 'force-dynamic';

function splitByChunkMarkers(text: string): string[] {
  // Découpe les sections commençant par CHUNKn: jusqu'au prochain CHUNKm: ou fin
  const regex = /(CHUNK\d+:)([\s\S]*?)(?=\n\nCHUNK\d+:|$)/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    const header = m[1].trim();
    const body = (m[2] ?? '').trim();
    const combined = `${header}\n${body}`.trim();
    if (combined.length > 0) out.push(combined);
  }
  return out;
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json().catch(() => ({}));
    const text: string | undefined = body?.text;
    const namespace: string | undefined = body?.namespace;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: "Le champ 'text' est requis et doit être une chaîne" },
        { status: 400 }
      );
    }

    const { id } = await ctx.params;

    // Découpage: si des marqueurs CHUNKn: sont présents, utiliser la regex; sinon fallback longueur
    const hasMarkers = /\bCHUNK\d+:/i.test(text);
    const chunks = (hasMarkers ? splitByChunkMarkers(text) : chunkText(text, 500, 100))
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: 'Aucun contenu détecté après découpage' },
        { status: 400 }
      );
    }

    // Créer les embeddings pour chaque chunk
    const embeddings = await embedTexts(chunks);

    // Vérifier la dimension des embeddings pour éviter les erreurs Pinecone
    const dim = embeddings[0]?.length ?? 0;
    if (!dim) {
      return NextResponse.json(
        { error: 'Aucune embedding générée' },
        { status: 500 }
      );
    }

    // Filtrer les embeddings nuls (toutes valeurs à 0)
    const isZeroVector = (v: number[]) => v.every((x) => x === 0);
    const nonZero = embeddings
      .map((values, idx) => ({ values, idx }))
      .filter(({ values }) => !isZeroVector(values));

    if (nonZero.length === 0) {
      return NextResponse.json(
        {
          error: 'Embeddings invalides',
          message:
            'Tous les embeddings générés sont nuls. Vérifiez la configuration du modèle Mistral et le contenu du texte.',
        },
        { status: 400 }
      );
    }

    // Construire les vecteurs pour Pinecone à partir des embeddings non nuls
    const vectors = nonZero.map(({ values, idx }) => {
      const raw = chunks[idx];
      const sectionMatch = raw.match(/^(CHUNK\d+:)/i);
      const section = sectionMatch ? sectionMatch[1].replace(':', '') : undefined;
      return {
        id: `${id}-chunk-${idx}`,
        values,
        metadata: {
          docId: id,
          index: idx,
          section,
          text: raw,
        },
      };
    });

    // Tentative d'upsert; si Pinecone renvoie dimension mismatch, message explicite
    try {
      const nsClient = pineconeIndex.namespace(namespace ?? 'devis');
      // @ts-ignore: Pinecone v3 accepte (records)
      await nsClient.upsert(vectors);
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      if (msg.includes('Vector dimension') && msg.includes('does not match')) {
        return NextResponse.json(
          {
            error: 'Dimension mismatch',
            message:
              'La dimension des embeddings (' + dim +
              ") ne correspond pas à celle de l'index Pinecone. Créez l'index avec la dimension " + dim +
              " ou utilisez un modèle d'embeddings avec la dimension attendue par l'index.",
          },
          { status: 400 }
        );
      }
      if (msg.includes('Dense vectors must contain at least one non-zero value')) {
        return NextResponse.json(
          {
            error: 'Vecteurs nuls',
            message:
              "Un ou plusieurs vecteurs sont entièrement nuls. Ils ont été filtrés, mais s'il en reste, vérifiez le modèle d'embeddings et le texte d'entrée.",
          },
          { status: 400 }
        );
      }
      throw e;
    }

    return NextResponse.json({
      success: true,
      id,
      chunks: chunks.length,
      upserted: vectors.length,
      namespace: namespace ?? 'devis',
      embeddingDim: dim,
    });
  } catch (err: any) {
    console.error('Error in /api/devis/[id]/index:', err);
    return NextResponse.json(
      { error: 'Erreur interne', message: err?.message },
      { status: 500 }
    );
  }
}
