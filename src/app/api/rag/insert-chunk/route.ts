/*****************************************************************************************************************
 * ROUTE : /api/rag/insert-chunk
 * 
 * Indexe un texte brut dans Pinecone (découpage automatique en chunks + embeddings)
 * 
 * PARAMÈTRES :
 * - text (string, requis) : Texte à indexer
 * - namespace (string, optionnel) : Namespace Pinecone (défaut: "default")
 * - metadata (object, optionnel) : Métadonnées pour tous les chunks
 * - maxLen (number, optionnel) : Longueur max chunk (défaut: 500)
 * - overlap (number, optionnel) : Chevauchement entre chunks (défaut: 100)
 * 
 * RETOUR :
 * { success: true, count: number, chunks: number, namespace: string, embeddingDim: number }
 * ou { error: string, message?: string }
 *****************************************************************************************************************/
import { NextRequest, NextResponse } from 'next/server';
import { embedTexts } from '@/services/rag/vector';
import { pineconeIndex } from '@/services/rag/pinecone';
import { chunkText } from '@/services/rag/chunk';

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as {
            text: string;
            namespace?: string;
            metadata?: Record<string, string | number | boolean | null>;
            maxLen?: number;
            overlap?: number;
        };

        const { text, namespace, metadata, maxLen = 500, overlap = 100 } = body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json(
                { error: 'text est requis et doit être une chaîne non vide' },
                { status: 400 },
            );
        }

        /*****************************************************************************************************************
         * 1. Découper le texte en chunks
         *****************************************************************************************************************/
        const chunks = chunkText(text, maxLen, overlap)
            .map((c) => c.trim())
            .filter((c) => c.length > 0);

        if (chunks.length === 0) {
            return NextResponse.json(
                { error: 'Aucun contenu détecté après découpage' },
                { status: 400 },
            );
        }

        /*****************************************************************************************************************
         * 2. Créer les embeddings pour chaque chunk
         *****************************************************************************************************************/
        const embeddings = await embedTexts(chunks);

        // Vérifier la dimension des embeddings
        const dim = embeddings[0]?.length ?? 0;
        if (!dim) {
            return NextResponse.json(
                { error: 'Aucune embedding générée' },
                { status: 500 },
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
                { status: 400 },
            );
        }

        /*****************************************************************************************************************
         * 3. Construire les vecteurs pour Pinecone
         *****************************************************************************************************************/
        const vectors = nonZero.map(({ values, idx }) => ({
            id: `chunk-${Date.now()}-${idx}`,
            values,
            metadata: {
                text: chunks[idx],
                ...(metadata ?? {}),
            },
        }));

        /*****************************************************************************************************************
         * 4. Upsert des chunks dans Pinecone
         *****************************************************************************************************************/
        try {
            // @ts-ignore
            await pineconeIndex.upsert({ vectors, namespace: namespace ?? 'default' });
        } catch (e: any) {
            const msg: string = e?.message ?? '';
            if (msg.includes('Vector dimension') && msg.includes('does not match')) {
                return NextResponse.json(
                    {
                        error: 'Dimension mismatch',
                        message:
                            'La dimension des embeddings (' +
                            dim +
                            ") ne correspond pas à celle de l'index Pinecone. Créez l'index avec la dimension " +
                            dim +
                            " ou utilisez un modèle d'embeddings avec la dimension attendue par l'index.",
                    },
                    { status: 400 },
                );
            }
            if (msg.includes('Dense vectors must contain at least one non-zero value')) {
                return NextResponse.json(
                    {
                        error: 'Vecteurs nuls',
                        message:
                            "Un ou plusieurs vecteurs sont entièrement nuls. Ils ont été filtrés, mais s'il en reste, vérifiez le modèle d'embeddings et le texte d'entrée.",
                    },
                    { status: 400 },
                );
            }
            throw e;
        }

        return NextResponse.json({
            success: true,
            count: vectors.length,
            chunks: chunks.length,
            namespace: namespace ?? 'default',
            embeddingDim: dim,
        });
    } catch (error) {
        console.error('RAG index error:', error);
        return NextResponse.json(
            { error: "Erreur serveur lors de l'indexation" },
            { status: 500 },
        );
    }
}