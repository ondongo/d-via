const {
    MISTRAL_API_KEY,
    MISTRAL_BASE_URL,
} = process.env;

const BASE_URL = MISTRAL_BASE_URL && MISTRAL_BASE_URL.endsWith('/v1') ? MISTRAL_BASE_URL : MISTRAL_BASE_URL ? `${MISTRAL_BASE_URL}/v1` : '';
/*****************************************************************
 * Client Mistral pour les chat completions
 *****************************************************************/
export const mistral = {
    chat: {
        completions: {
            create: async (params: {
                model?: string;
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
                            model: params.model ?? 'mistral-tiny',
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