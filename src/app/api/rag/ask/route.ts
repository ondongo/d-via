// src/app/api/rag/ask/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pineconeIndex, embedTexts, mistral } from '@/lib/vector';

type RagAskBody = {
    question: string;
    namespace?: string;
    topK?: number;
};

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as RagAskBody;
        const { question, namespace, topK = 5 } = body;

        if (!question || question.trim().length === 0) {
            return NextResponse.json({ error: 'question est requise' }, { status: 400 });
        }

        // 1. Embedding de la question
        const [queryEmbedding] = await embedTexts([question]);

        // 2. Recherche des chunks les plus pertinents
        const queryResponse = await pineconeIndex.query({
            // @ts-ignore
            namespace: namespace ?? 'default',
            topK,
            includeMetadata: true,
            includeValues: false,
            vector: queryEmbedding,
        });

        const matches = queryResponse.matches ?? [];

        const contexts = matches
            .map((m, idx) => {
                const metadata = (m.metadata || {}) as Record<string, unknown>;
                const text = (metadata.text as string) ?? '';
                return text ? `[CONTEXT ${idx + 1}] (score=${m.score?.toFixed(3)})\n${text}` : '';
            })
            .filter(Boolean)
            .join('\n\n');

        const systemPrompt =
            'Tu es un assistant spécialisé dans l’analyse de devis et de documents pour des artisans.';
        const userPrompt = `
Tu dois répondre uniquement à partir des CONTEXTES ci-dessous.
Si l'information n'est pas présente dans le contexte, dis clairement que tu ne sais pas.

CONTEXTE:
${contexts || '(Aucun contexte pertinent trouvé)'}

QUESTION:
${question}

Réponds en français, de manière structurée et claire.
Si possible, liste les éléments importants sous forme de puces (•).
`;

        // 3. Appel au modèle Mistral (LLM)
        const completion = await mistral.chat.completions.create({
            model: 'ministal 3b',
            temperature: 0.1,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        });

        const answer = completion.choices[0]?.message?.content ?? '';

        return NextResponse.json({
            answer,
            sources: matches.map((m) => ({
                id: m.id,
                score: m.score,
                metadata: m.metadata,
            })),
        });
    } catch (error) {
        console.error('RAG ask error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors de la génération RAG' },
            { status: 500 },
        );
    }
}