# D-via

Application [Next.js](https://nextjs.org) (App Router) pour l’analyse de devis, la mise en relation clients / artisans.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Les variables d’environnement sont décrites dans `.env.example` (base de données, NextAuth, Stripe, Document AI, Mistral, Pinecone, etc.).

### Scripts npm

| Script | Rôle |
|--------|------|
| `npm run dev` | Serveur de développement Next.js. |
| `npm run build` | Build production. |
| `npm run start` | Démarrage après build. |
| `npm run lint` | ESLint (Next). |
| `npm run vercel-build` | `prisma generate` puis `next build` (CI / Vercel). |
| `npm run migrate:deploy` | Applique les migrations Prisma sur la base cible. |
| `npm run db:seed` | Exécute `prisma/seed.ts` (données de dev / démo). |

---

## Groupes de routes (`app/`)

Les dossiers entre parenthèses ne figurent pas dans l’URL ; ils servent à **mutualiser un layout**.

| Groupe | Exemples d’URL | Layout typique |
|--------|----------------|----------------|
| `(landing)` | `/`, `/pricing`, `/blog` | Shell marketing / blog. |
| `(auth)` | `/signup`, `/signin` | Parcours inscription / connexion. |
| `(simple)` | `/reset-password`, `/non-authorized` | Page minimale : header logo + contenu centré. |
| `dashboard` | `/dashboard`, `/dashboard/clients`, … | Shell connecté (rail, header dashboard). |

Les **route handlers** restent sous `app/api/...` (hors de ces groupes).

---

## Authentification et rôles

- **NextAuth v5** (JWT) avec adaptateur Prisma pour la persistance comptes / sessions en base.
- Fournisseurs configurés dans `configs/prisma/auth.config.ts` (Google, Google artisan, identifiants).
- Rôles Prisma (`Role`) : `USER`, `ADMIN`, `CLIENT`, `ARTISAN` — exposés dans le token / session pour l’UI et les garde-fous serveur.
- Le **proxy** ne lit que le JWT (Edge) ; toute logique métier lourde (Stripe customer, promotion de rôle) reste dans les callbacks côté Node.

---

## Paiements et crédits d’analyse

- **Checkout** : action serveur `createStripeCheckoutSession` (`services/database/stripe-checkout-action.ts`), packs et nombre de crédits décrits dans `configs/stripe/analysis-pack-credits.ts`.
- **Webhook** : `POST /api/stripe/webhook` — événement `checkout.session.completed`, lecture de `metadata.userId` / `metadata.credits`, incrément `User.analysisCredits`. Nécessite `STRIPE_WEBHOOK_SECRET` et l’URL du webhook déclarée dans le dashboard Stripe.
- **Succès paiement** : redirection vers `/dashboard/success`.
- **Droits d’analyse** : règles dans `data/analysis.ts` (crédits utilisateur connecté, empreinte IP hashée pour l’invité via `ANALYSIS_IP_HASH_SALT`), appliquées sur `/api/documentai` et `/api/rag/analyze`.

---

## Flux analyse de devis (résumé)

1. Upload côté client → `POST /api/documentai` (Google Document AI, variables d’environnement du compte de service).
2. Optionnel : `POST /api/rag/ask` pour des contextes Pinecone (namespace `devis`, etc.).
3. `POST /api/rag/analyze` : prompt Mistral, détails structurés, vérification SIRET si applicable.
4. Consommation du crédit / enregistrement invité et historique Prisma pour les comptes connectés (voir `data/analysis.ts`).

---

## Dépannage (local / production)

- **Document AI** : sans `PRIVATE_KEY`, `PROJECT_ID`, `REGION_ID`, `PROCESSOR_ID`, etc., la route renvoie une erreur explicite ; aligner le `.env` sur la prod Vercel.
- **Proxy `/dashboard`** : sans `NEXTAUTH_SECRET` (ou `AUTH_SECRET`), la protection JWT est désactivée avec un avertissement console — à corriger en prod.
- **Prisma** : en cas de décalage entre l’historique des migrations et la base (drift), traiter avec `prisma migrate` / SQL manuel selon votre politique d’équipe.
- **RAG** : index Pinecone, clé API et nom d’index doivent correspondre à ceux utilisés par `insert-chunk` et `ask`.

---

## Contenu (blog)

Articles et pages MDX / contenu statique sous `app` et `content` selon l’implémentation actuelle ; images et métadonnées Open Graph à maintenir cohérents avec `app/layout.tsx` si vous changez l’URL canonique du site.

---

## Sécurité et bonnes pratiques

- Ne pas versionner `.env` ; utiliser `.env.example` comme référence.
- Définir un **`ANALYSIS_IP_HASH_SALT`** long et unique en production pour l’analyse gratuite invité.
- Restreindre les clés API (Document AI, Mistral, Pinecone) par environnement et rotationner en cas de fuite.
- Vérifier que le **webhook Stripe** pointe bien vers l’URL de prod et que seules les signatures valides sont acceptées.

---

## Structure du dépôt (`src/`)

| Dossier | Rôle |
|---------|------|
| `app/` | Routes, layouts par segment `(landing)`, `(auth)`, `(simple)`, `dashboard`, et routes API sous `app/api/`. |
| `components/atoms/` | Éléments UI minimaux (boutons, champs, pictos isolés). |
| `components/molecules/` | Blocs composés de plusieurs atoms (cartes, lignes de formulaire, barres d’outils). |
| `components/organisms/` | Sections ou en-têtes complets (header landing, header dashboard, formulaires multi-étapes). |
| `configs/` | Configuration partagée (Prisma client, auth NextAuth, Stripe). |
| `constants/` | Constantes dont les chemins d’icônes (`icons.ts`), prompts RAG, etc. |
| `data/` | Accès données et règles métier **sans** `"use server"` (ex. `analysis.ts` pour Prisma + IP, réutilisé par le proxy et les routes API). |
| `hooks/` | Hooks React réutilisables (`use client`). |
| `providers/` | Arborescence des providers React (session, phase test, carte, état global léger). |
| `schemas/` | Schémas [Zod](https://zod.dev) pour valider les entrées (auth, formulaires). |
| `services/` | Intégrations et logique serveur : `database/` (actions `"use server"`, Prisma), `rag/`, `email/`, `twilio/`, `auth/`. |
| `stores/` | Stores client (ex. Zustand) pour des flux longs comme l’inscription. |
| `types/` | Types TypeScript partagés (ex. analyse, historique). |
| `utils/` | Utilitaires purs (cookies, helpers). |
| `proxy.ts` | Point d’entrée unique du **proxy Next.js 16** (équivalent middleware : ne pas ajouter un second `middleware.ts`). |

**Atomic design (atoms / molecules / organisms)** : on garde une hiérarchie claire pour limiter le couplage et faciliter la relecture. Les molecules regroupent des atoms pour un usage métier précis ; les organisms assemblent molecules + atoms pour un écran ou une zone majeure.

---

## Server actions et routes API : quand utiliser quoi

### Server actions (`"use server"`)

Fichiers typiques : `src/services/database/*-actions.ts`, `recommended-artisans.ts`, etc.

- Appel direct depuis les composants client ou les Server Components, typage fort, moins de code `fetch` manuel.
- Adapté aux **mutations et lectures simples** déclenchées par l’UI (crédits, historique d’analyse, checkout Stripe côté session utilisateur).

La logique Prisma partagée avec d’autres couches vit de préférence dans `src/data/` ; les actions orchestrent auth, headers et appellent `data/`.

### Routes API (`app/api/.../route.ts`)

À conserver pour les cas où une **requête HTTP brute** est requise ou plus naturelle :

- **Webhooks** (ex. Stripe : corps signé, pas d’action serveur classique).
- **Gros payloads** ou pipelines longs (ex. **Document AI** : PDF / images en base64, **RAG** : embeddings, Pinecone).
- **Clients externes** ou outils qui appellent une URL REST.
- **Proxy interne** depuis le navigateur quand on veut éviter d’exposer des secrets côté client (clés API, etc.).

En résumé : préférer les **actions** pour le dialogue app ↔ base / Stripe checkout utilisateur ; garder les **routes** pour intégrations, fichiers lourds et protocoles imposés.

---

## RAG (recherche augmentée)

**Services** : `src/services/rag/` (`chunk.ts`, `vector.ts`, `pinecone.ts`, `chatcompletion.ts`).

| Endpoint | Usage |
|----------|--------|
| `POST /api/rag/insert-chunk` | Découpe un texte, calcule les embeddings, upsert dans Pinecone (`namespace` optionnel, métadonnées par chunk). À utiliser pour **alimenter ou mettre à jour** la base vectorielle. |
| `POST /api/rag/ask` | Embedde la question, interroge Pinecone (`namespace`, `topK`, filtre `docId` optionnel), renvoie des contextes textuels pour le prompt. |
| `POST /api/rag/analyze` | Analyse le texte du devis (Mistral + contextes RAG optionnels + vérifs métier). Protégé par les mêmes règles de crédits / IP que Document AI côté `data/analysis.ts`. |

Flux côté produit : extraction du texte (Document AI) → éventuellement `ask` pour des extraits réglementaires / pédagogiques → `analyze` pour le score et les détails structurés.

Les fichiers de routes RAG contiennent des blocs de commentaire décrivant paramètres et réponses : les conserver à jour lors des évolutions.

---

## Providers (`src/providers/`)

Ordre dans `providers.tsx` (extérieur → intérieur) :

1. `SessionProvider` (NextAuth) — session client.
2. `TestPhaseProvider` — cookie / état de la phase de test (aligné avec `proxy.ts`).
3. `LocationProvider` — contexte lié à la géolocalisation / carte.
4. `GlobalStateProvider` — état UI partagé léger (adresse, carte Leaflet, filtres formulaire artisan).

Tout ce qui est **persistant multi-étapes** ou volumineux peut rester dans un **store** dédié plutôt que dans ce contexte.

---

## Stores

- **`src/stores/signupStore.ts`** (Zustand) : parcours d’inscription long, étapes, appels API, toasts. Évite de surcharger `GlobalStateProvider`.
- Règle : **Context** pour peu de valeurs partagées et stables ; **Zustand** (ou équivalent) pour des flux avec beaucoup de champs et d’effets de bord.

---

## Proxy (`src/proxy.ts`)

Next.js 16 utilise ce fichier comme **middleware applicatif** (voir [documentation middleware / proxy](https://nextjs.org/docs/messages/middleware-to-proxy)).

Comportement actuel (ordre logique) :

1. **Phase de test** : sans cookie d’acceptation, redirection vers `/phasetest` (sauf chemins listés dans `publicPaths`).
2. **Espace `/dashboard`** : présence d’un JWT de session (`getToken`, secret `NEXTAUTH_SECRET` ou `AUTH_SECRET`). Sans token → redirection vers `/non-authorized` (chemin aussi dans `publicPaths`).
3. **Signup interrompu** : cookies de reprise de parcours ; redirections vers les steps `/signup/...` si l’utilisateur quitte le tunnel sans être sur une page autorisée.

Le `config.matcher` limite les extensions statiques et exclut `api`, `_next`, etc.

---

## Icônes

- Fichiers SVG sous **`public/icons/`**, organisés par domaine (ex. `dashboard/nav/`, `dashboard/artisan-card/`).
- **Ne pas** coder les chemins en dur dans les composants : passer par **`src/constants/icons.ts`** (`ICONS`) pour garder une convention **kebab-case** et un seul point de vérité.

---

## Prisma

- Schéma : `prisma/schema.prisma`.
- Client singleton : `src/configs/prisma/prisma.ts` (évite les connexions multiples en dev).
- Migrations : `prisma/migrations/` ; déploiement : `npm run migrate:deploy` (ou équivalent CI).
- Le fichier `auth.config.ts` importe Prisma pour les callbacks ; **ne pas** importer Prisma dans `proxy.ts` (Edge) : le proxy s’appuie sur le JWT uniquement.

---

## Schémas et validation

- **`src/schemas/`** : Zod pour les entrées utilisateur (ex. `signupClientSchema`, rôles).
- Valider côté serveur (actions ou routes) avant écriture base ; le schéma peut être réutilisé côté client pour l’UX.

---

## Hooks (`src/hooks/`)

- Préfixe `use`, composants consommateurs en `"use client"` si nécessaire.
- Y placer la logique réutilisable (session, formulaires, historique local invité), pas les appels Prisma directs.

---

## Déploiement

Build Vercel typique : `prisma generate` puis `next build` (script `vercel-build` dans `package.json`). Configurer les variables d’environnement sur la plateforme comme en local.

Configurer **`HOST_URL`** (URLs de succès / annulation Stripe, liens e-mail) sur l’URL publique réelle du site.

---

## Qualité et évolutions

- **`npm run lint`** avant merge conseillé ; pas de suite de tests E2E/unitaire imposée dans le dépôt à ce jour — à ajouter si le produit le nécessite (Playwright, Vitest, etc.).
- Pour toute nouvelle route API ou action : documenter brièvement corps, réponses et codes d’erreur (comme sur les routes RAG existantes).

---

## Documentation externe

- [Next.js](https://nextjs.org/docs)
- [Auth.js / NextAuth v5](https://authjs.dev)
- [Prisma](https://www.prisma.io/docs)
