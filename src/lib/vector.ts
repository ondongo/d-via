import { Pinecone } from '@pinecone-database/pinecone';

const {
    PINECONE_API_KEY,
    PINECONE_INDEX_NAME,
    MISTRAL_API_KEY,
    MISTRAL_BASE_URL,
    MISTRAL_EMBED_MODEL,
} = process.env;

/************************************************************************************
 * Modèle d'embedding (Sert Transformer le texte en vecteurs mathématiques)
 ************************************************************************************/
const EMBED_MODEL = MISTRAL_EMBED_MODEL || 'mistral-embed';
//text-embedding-3-small"

const BASE_URL = MISTRAL_BASE_URL && MISTRAL_BASE_URL.endsWith('/v1') ? MISTRAL_BASE_URL : MISTRAL_BASE_URL ? `${MISTRAL_BASE_URL}/v1` : '';

/************************************************************************************
 * Pinecone (Sert à stocker les vecteurs mathématiques dans une bd spécialisée)
 ************************************************************************************/
export const pinecone = PINECONE_API_KEY ? new Pinecone({
    apiKey: PINECONE_API_KEY,
}) : null;

export const pineconeIndex = pinecone && PINECONE_INDEX_NAME ? pinecone.Index(PINECONE_INDEX_NAME) : null;


/************************************************************************************
 * Fonction pour transformer le texte en vecteurs mathématiques
 ************************************************************************************/
export async function embedTexts(inputs: string[]): Promise<number[][]> {
    if (!MISTRAL_API_KEY || !BASE_URL) {
        throw new Error('Missing MISTRAL_API_KEY or MISTRAL_BASE_URL');
    }
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
                if (!MISTRAL_API_KEY || !BASE_URL) {
                    throw new Error('Missing MISTRAL_API_KEY or MISTRAL_BASE_URL');
                }
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