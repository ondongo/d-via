const MAX_REACTIONS_PER_SESSION = 50;
export { MAX_REACTIONS_PER_SESSION };

export function prompt(text: string) {
  return `
Vous devez analyser un devis selon les critères suivants et fournir un pourcentage de fiabilité global sur 100, ainsi que des remarques claires et concises pour chaque critère. Vous devez également ajouter une conclusion concise résumant la qualité globale du devis. Votre réponse doit être structurée strictement comme suit :

Critères d'analyse et instructions :
1. **Identité de l'artisan** : Vérifiez si le nom de l'artisan ou de l'entreprise est clairement mentionné.
2. **Numéro de SIRET** : Vérifiez si le numéro de SIRET ou une preuve de l'existence de l'entreprise est mentionnée.
3. **Tarif par rapport aux tendances du marché** : Vérifiez si le tarif semble cohérent avec les standards du marché pour ce type de travail.
4. **Cohérence du devis** : Vérifiez si le devis contient des informations claires, bien organisées et compréhensibles.
5. **Respect des normes légales** : Vérifiez si les mentions légales obligatoires sont présentes (par exemple : conditions générales, taxes, délais).
6. **Estimation du délai de livraison** : Vérifiez si le délai proposé est réaliste et adapté aux travaux décrits.
7. **Garanties et assurances** : Vérifiez si les garanties (décennale, responsabilité civile, etc.) sont mentionnées.

**Format de réponse attendu :**
Fiabilité globale : [Pourcentage basé sur les critères respectés]
Détails :
- Identité de l'artisan : [Statut - Exemple : "Présente", "Non mentionnée"]
- Numéro de SIRET : [Statut - Exemple : "Mentionné", "Non mentionné"]
- Tarif par rapport aux tendances du marché : [Statut - Exemple : "Cohérent avec le marché", "Trop élevé"]
- Cohérence du devis : [Statut - Exemple : "Cohérent", "Manque de clarté"]
- Respect des normes légales : [Statut - Exemple : "Conforme", "Certaines normes manquent"]
- Estimation du délai de livraison : [Statut - Exemple : "Réaliste", "Délais trop courts"]
- Garanties et assurances : [Statut - Exemple : "Mentionnées", "Non mentionnées"]

**Conclusion :**
Ajoutez une conclusion concise résumant la qualité globale du devis, par exemple : 
- "Le devis est fiable et bien structuré, avec des informations complètes."
- "Le devis présente des lacunes importantes, notamment sur les garanties et les normes légales."

**ça ne semble pas être un devis :**
Indiquez clairement que le texte ne correspond pas aux critères d'un devis standard et fournissez des recommandations pour aider l'utilisateur à améliorer ou vérifier son document.

**Texte à analyser :**
${text}

**Important :** Répondez uniquement dans le format demandé. Ne donnez pas d'explications supplémentaires ou d'interprétations inutiles.
`;
}
