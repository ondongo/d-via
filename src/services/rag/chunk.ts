/**************************************************************************************************************
 * Fonction pour découper le texte en chunks (A modifier en fonction de la structure d'un devis standard)
 **************************************************************************************************************/
/**
 * Découpe un texte en segments ("chunks") de longueur maximale définie (maxLen),
 * avec un chevauchement optionnel (overlap) entre chaque segment.
 * @param text     Le texte brut à diviser.
 * @param maxLen   La longueur maximale (en caractères) d'un chunk.
 * @param overlap  Le nombre de caractères de chevauchement désiré entre deux chunks.
 * @returns        Un tableau de chunks de texte.
 */
export function chunkText(text: string, maxLen = 500, overlap = 100): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let current: string[] = [];

    for (const w of words) {
        current.push(w);
        if (current.join(' ').length > maxLen) {
            chunks.push(current.join(' '));
            // Calcul du nombre approximatif de mots à conserver pour l'overlap
            // (on suppose que 1 mot ≈ 5 caractères pour estimer le nombre de mots à garder)
            const overlapWords = current.slice(-Math.floor(overlap / 5));
            current = [...overlapWords];
        }
    }

    if (current.length) {
        chunks.push(current.join(' '));
    }

    return chunks;
}