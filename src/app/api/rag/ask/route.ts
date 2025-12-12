// src/app/api/rag/ask/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pineconeIndex, embedTexts, mistral } from '@/lib/vector';

type RagAskBody = {
    question: string;
    namespace?: string;
    topK?: number;
    docId?: string; // <- nouveau: identifiant du devis à cibler
};

const MIN_CONTEXT_CHARS = 120;
const MIN_SCORE = 0.15;

export async function POST(req: NextRequest) {
    try {
        let body: RagAskBody;
        try {
            body = (await req.json()) as RagAskBody;
        } catch {
            return NextResponse.json({ error: 'Body JSON invalide' }, { status: 400 });
        }
        const { question, namespace, topK = 5, docId } = body;

        if (!question || question.trim().length === 0) {
            return NextResponse.json({ error: 'question est requise' }, { status: 400 });
        }

        // 1. Embedding de la question
        const [queryEmbedding] = await embedTexts([question]);

        // 2. Recherche des chunks les plus pertinents, limité au docId si fourni
        const ns = pineconeIndex.namespace(namespace ?? 'devis');
        const queryResponse = await ns.query({
            topK,
            includeMetadata: true,
            includeValues: false,
            vector: queryEmbedding,
            filter: docId ? { docId: { $eq: docId } } : undefined,
        } as any);

        const rawMatches = queryResponse.matches ?? [];

        // Nettoyage + tri: on garde les chunks avec un score suffisant
        const matches = rawMatches
            .filter((m) => typeof m.score === 'number' && (m.score as number) >= MIN_SCORE)
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

        // Shortcut: si la question cible explicitement un chunk (ex: "CHUNK2"), on renvoie directement son texte
        const chunkRefMatch = question.match(/\bCHUNK\s*(\d+)\b/i);
        if (chunkRefMatch) {
            const chunkLabel = `CHUNK${chunkRefMatch[1]}`.toUpperCase();
            const direct = matches.find((m) => {
                const md = (m.metadata || {}) as Record<string, unknown>;
                return String(md.section ?? '').toUpperCase() === chunkLabel;
            });

            if (direct) {
                const md = (direct.metadata || {}) as Record<string, unknown>;
                const text = String(md.text ?? '').trim();
                return NextResponse.json({
                    answer: text || 'Information insuffisante dans le document.',
                    sources: [
                        {
                            id: direct.id,
                            score: direct.score,
                            metadata: direct.metadata,
                        },
                    ],
                    usedTopK: 1,
                    contextCharCount: text.replace(/\s+/g, ' ').length,
                    minScoreApplied: MIN_SCORE,
                    directChunk: chunkLabel,
                });
            }
        }

        const contexts = matches
            .map((m, idx) => {
                const metadata = (m.metadata || {}) as Record<string, unknown>;
                const text = (metadata.text as string) ?? '';
                const section = (metadata.section as string) ?? '';
                const chunkIndex = (metadata.index as number | string | undefined) ?? '';
                const score = typeof m.score === 'number' ? m.score.toFixed(3) : 'n/a';

                if (!text) return '';

                return [
                    `[CONTEXT ${idx + 1}] id=${m.id} score=${score} section=${section} index=${chunkIndex}`,
                    text,
                ].join('\n');
            })
            .filter(Boolean)
            .join('\n\n');

        const totalContextChars = contexts.replace(/\s+/g, ' ').trim().length;

        const systemPrompt =
            "Tu es un assistant d'analyse de devis. Tu dois répondre STRICTEMENT à partir du CONTEXTE fourni. Interdiction d'inventer, de supposer ou de compléter. Si le CONTEXTE ne contient pas l'information demandée, réponds exactement: \"Information insuffisante dans le document.\". Quand tu affirmes quelque chose, décris les chunks utilisés sous la forme [id=...].";
        const userPrompt = `
RÈGLES IMPORTANTES:
- Tu réponds UNIQUEMENT avec des informations présentes dans CONTEXTE.
- Si tu ne peux pas répondre à partir du CONTEXTE: réponds EXACTEMENT et UNIQUEMENT la phrase suivante (sans rien ajouter): Information insuffisante dans le document.
- N'invente rien. Ne fais aucune supposition.
- Si tu réponds, termine par UNE SEULE ligne: SOURCES: [id=...], [id=...]. Ne mets rien après cette ligne.

CONTEXTE:
${contexts || '(Aucun contexte pertinent trouvé)'}

QUESTION:
${question}

FORMAT DE RÉPONSE (si possible):
- Réponse en 1-4 phrases max.
- Puis 3 puces maximum (•) uniquement si c'est dans le contexte.
`;

        // Si aucun contexte (ou contexte trop pauvre), répondre court et éviter un appel LLM inutile
        if (!contexts || totalContextChars < MIN_CONTEXT_CHARS) {
            return NextResponse.json({
                answer: 'Information insuffisante dans le document.',
                sources: [],
                usedTopK: 0,
                debug: {
                    hadMatches: matches.length,
                    totalContextChars,
                },
            });
        }

        // 3. Appel au modèle Mistral (LLM)
        const completion = await mistral.chat.completions.create({
            model: 'ministral-3b-latest',
            temperature: 0.1,
            // @ts-ignore
            max_tokens: 350,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        });

        const answer = completion.choices[0]?.message?.content ?? '';

        let finalAnswer = (answer || '').trim() || 'Information insuffisante dans le document.';

        // Sanitize: si le modèle commence par "Information insuffisante...", on force la phrase EXACTE (sans ajout)
        if (/^Information insuffisante dans le document\./i.test(finalAnswer)) {
            finalAnswer = 'Information insuffisante dans le document.';
        }

        return NextResponse.json({
            answer: finalAnswer,
            sources: matches.map((m) => ({
                id: m.id,
                score: m.score,
                metadata: m.metadata,
            })),
            usedTopK: matches.length,
            contextCharCount: totalContextChars,
            minScoreApplied: MIN_SCORE,
        });
    } catch (error) {
        console.error('RAG ask error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur lors de la génération RAG' },
            { status: 500 },
        );
    }
}