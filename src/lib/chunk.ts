/**************************************************************************************************************
 * Fonction pour découper le texte en chunks (A modifier en fonction de la structure d'un devis standard)
 **************************************************************************************************************/
export function chunkText(text: string, maxLen = 500, overlap = 100): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let current: string[] = [];

    for (const w of words) {
        current.push(w);
        if (current.join(' ').length > maxLen) {
            chunks.push(current.join(' '));
            const overlapWords = current.slice(-Math.floor(overlap / 5));
            current = [...overlapWords];
        }
    }

    if (current.length) {
        chunks.push(current.join(' '));
    }

    return chunks;
}