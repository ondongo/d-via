# D-via

Application [Next.js](https://nextjs.org) (App Router) pour l’analyse de devis, la mise en relation clients / artisans.

<a id="sommaire"></a>
## Sommaire

- [Démarrage](#demarrage) — installation, variables d’environnement, [scripts npm](#scripts-npm)
- [Structure du dépôt (`src/`)](#structure-depot)
- [Conventions des dossiers dans `app/` (App Router)](#conventions-app)
- [Authentification et rôles](#auth)
- [Paiements et crédits d’analyse](#paiements-credits)
- [Flux analyse de devis (résumé)](#flux-analyse)
- [Dépannage (local / production)](#depannage)
- [Contenu (blog)](#contenu-blog)
- [Sécurité et bonnes pratiques](#securite)
- [Server actions et routes API](#server-actions-api)
- [RAG (recherche augmentée)](#rag)
- [Providers (`src/providers/`)](#providers)
- [Stores](#stores)
- [Proxy (`src/proxy.ts`)](#proxy)
- [Icônes](#icones)
- [Prisma](#prisma)
- [Schémas et validation](#schemas)
- [Hooks (`src/hooks/`)](#hooks)
- [Déploiement](#deploiement)
- [Qualité et évolutions](#qualite)
- [Documentation externe](#documentation-externe)

---

<a id="demarrage"></a>
## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Les variables d’environnement sont décrites dans `.env.example` (base de données, NextAuth, Stripe, Document AI, Mistral, Pinecone, etc.).

<a id="scripts-npm"></a>
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

<a id="structure-depot"></a>
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

<a id="conventions-app"></a>
## Conventions des dossiers dans `app/` (App Router)

Next.js transforme l’arborescence `app/` en URLs. Le **nom du dossier** détermine si un segment apparaît dans le chemin ou s’il a un rôle spécial.

### 1. Dossier « normal » (sans préfixe ni syntaxe spéciale)

Exemple : `app/dashboard/clients/page.tsx`

- Chaque segment devient une partie de l’URL : ici `/dashboard/clients`.
- Utilisé pour la structure réelle du site (zones `/blog`, `/dashboard`, etc.).

### 2. Parenthèses : groupe de routes — `(nom)`

Exemple : `app/(landing)/pricing/page.tsx` → URL **`/pricing`**, pas `/(landing)/pricing`.

- Le dossier `(landing)` **n’apparaît pas** dans l’URL.
- Sert à **regrouper** des routes qui partagent le même `layout.tsx` sans ajouter de segment d’URL.
- Plusieurs groupes au même niveau peuvent coexister : `(marketing)` et `(shop)` peuvent chacun avoir leur layout, tout en produisant des URLs plates (`/about`, `/cart`, …).

### 3. Crochets : segment dynamique — `[param]`

Exemple : `app/blog/[slug]/page.tsx` → `/blog/mon-article`.

- `params.slug` est disponible dans la page / layout (Server Component) ou via `useParams()` côté client.

### 4. Catch-all — `[...segments]`

Exemple : `app/docs/[...slug]/page.tsx` → `/docs/a`, `/docs/a/b`, etc.

- `params.slug` est un **tableau** de segments.

### 5. Catch-all optionnel — `[[...segments]]`

Exemple : `app/shop/[[...category]]/page.tsx` → `/shop` **et** `/shop/vetements`, etc.

- Permet une même page pour la racine du segment et pour des sous-chemins variables.

### 6. Arobase : routes parallèles — `@slot`

Exemple : `app/@modal/(.)photo/[id]/page.tsx` avec un `layout.tsx` qui rend `{children}` et `{modal}`.

- Les dossiers `@nom` sont des **emplacements (slots)** passés en props au layout parent (`modal`, `sidebar`, etc.).
- L’URL affichée reste celle de la route « principale » ; le slot affiche du contenu en plus (souvent une modale ou un panneau).
- Nécessite en général un `default.tsx` dans chaque slot pour le cas « slot vide ».

### 7. Interception de routes — préfixes `(.)`, `(..)`, `(..)(..)`, `(...)`

Utilisés **à l’intérieur** d’un dossier `@slot` (ou équivalent) pour afficher une UI (ex. modale) tout en gardant l’URL du parent dans la barre d’adresse.

| Préfixe | Signification (raccourci) |
|---------|---------------------------|
| `(.)` | Intercepter au **même** niveau de segment. |
| `(..)` | Remonter **un** niveau par rapport au dossier du slot. |
| `(..)(..)` | Remonter **deux** niveaux. |
| `(...)` | Relatif à la **racine** `app/`. |

La doc officielle détaille les cas limites ; à utiliser quand on veut une modale + deep-link sans dupliquer toute une arborescence.

### 8. Underscore : dossier privé — `_dossier`

Exemple : `app/dashboard/_components/Button.tsx`

- Le segment `_components` **ne crée pas** de route.
- Sert à **colocaliser** fichiers utilitaires, composants ou tests à côté des routes sans les exposer en URL.

### 9. Fichiers spéciaux (à la racine d’un segment)

| Fichier | Rôle |
|---------|------|
| `page.tsx` | UI de la route (obligatoire pour une page navigable). |
| `layout.tsx` | Enveloppe partagée pour ce segment et ses enfants. |
| `loading.tsx` | Suspense boundary / état de chargement. |
| `error.tsx` | Boundary d’erreur pour ce segment. |
| `not-found.tsx` | 404 locale au segment. |
| `template.tsx` | Comme layout mais remonte l’état à chaque navigation. |
| `route.ts` | **Route Handler** HTTP (`GET`, `POST`, …) — pas de `page.tsx` pour la même URL. |
| `default.tsx` | Contenu par défaut d’un **slot** `@` quand aucune route parallèle ne correspond. |

Les API REST du projet sont surtout sous **`app/api/.../route.ts`** (même idée : `route.ts` sans `page.tsx`).

### Références dans ce dépôt

| Convention | Exemple chemin | URL réelle |
|------------|----------------|------------|
| Groupe `(landing)` | `(landing)/pricing/page.tsx` | `/pricing` |
| Groupe `(auth)` | `(auth)/signup/step1/page.tsx` | `/signup/step1` |
| Groupe `(simple)` | `(simple)/non-authorized/page.tsx` | `/non-authorized` |
| Segment fixe | `dashboard/clients/page.tsx` | `/dashboard/clients` |
| Dynamique | `blog/[slug]/page.tsx` | `/blog/...` |
| API | `api/rag/ask/route.ts` | `/api/rag/ask` |

Les **routes parallèles** (`@`) et **interceptions** (`(.)` …) ne sont pas utilisées dans ce dépôt pour l’instant ; les ajouter seulement si un besoin UX (modale + URL) le justifie.

Documentation Next.js : [Project structure and organization](https://nextjs.org/docs/app/getting-started/project-structure), [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups), [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes), [Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes).

---

<a id="auth"></a>
## Authentification et rôles

- **NextAuth v5** (JWT) avec adaptateur Prisma pour la persistance comptes / sessions en base.
- Fournisseurs configurés dans `configs/prisma/auth.config.ts` (Google, Google artisan, identifiants).
- Rôles Prisma (`Role`) : `USER`, `ADMIN`, `CLIENT`, `ARTISAN` — exposés dans le token / session pour l’UI et les garde-fous serveur.
- Le **proxy** ne lit que le JWT (Edge) ; toute logique métier lourde (Stripe customer, promotion de rôle) reste dans les callbacks côté Node.

---

<a id="paiements-credits"></a>
## Paiements et crédits d’analyse

- **Checkout** : action serveur `createStripeCheckoutSession` (`services/database/stripe-checkout-action.ts`), packs et nombre de crédits décrits dans `configs/stripe/analysis-pack-credits.ts`.
- **Webhook** : `POST /api/stripe/webhook` — événement `checkout.session.completed`, lecture de `metadata.userId` / `metadata.credits`, incrément `User.analysisCredits`. Nécessite `STRIPE_WEBHOOK_SECRET` et l’URL du webhook déclarée dans le dashboard Stripe.
- **Succès paiement** : redirection vers `/dashboard/success`.
- **Droits d’analyse** : règles dans `data/analysis.ts` (crédits utilisateur connecté, empreinte IP hashée pour l’invité via `ANALYSIS_IP_HASH_SALT`), appliquées sur `/api/documentai` et `/api/rag/analyze`.

---

<a id="flux-analyse"></a>
## Flux analyse de devis (résumé)

1. Upload côté client → `POST /api/documentai` (Google Document AI, variables d’environnement du compte de service).
2. Optionnel : `POST /api/rag/ask` pour des contextes Pinecone (namespace `devis`, etc.).
3. `POST /api/rag/analyze` : prompt Mistral, détails structurés, vérification SIRET si applicable.
4. Consommation du crédit / enregistrement invité et historique Prisma pour les comptes connectés (voir `data/analysis.ts`).

---

<a id="depannage"></a>
## Dépannage (local / production)

- **Document AI** : sans `PRIVATE_KEY`, `PROJECT_ID`, `REGION_ID`, `PROCESSOR_ID`, etc., la route renvoie une erreur explicite ; aligner le `.env` sur la prod Vercel.
- **Proxy `/dashboard`** : sans `NEXTAUTH_SECRET` (ou `AUTH_SECRET`), la protection JWT est désactivée avec un avertissement console — à corriger en prod.
- **Prisma** : en cas de décalage entre l’historique des migrations et la base (drift), traiter avec `prisma migrate` / SQL manuel selon votre politique d’équipe.
- **RAG** : index Pinecone, clé API et nom d’index doivent correspondre à ceux utilisés par `insert-chunk` et `ask`.

---

<a id="contenu-blog"></a>
## Contenu (blog)

Articles et pages MDX / contenu statique sous `app` et `content` selon l’implémentation actuelle ; images et métadonnées Open Graph à maintenir cohérents avec `app/layout.tsx` si vous changez l’URL canonique du site.

---

<a id="securite"></a>
## Sécurité et bonnes pratiques

- Ne pas versionner `.env` ; utiliser `.env.example` comme référence.
- Définir un **`ANALYSIS_IP_HASH_SALT`** long et unique en production pour l’analyse gratuite invité.
- Restreindre les clés API (Document AI, Mistral, Pinecone) par environnement et rotationner en cas de fuite.
- Vérifier que le **webhook Stripe** pointe bien vers l’URL de prod et que seules les signatures valides sont acceptées.

---

<a id="server-actions-api"></a>
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

<a id="rag"></a>
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

<a id="providers"></a>
## Providers (`src/providers/`)

Ordre dans `providers.tsx` (extérieur → intérieur) :

1. `SessionProvider` (NextAuth) — session client.
2. `TestPhaseProvider` — cookie / état de la phase de test (aligné avec `proxy.ts`).
3. `LocationProvider` — contexte lié à la géolocalisation / carte.
4. `GlobalStateProvider` — état UI partagé léger (adresse, carte Leaflet, filtres formulaire artisan).

Tout ce qui est **persistant multi-étapes** ou volumineux peut rester dans un **store** dédié plutôt que dans ce contexte.

---

<a id="stores"></a>
## Stores

- **`src/stores/signupStore.ts`** (Zustand) : parcours d’inscription long, étapes, appels API, toasts. Évite de surcharger `GlobalStateProvider`.
- Règle : **Context** pour peu de valeurs partagées et stables ; **Zustand** (ou équivalent) pour des flux avec beaucoup de champs et d’effets de bord.

---

<a id="proxy"></a>
## Proxy (`src/proxy.ts`)

Next.js 16 utilise ce fichier comme **middleware applicatif** (voir [documentation middleware / proxy](https://nextjs.org/docs/messages/middleware-to-proxy)).

Comportement actuel (ordre logique) :

1. **Phase de test** : sans cookie d’acceptation, redirection vers `/phasetest` (sauf chemins listés dans `publicPaths`).
2. **Espace `/dashboard`** : présence d’un JWT de session (`getToken`, secret `NEXTAUTH_SECRET` ou `AUTH_SECRET`). Sans token → redirection vers `/non-authorized` (chemin aussi dans `publicPaths`).
3. **Signup interrompu** : cookies de reprise de parcours ; redirections vers les steps `/signup/...` si l’utilisateur quitte le tunnel sans être sur une page autorisée.

Le `config.matcher` limite les extensions statiques et exclut `api`, `_next`, etc.

---

<a id="icones"></a>
## Icônes

- Fichiers SVG sous **`public/icons/`**, organisés par domaine (ex. `dashboard/nav/`, `dashboard/artisan-card/`).
- **Ne pas** coder les chemins en dur dans les composants : passer par **`src/constants/icons.ts`** (`ICONS`) pour garder une convention **kebab-case** et un seul point de vérité.

---

<a id="prisma"></a>
## Prisma

- Schéma : `prisma/schema.prisma`.
- Client singleton : `src/configs/prisma/prisma.ts` (évite les connexions multiples en dev).
- Migrations : `prisma/migrations/` ; déploiement : `npm run migrate:deploy` (ou équivalent CI).
- Le fichier `auth.config.ts` importe Prisma pour les callbacks ; **ne pas** importer Prisma dans `proxy.ts` (Edge) : le proxy s’appuie sur le JWT uniquement.

---

<a id="schemas"></a>
## Schémas et validation

- **`src/schemas/`** : Zod pour les entrées utilisateur (ex. `signupClientSchema`, rôles).
- Valider côté serveur (actions ou routes) avant écriture base ; le schéma peut être réutilisé côté client pour l’UX.

---

<a id="hooks"></a>
## Hooks (`src/hooks/`)

- Préfixe `use`, composants consommateurs en `"use client"` si nécessaire.
- Y placer la logique réutilisable (session, formulaires, historique local invité), pas les appels Prisma directs.

---

<a id="deploiement"></a>
## Déploiement

Build Vercel typique : `prisma generate` puis `next build` (script `vercel-build` dans `package.json`). Configurer les variables d’environnement sur la plateforme comme en local.

Configurer **`HOST_URL`** (URLs de succès / annulation Stripe, liens e-mail) sur l’URL publique réelle du site.

---

<a id="qualite"></a>
## Qualité et évolutions

- **`npm run lint`** avant merge conseillé ; pas de suite de tests E2E/unitaire imposée dans le dépôt à ce jour — à ajouter si le produit le nécessite (Playwright, Vitest, etc.).
- Pour toute nouvelle route API ou action : documenter brièvement corps, réponses et codes d’erreur (comme sur les routes RAG existantes).

---

<a id="documentation-externe"></a>
## Documentation externe

- [Next.js](https://nextjs.org/docs)
- [Auth.js / NextAuth v5](https://authjs.dev)
- [Prisma](https://www.prisma.io/docs)
