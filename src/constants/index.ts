const MAX_REACTIONS_PER_SESSION = 50;
export { MAX_REACTIONS_PER_SESSION };

export function prompt(
  text: string,
  contexts?: string,
  siretInfo?: {
    siret?: string;
    isValid?: boolean;
    nomEntreprise?: string;
    dateCreation?: string;
    adresse?: string;
  }
) {
  let siretSection = "";
  if (siretInfo) {
    if (siretInfo.siret) {
      if (siretInfo.isValid && siretInfo.nomEntreprise) {
        siretSection = `
**Vérification SIRET effectuée :**
- SIRET : ${siretInfo.siret}
- Statut : VALIDÉ - Entreprise trouvée dans le répertoire Sirene
- Nom de l'entreprise : ${siretInfo.nomEntreprise}
${siretInfo.dateCreation ? `- Date de création : ${siretInfo.dateCreation}` : ""}
${siretInfo.adresse ? `- Adresse : ${siretInfo.adresse}` : ""}

**Important :** Le SIRET a été vérifié via l'API Sirene officielle. Utilisez cette information pour évaluer la fiabilité du devis.`;
      } else {
        siretSection = `
**Vérification SIRET effectuée :**
- SIRET : ${siretInfo.siret}
- Statut : INVALIDE ou INTROUVABLE dans le répertoire Sirene

**Attention :** Ce SIRET n'existe pas ou n'est pas valide dans le répertoire officiel. Cela constitue un signal d'alerte important pour la fiabilité du devis.`;
      }
    } else {
      siretSection = `
**Vérification SIRET :**
- Aucun SIRET trouvé dans le devis

**Attention :** L'absence de SIRET est un point négatif important pour la fiabilité du devis.`;
    }
  }

  let contextsSection = "";
  if (contexts && contexts.trim().length > 0) {
    contextsSection = `
**Contextes de référence (devis similaires provenant de la base de données) :**
${contexts}

**Instructions pour utiliser les contextes :**
- Comparez les tarifs du devis analysé avec ceux des devis similaires ci-dessus
- Vérifiez si la structure et les informations du devis analysé sont cohérentes avec les devis de référence
- Utilisez les scores de similarité (entre parenthèses) pour pondérer l'importance de chaque contexte
- Si les tarifs sont significativement différents (plus de 30% d'écart), signalez-le dans votre analyse
- Si la structure diffère beaucoup des devis de référence, mentionnez-le dans la cohérence du devis`;
  }

  return `
# INSTRUCTIONS D'ANALYSE DE DEVIS - EXPERT ARTISANAT

Vous êtes un expert certifié en analyse de devis pour artisans, avec une connaissance approfondie :
- Des normes légales françaises applicables aux devis (Code de la consommation, Code civil)
- Des standards du marché de l'artisanat en France
- Des bonnes pratiques professionnelles du secteur
- Des techniques de détection de fraudes et d'arnaques

Votre mission est d'analyser un devis de manière exhaustive et de fournir une évaluation de fiabilité précise et justifiée.

---

## CONTEXTE : QU'EST-CE QU'UN DEVIS FIABLE ?

Un devis fiable doit contenir :
1. **Identification complète** : Nom, raison sociale, coordonnées complètes de l'entreprise
2. **Légalité** : SIRET valide, mentions légales obligatoires, conformité réglementaire
3. **Transparence** : Détail des prestations, tarifs clairs, calculs vérifiables
4. **Professionnalisme** : Structure cohérente, informations complètes, garanties mentionnées
5. **Réalisme** : Tarifs cohérents avec le marché, délais réalistes, prestations adaptées

---

## CRITÈRES D'ANALYSE DÉTAILLÉS

### 1. IDENTITÉ DE L'ARTISAN / ENTREPRISE

**Éléments à vérifier :**
- Présence du nom complet de l'entreprise ou de l'artisan
- Raison sociale complète (ex: "SARL", "SAS", "EURL", "Auto-entrepreneur")
- Coordonnées complètes : adresse postale, téléphone, email
- Correspondance entre le nom mentionné et le nom vérifié via le SIRET (si disponible)
- Présence d'un logo ou en-tête professionnel (bon signe)

**Points d'alerte :**
- Nom absent ou incomplet
- Nom différent de celui enregistré au SIRET
- Coordonnées manquantes ou incomplètes
- Utilisation d'un nom générique ou suspect

**Scoring :**
- Présent et correspond au SIRET vérifié : +15 points
- Présent mais ne correspond pas au SIRET : -10 points
- Présent mais SIRET non vérifiable : +5 points
- Absent : -15 points

---

### 2. NUMÉRO DE SIRET

**Éléments à vérifier :**
- Présence d'un numéro SIRET (14 chiffres)
- Format correct du SIRET
- Correspondance avec les informations vérifiées via l'API Sirene
- Cohérence entre le nom de l'entreprise et le SIRET

**Points d'alerte CRITIQUES :**
- SIRET absent : Signal d'alerte majeur
- SIRET invalide ou introuvable : Risque de fraude élevé
- SIRET ne correspondant pas à l'entreprise : Possible usurpation d'identité

**Scoring :**
- SIRET présent, validé et correspondant : +20 points
- SIRET présent mais invalide : -25 points (impact majeur)
- SIRET absent : -20 points (impact majeur)

${siretSection}

---

### 3. TARIF PAR RAPPORT AUX TENDANCES DU MARCHÉ

**Méthodologie d'analyse :**

a) **Extraction des montants :**
   - Identifier le montant total TTC
   - Identifier le montant HT
   - Identifier le montant de la TVA
   - Vérifier la cohérence : TTC = HT + TVA

b) **Analyse de la structure tarifaire :**
   - Présence d'un détail ligne par ligne des prestations
   - Prix unitaires mentionnés
   - Quantités indiquées
   - Calculs vérifiables (quantité × prix unitaire = sous-total)

c) **Comparaison avec le marché :**
   ${contexts ? `
   - **UTILISEZ LES CONTEXTES FOURNIS** : Extrayez les montants des devis similaires
   - Calculez une moyenne des tarifs observés dans les contextes
   - Comparez le devis analysé avec cette moyenne
   - Identifiez les écarts significatifs (>30% = alerte)
   - Tenez compte des scores de similarité : un contexte avec score >0.8 est très pertinent
   ` : `
   - Estimez si les tarifs semblent cohérents avec les standards du marché français
   - Considérez le type de travaux (plomberie, électricité, maçonnerie, etc.)
   - Prenez en compte la région si mentionnée (les tarifs varient selon les zones)
   `}

d) **Détection d'anomalies tarifaires :**
   - Tarif anormalement bas (<50% du marché) : Risque de sous-traitance non déclarée, matériaux de mauvaise qualité, ou arnaque
   - Tarif anormalement élevé (>50% du marché) : Possible sur-facturation
   - Absence de détail : Manque de transparence, risque de facturation cachée

**Points d'alerte :**
- Tarif total sans détail des prestations
- Calculs incohérents (TTC ≠ HT + TVA)
- Prix unitaires absents ou suspects
- Écarts importants avec le marché (>30%)

**Scoring :**
- Tarif cohérent avec le marché, détaillé, calculs corrects : +20 points
- Tarif cohérent mais manque de détail : +10 points
- Tarif légèrement différent (±20%) : +5 points
- Tarif très différent (±30-50%) : -10 points
- Tarif très différent (>50%) ou calculs incorrects : -20 points

---

### 4. COHÉRENCE DU DEVIS

**Éléments à vérifier :**

a) **Structure et organisation :**
   - Présence d'un en-tête clair
   - Sections bien délimitées (identification, prestations, tarifs, conditions)
   - Numérotation ou organisation logique
   - Lisibilité générale

b) **Cohérence des informations :**
   - Les dates sont logiques (date d'émission, validité)
   - Les montants sont cohérents entre eux
   - Les prestations correspondent au type d'entreprise
   - Les délais sont cohérents avec les travaux

c) **Clarté et précision :**
   - Description détaillée des prestations
   - Terminologie professionnelle appropriée
   - Absence d'ambiguïtés majeures
   - Informations complètes et précises

d) **Professionnalisme :**
   - Présentation soignée
   - Absence de fautes d'orthographe majeures
   - Format professionnel
   - Ton approprié

**Points d'alerte :**
- Structure confuse ou désorganisée
- Informations contradictoires
- Descriptions vagues ou imprécises
- Nombreuses fautes d'orthographe
- Format amateur

**Scoring :**
- Très cohérent, bien structuré, professionnel : +15 points
- Cohérent mais quelques imprécisions : +10 points
- Manque de clarté sur certains points : +5 points
- Structure confuse ou informations contradictoires : -10 points
- Très incohérent ou amateur : -15 points

---

### 5. RESPECT DES NORMES LÉGALES

**Mentions légales OBLIGATOIRES (Code de la consommation) :**

a) **Identification de l'entreprise :**
   - Nom ou raison sociale
   - Adresse complète
   - Numéro SIRET (obligatoire pour les entreprises)
   - Numéro SIREN (peut être déduit du SIRET)
   - Forme juridique

b) **Informations sur la prestation :**
   - Description détaillée des prestations
   - Prix unitaires et totaux
   - TVA clairement indiquée (taux et montant)
   - Conditions de paiement (acompte, solde, modalités)
   - Délai de validité du devis (obligatoire, minimum 30 jours)

c) **Conditions générales :**
   - Référence aux conditions générales de vente (CGV)
   - Ou mention des CGV disponibles sur demande
   - Conditions particulières si applicables

d) **Droits du consommateur :**
   - Droit de rétractation (si applicable)
   - Modalités de réclamation
   - Médiation (si applicable)

e) **Assurances obligatoires :**
   - Assurance responsabilité civile professionnelle (obligatoire)
   - Garantie décennale (si travaux de construction)

**Points d'alerte :**
- Absence de SIRET
- TVA non mentionnée ou incorrecte
- Délai de validité absent
- Conditions de paiement floues
- Absence de référence aux CGV

**Scoring :**
- Toutes les mentions légales présentes : +20 points
- Mentions principales présentes (SIRET, TVA, validité) : +15 points
- Manque 1-2 mentions importantes : +5 points
- Manque plusieurs mentions importantes : -10 points
- Manque des mentions critiques (SIRET, TVA) : -20 points

---

### 6. ESTIMATION DU DÉLAI DE LIVRAISON / RÉALISATION

**Éléments à vérifier :**

a) **Présence d'un délai :**
   - Délai de réalisation mentionné
   - Délai de validité du devis mentionné
   - Délai de démarrage des travaux (si applicable)

b) **Réalisme du délai :**
   - Le délai est-il adapté au volume de travaux ?
   - Prend-il en compte les contraintes saisonnières ?
   - Est-il cohérent avec la complexité des prestations ?
   - Y a-t-il des étapes intermédiaires mentionnées ?

c) **Précision :**
   - Délai exprimé en jours, semaines, ou mois
   - Date de début et de fin (ou durée)
   - Conditions pouvant affecter le délai

**Points d'alerte :**
- Délai absent
- Délai irréaliste (trop court pour la complexité)
- Délai trop vague ("sous peu", "rapidement")
- Absence de mention des conditions pouvant affecter le délai

**Scoring :**
- Délai réaliste, précis et adapté : +10 points
- Délai présent mais imprécis : +5 points
- Délai irréaliste ou absent : -10 points

---

### 7. GARANTIES ET ASSURANCES

**Garanties OBLIGATOIRES selon le type de travaux :**

a) **Garantie décennale :**
   - OBLIGATOIRE pour tous les travaux de construction, rénovation lourde, gros œuvre
   - Doit être mentionnée explicitement
   - Durée : 10 ans à compter de la réception des travaux

b) **Assurance responsabilité civile professionnelle :**
   - OBLIGATOIRE pour tous les artisans
   - Doit être mentionnée
   - Couvre les dommages causés aux tiers

c) **Garanties complémentaires :**
   - Garantie de parfait achèvement (1 an)
   - Garantie biennale (2 ans) pour les éléments d'équipement
   - Garantie commerciale (si proposée)

**Points d'alerte CRITIQUES :**
- Garantie décennale absente pour des travaux de construction
- Assurance RC pro non mentionnée
- Aucune garantie mentionnée

**Scoring :**
- Toutes les garanties obligatoires mentionnées : +15 points
- Garanties principales présentes (décennale + RC pro) : +10 points
- Manque la garantie décennale (si applicable) : -15 points (impact majeur)
- Manque l'assurance RC pro : -10 points
- Aucune garantie mentionnée : -20 points

---

## INSTRUCTIONS SPÉCIALES POUR L'UTILISATION DES CONTEXTES RAG

${contextsSection}

**Méthodologie de comparaison avec les contextes :**

1. **Extraction des données des contextes :**
   - Pour chaque contexte, identifiez :
     * Le montant total (TTC ou HT)
     * Le type de travaux
     * La structure du devis
     * Les éléments présents (SIRET, garanties, etc.)
   - Notez le score de similarité (entre parenthèses) : plus il est élevé, plus le contexte est pertinent

2. **Calcul de références :**
   - Calculez la moyenne des montants des contextes pertinents (score >0.7)
   - Identifiez les éléments communs aux devis de référence
   - Notez les écarts significatifs

3. **Analyse comparative :**
   - Comparez le montant du devis analysé avec la moyenne calculée
   - Vérifiez si les éléments présents/absents sont cohérents avec les références
   - Identifiez les anomalies (écarts >30%)

4. **Pondération :**
   - Un contexte avec score >0.9 est très pertinent : utilisez-le comme référence principale
   - Un contexte avec score 0.7-0.9 est pertinent : utilisez-le pour confirmer
   - Un contexte avec score <0.7 est moins pertinent : utilisez-le avec précaution

---

## SYSTÈME DE SCORING GLOBAL

**Calcul de la fiabilité globale :**

La fiabilité est calculée sur 100 points selon la formule suivante :
- Identité de l'artisan : 15 points max
- Numéro de SIRET : 20 points max
- Tarif par rapport au marché : 20 points max
- Cohérence du devis : 15 points max
- Respect des normes légales : 20 points max
- Estimation du délai : 10 points max
- Garanties et assurances : 15 points max

**Interprétation des scores :**
- 80-100 : Devis très fiable, professionnel, conforme
- 60-79 : Devis fiable avec quelques points d'amélioration
- 40-59 : Devis moyennement fiable, plusieurs points d'alerte
- 20-39 : Devis peu fiable, nombreux points d'alerte
- 0-19 : Devis très peu fiable ou suspect

**Points de pénalité supplémentaires :**
- SIRET invalide : -10 points supplémentaires
- Absence totale de garanties obligatoires : -10 points supplémentaires
- Tarif anormalement bas (>50% sous le marché) : -5 points supplémentaires (risque d'arnaque)

---

## FORMAT DE RÉPONSE STRICTEMENT ATTENDU

Vous DEVEZ respecter EXACTEMENT cette structure. Ne modifiez pas les libellés, ne changez pas l'ordre, ne supprimez aucune ligne.

Fiabilité globale : [Un nombre entier entre 0 et 100]

Détails :
- Identité de l'artisan : [Statut détaillé avec justification - Exemple : "Présente : SARL Plomberie Dupont, correspond au SIRET vérifié", "Présente : Jean Martin, mais ne correspond pas au SIRET 12345678901234 vérifié (entreprise enregistrée : SARL Martin)", "Non mentionnée"]
- Numéro de SIRET : [Statut détaillé avec le SIRET si présent - Exemple : "Mentionné et validé : 12345678901234 - Entreprise SARL Plomberie Dupont trouvée dans Sirene, créée le 15/03/2010", "Mentionné mais invalide : 12345678901234 - Non trouvé dans le répertoire Sirene, signal d'alerte majeur", "Non mentionné - Obligatoire pour les entreprises, impact négatif sur la fiabilité"]
- Tarif par rapport aux tendances du marché : [Statut détaillé avec montants et comparaisons - Exemple : "Cohérent avec le marché : Total TTC 3500€, comparable aux devis similaires (moyenne observée : 3200-3800€ dans les contextes)", "Trop élevé : Total TTC 6000€, soit +70% par rapport à la moyenne observée (3500€) dans les devis similaires", "Trop bas : Total TTC 1500€, soit -60% par rapport à la moyenne (3800€), risque de sous-traitance non déclarée ou matériaux de qualité inférieure", "Tarif présent (2500€ TTC) mais absence de détail des prestations, manque de transparence"]
- Cohérence du devis : [Statut détaillé avec exemples - Exemple : "Cohérent et bien structuré : En-tête professionnel, sections claires (identification, prestations détaillées, tarifs, conditions), calculs vérifiables, présentation soignée", "Manque de clarté : Prestations décrites de manière vague, absence de prix unitaires, structure confuse", "Incohérences détectées : Montant TTC (3500€) ne correspond pas à HT (3000€) + TVA 20% (600€) = 3600€"]
- Respect des normes légales : [Statut détaillé avec liste des éléments présents/absents - Exemple : "Conforme : SIRET présent, TVA 20% indiquée (600€), délai de validité 60 jours mentionné, conditions de paiement détaillées, référence aux CGV", "Manque : Délai de validité non mentionné (obligatoire), conditions de paiement absentes", "Non conforme : SIRET absent, TVA non mentionnée, aucune mention légale"]
- Estimation du délai de livraison : [Statut détaillé avec le délai mentionné - Exemple : "Réaliste : Délai de réalisation de 3 semaines mentionné, adapté aux travaux de plomberie décrits (remplacement chaudière + 5 radiateurs)", "Délais trop courts : 5 jours mentionnés pour des travaux de rénovation complète d'une salle de bain, délai irréaliste", "Absent : Aucun délai de réalisation mentionné"]
- Garanties et assurances : [Statut détaillé avec liste - Exemple : "Mentionnées : Garantie décennale explicitement mentionnée, assurance RC pro indiquée, garantie biennale sur les équipements", "Manque garantie décennale : Assurance RC pro mentionnée mais garantie décennale absente alors que travaux de construction (obligatoire)", "Non mentionnées : Aucune garantie ou assurance mentionnée, signal d'alerte majeur"]

Conclusion :
[Une conclusion de 3-5 phrases qui : 1) Résume la fiabilité globale du devis, 2) Liste les 2-3 points forts principaux, 3) Liste les 2-3 points d'alerte principaux, 4) Donne une recommandation claire (ex: "Devis fiable, vous pouvez procéder" ou "Devis présentant des risques, vérifiez les points d'alerte avant de signer")]

---

## RÈGLES ABSOLUES

1. **Format strict :** Répondez UNIQUEMENT dans le format demandé ci-dessus. Ne modifiez pas la structure, ne changez pas les libellés.

2. **Pas d'explications supplémentaires :** Ne donnez pas d'explications en dehors de la structure demandée. Ne faites pas de commentaires supplémentaires.

3. **Justification des scores :** Pour chaque critère, justifiez votre évaluation avec des éléments concrets tirés du devis analysé.

4. **Utilisation des informations vérifiées :** Utilisez TOUJOURS les informations de vérification SIRET si disponibles. Ne les ignorez pas.

5. **Utilisation des contextes :** Si des contextes sont fournis, vous DEVEZ les utiliser pour votre analyse comparative. Citez les montants moyens observés.

6. **Détection de non-devis :** Si le texte ne semble pas être un devis (facture, bon de commande, autre document), indiquez-le clairement dans la conclusion avec un score de fiabilité très bas (0-20).

7. **Cohérence du scoring :** Assurez-vous que le score global de fiabilité correspond à la somme des points attribués aux différents critères (avec les pénalités éventuelles).

8. **Précision :** Soyez précis dans vos évaluations. Évitez les formulations vagues. Citez des montants, des dates, des éléments concrets.

---

## TEXTE DU DEVIS À ANALYSER

${text}

---

**DÉBUT DE VOTRE RÉPONSE (respectez exactement le format) :**
`;
}
