// src/lib/vector.ts
import { Pinecone } from '@pinecone-database/pinecone';

const {
    PINECONE_API_KEY,
    PINECONE_INDEX_NAME,
    MISTRAL_API_KEY,
    MISTRAL_BASE_URL,
    MISTRAL_EMBED_MODEL,
} = process.env;

if (!PINECONE_API_KEY) throw new Error('Missing PINECONE_API_KEY');
if (!PINECONE_INDEX_NAME) throw new Error('Missing PINECONE_INDEX_NAME');
if (!MISTRAL_API_KEY) throw new Error('Missing MISTRAL_API_KEY');
if (!MISTRAL_BASE_URL) throw new Error('Missing MISTRAL_BASE_URL');

// Modèle d'embedding configurable; par défaut 'mistral-embed' (1024)
const EMBED_MODEL = MISTRAL_EMBED_MODEL || 'mistral-embed';
// S’assure que la baseURL inclut /v1
const BASE_URL = MISTRAL_BASE_URL.endsWith('/v1') ? MISTRAL_BASE_URL : `${MISTRAL_BASE_URL}/v1`;

export const pinecone = new Pinecone({
    apiKey: PINECONE_API_KEY,
});

export const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

// Encapsule l’embedding avec Mistral via fetch direct
export async function embedTexts(inputs: string[]): Promise<number[][]> {
    try {
        const res = await fetch(`${BASE_URL}/embeddings`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${MISTRAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ model: EMBED_MODEL, input: inputs }),
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`status=${res.status} body=${text || 'empty'}`);
        }
        const json = await res.json();
        // Mistral renvoie { data: [{ embedding: number[] }, ...] }
        return (json?.data ?? []).map((d: any) => d.embedding as number[]);
    } catch (err: any) {
        const message = err?.message ?? String(err);
        throw new Error(`Mistral embeddings error: ${message}. baseURL=${BASE_URL}, model=${EMBED_MODEL}`);
    }
}

// Client Mistral pour les chat completions
export const mistral = {
    chat: {
        completions: {
            create: async (params: {
                model: string;
                temperature?: number;
                messages: Array<{ role: string; content: string }>;
            }) => {
                try {
                    const res = await fetch(`${BASE_URL}/chat/completions`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${MISTRAL_API_KEY}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: params.model,
                            temperature: params.temperature ?? 0.7,
                            messages: params.messages,
                        }),
                    });
                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`status=${res.status} body=${text || 'empty'}`);
                    }
                    const json = await res.json();
                    return json;
                } catch (err: any) {
                    const message = err?.message ?? String(err);
                    throw new Error(`Mistral chat completions error: ${message}. baseURL=${BASE_URL}`);
                }
            },
        },
    },
};