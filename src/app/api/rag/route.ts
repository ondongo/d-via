/*****************************************************************************************************************
 * Fonction pour indexer les chunks , faire l'embedding et stocker les vecteurs mathématiques dans Pinecone
 * A modifier (Les chhucks sont pas bien découpés)
 * Modifier le nom de la route api en route d'insertion de chunks dans Pinecone
 *****************************************************************************************************************/
import { NextRequest, NextResponse } from 'next/server';
import { pineconeIndex, embedTexts } from '@/services/rag/vector';

type ChunkInput = {
    id?: string;
    text: string;
    metadata?: Record<string, string | number | boolean | null>;
};

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as {
            chunks: ChunkInput[];
            namespace?: string;
        };

        const { chunks, namespace } = body;
        if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
            return NextResponse.json(
                { error: 'chunks est requis et doit être un tableau non vide' },
                { status: 400 },
            );
        }

        const texts = chunks.map((c) => c.text);
        const embeddings = await embedTexts(texts);

        const vectors = embeddings.map((vector, idx) => ({
            id: chunks[idx].id ?? `chunk-${Date.now()}-${idx}`,
            values: vector,
            metadata: {
                text: chunks[idx].text,
                ...(chunks[idx].metadata ?? {}),
            },
        }));

        // Signature upsert qui attend un seul argument objet
        // @ts-ignore
        await pineconeIndex.upsert({ vectors, namespace: namespace ?? 'default' });

        return NextResponse.json({ success: true, count: vectors.length });
    } catch (error) {
        console.error('RAG index error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors de l’indexation' },
            { status: 500 },
        );
    }
}