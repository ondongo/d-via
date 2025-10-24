import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Nettoyage simple (optionnel)
 await prisma.artisan.deleteMany();
  await prisma.artisan.createMany({
    data: [
      {
        image: 'https://plus.unsplash.com/premium_photo-1663100790655-a9a79e9b2d7e?fm=jpg&q=60&w=3000',
        rating: 4.8,
        reviews: 214,
        verified: true,
        location: 'Paris, 75011',
        distance: 5,
        availability: 'Disponible dans 2 semaines',
        certifications: 'RGE,Qualibat',
        profession: 'Plombier',
        category: 'Rénovation',
      },
      {
        image: 'https://img.freepik.com/photos-gratuite/portrait-jeune-femme-noire-professionnelle-ingenieur-civil-architecture-ouvriere-portant-casque-securite-pour-travailler-chantier-construction-entrepot-utilisant-ordinateur-portable-pour-travail_640221-430.jpg',
        rating: 4.5,
        reviews: 120,
        verified: false,
        location: 'Toulouse, 31000',
        distance: 6,
        availability: 'Disponible dans 1 mois',
        certifications: 'Qualifelec',
        profession: 'Électricienne',
        category: 'Électricité',
      },
      {
        image: 'https://images.unsplash.com/photo-1743222270396-703376b47d58?fm=jpg&q=60&w=3000',
        rating: 4.6,
        reviews: 180,
        verified: false,
        location: 'Lyon, 69003',
        distance: 12,
        availability: 'Disponible la semaine prochaine',
        certifications: 'RGE',
        profession: 'Maçon',
        category: 'Gros oeuvre',
      },
      {
        image: 'https://images.unsplash.com/photo-1521799022345-481a897e45ca?fm=jpg&q=60&w=3000',
        rating: 4.9,
        reviews: 300,
        verified: true,
        location: 'Marseille, 13006',
        distance: 8,
        availability: 'Disponible immédiatement',
        certifications: 'Qualibat,EcoArtisan',
        profession: 'Peintre',
        category: 'Finition',
      },
      {
        image: 'https://plus.unsplash.com/premium_photo-1681989486976-9ec9d2eac57a?fm=jpg&q=60&w=3000',
        rating: 4.7,
        reviews: 150,
        verified: true,
        location: 'Nice, 06000',
        distance: 3,
        availability: 'Disponible dans 3 jours',
        certifications: 'RGE',
        profession: 'Menuisier',
        category: 'Menuiserie',
      },
      // 10 nouveaux artisans
      {
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=3000',
        rating: 4.9,
        reviews: 280,
        verified: true,
        location: 'Bordeaux, 33000',
        distance: 4,
        availability: 'Disponible dans 1 semaine',
        certifications: 'RGE,Qualibat',
        profession: 'Chauffagiste',
        category: 'Chauffage',
      },
      {
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?fm=jpg&q=60&w=3000',
        rating: 4.4,
        reviews: 95,
        verified: false,
        location: 'Nantes, 44000',
        distance: 7,
        availability: 'Disponible dans 2 semaines',
        certifications: 'Qualifelec',
        profession: 'Électricienne',
        category: 'Électricité',
      },
      {
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fm=jpg&q=60&w=3000',
        rating: 4.8,
        reviews: 320,
        verified: true,
        location: 'Lille, 59000',
        distance: 9,
        availability: 'Disponible immédiatement',
        certifications: 'RGE,EcoArtisan',
        profession: 'Couvreur',
        category: 'Couverture',
      },
      {
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fm=jpg&q=60&w=3000',
        rating: 4.6,
        reviews: 180,
        verified: true,
        location: 'Strasbourg, 67000',
        distance: 6,
        availability: 'Disponible dans 3 jours',
        certifications: 'Qualibat',
        profession: 'Carreleur',
        category: 'Finition',
      },
      {
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=3000',
        rating: 4.7,
        reviews: 220,
        verified: false,
        location: 'Montpellier, 34000',
        distance: 11,
        availability: 'Disponible dans 1 mois',
        certifications: 'RGE',
        profession: 'Plâtrier',
        category: 'Finition',
      },
      {
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fm=jpg&q=60&w=3000',
        rating: 4.5,
        reviews: 160,
        verified: true,
        location: 'Rennes, 35000',
        distance: 8,
        availability: 'Disponible la semaine prochaine',
        certifications: 'Qualifelec,RGE',
        profession: 'Électricien',
        category: 'Électricité',
      },
      {
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fm=jpg&q=60&w=3000',
        rating: 4.9,
        reviews: 290,
        verified: true,
        location: 'Toulouse, 31000',
        distance: 5,
        availability: 'Disponible dans 2 semaines',
        certifications: 'Qualibat,EcoArtisan',
        profession: 'Serrurier',
        category: 'Sécurité',
      },
      {
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=3000',
        rating: 4.3,
        reviews: 110,
        verified: false,
        location: 'Nancy, 54000',
        distance: 15,
        availability: 'Disponible dans 3 semaines',
        certifications: 'RGE',
        profession: 'Chauffagiste',
        category: 'Chauffage',
      },
      {
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fm=jpg&q=60&w=3000',
        rating: 4.8,
        reviews: 250,
        verified: true,
        location: 'Reims, 51100',
        distance: 7,
        availability: 'Disponible immédiatement',
        certifications: 'Qualibat',
        profession: 'Maçon',
        category: 'Gros oeuvre',
      },
    ],
    skipDuplicates: true,
  }); 

  // Seed des articles de blog
  console.log('🌱 Création des articles de blog...');
  
  await prisma.blog.deleteMany();
  
  const blogs = await prisma.blog.createMany({
    data: [
      {
        title: 'Comment choisir le bon artisan pour vos travaux ?',
        slug: 'comment-choisir-bon-artisan-travaux',
        excerpt: 'Découvrez nos conseils pratiques pour choisir l\'artisan idéal : certifications, devis, avis clients et plus encore.',
        featuredImage: 'https://images.unsplash.com/photo-1504307652254-4a7505c8b8b3?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1504307652254-4a7505c8b8b3?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['artisan', 'conseils', 'travaux', 'choix'],
        content: `# Comment choisir le bon artisan pour vos travaux ?

Choisir le bon artisan est crucial pour la réussite de vos projets de rénovation ou de construction. Voici nos conseils pour faire le bon choix :

## 1. Vérifiez les certifications et qualifications

Un artisan qualifié doit posséder les certifications appropriées à son domaine :
- **RGE** (Reconnu Garant de l'Environnement) pour les travaux d'efficacité énergétique
- **Qualibat** pour les travaux de bâtiment
- **Qualifelec** pour les travaux électriques
- **EcoArtisan** pour les artisans engagés dans l'écologie

## 2. Demandez plusieurs devis

N'hésitez pas à solliciter au moins 3 devis différents. Cela vous permettra de :
- Comparer les prix
- Évaluer les méthodes de travail proposées
- Vérifier la cohérence des estimations

## 3. Consultez les avis clients

Les témoignages d'anciens clients sont un excellent indicateur de la qualité du travail. Recherchez des avis sur :
- Les plateformes spécialisées
- Les réseaux sociaux
- Le bouche-à-oreille

## 4. Vérifiez l'assurance

Assurez-vous que l'artisan dispose d'une assurance responsabilité civile professionnelle couvrant les travaux qu'il effectue.

## 5. Demandez des références

Un bon artisan n'hésitera pas à vous fournir des références de chantiers similaires au vôtre.

En suivant ces conseils, vous maximisez vos chances de trouver l'artisan idéal pour votre projet !`,
      },
      {
        title: 'Les 10 erreurs à éviter lors d\'une rénovation',
        slug: '10-erreurs-eviter-renovation',
        excerpt: 'Une rénovation mal planifiée peut devenir un cauchemar. Découvrez les erreurs les plus courantes à éviter absolument.',
        featuredImage: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4b5?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4b5?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['rénovation', 'erreurs', 'conseils', 'planification'],
        content: `# Les 10 erreurs à éviter lors d'une rénovation

Une rénovation mal planifiée peut rapidement devenir un cauchemar. Voici les erreurs les plus courantes à éviter :

## 1. Ne pas établir de budget précis

Sans budget clair, vous risquez de dépasser vos moyens financiers. Prévoyez toujours 10 à 20% de marge pour les imprévus.

## 2. Négliger les autorisations

Certains travaux nécessitent des autorisations administratives. Renseignez-vous auprès de votre mairie avant de commencer.

## 3. Choisir les matériaux au hasard

La qualité des matériaux influence directement la durabilité de vos travaux. Privilégiez la qualité à la quantité.

## 4. Ne pas anticiper les délais

Les travaux prennent souvent plus de temps que prévu. Prévoyez des délais réalistes et communiquez avec vos artisans.

## 5. Ignorer l'isolation

Une bonne isolation est essentielle pour le confort et les économies d'énergie. N'hésitez pas à investir dans ce poste.

## 6. Négliger l'éclairage

Un bon éclairage transforme complètement un espace. Pensez à la lumière naturelle et artificielle.

## 7. Oublier les prises électriques

Prévoyez suffisamment de prises et d'interrupteurs selon vos besoins futurs.

## 8. Choisir les couleurs à la hâte

Les couleurs ont un impact psychologique important. Testez-les avant de vous décider.

## 9. Ne pas prévoir de rangement

Le rangement est souvent oublié mais essentiel pour maintenir un espace organisé.

## 10. Faire les travaux soi-même sans compétences

Certains travaux nécessitent des compétences spécifiques. N'hésitez pas à faire appel à des professionnels.

En évitant ces erreurs, vous maximisez vos chances de réussir votre rénovation !`,
      },
      {
        title: 'Guide complet de l\'isolation thermique',
        slug: 'guide-complet-isolation-thermique',
        excerpt: 'Tout ce qu\'il faut savoir sur l\'isolation thermique : matériaux, zones prioritaires, aides financières et choix du professionnel.',
        featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['isolation', 'thermique', 'énergie', 'rénovation'],
        content: `# Guide complet de l'isolation thermique

Une bonne isolation thermique est essentielle pour réduire vos factures d'énergie et améliorer votre confort. Voici tout ce qu'il faut savoir :

## Pourquoi isoler ?

L'isolation thermique permet de :
- Réduire les déperditions de chaleur
- Diminuer la consommation d'énergie
- Améliorer le confort de vie
- Valoriser votre bien immobilier

## Les zones à isoler en priorité

### 1. La toiture (30% des déperditions)
- Isolation des combles perdus
- Isolation sous rampants
- Isolation des murs de pignon

### 2. Les murs (25% des déperditions)
- Isolation par l'intérieur (ITI)
- Isolation par l'extérieur (ITE)
- Isolation des murs creux

### 3. Les fenêtres (15% des déperditions)
- Double ou triple vitrage
- Châssis performants
- Pose de survitrage

### 4. Le sol (10% des déperditions)
- Isolation des planchers bas
- Isolation des caves et sous-sols

## Les matériaux d'isolation

### Matériaux naturels
- **Laine de bois** : excellente régulation hygrométrique
- **Ouate de cellulose** : recyclable et performante
- **Laine de chanvre** : écologique et durable

### Matériaux synthétiques
- **Polystyrène expansé** : économique et efficace
- **Polyuréthane** : très performant mais plus cher
- **Mousse phénolique** : excellente résistance thermique

## Les aides financières

Plusieurs dispositifs peuvent vous aider à financer vos travaux :
- **MaPrimeRénov'** : aide de l'État
- **CEE** : Certificats d'Économies d'Énergie
- **Éco-PTZ** : prêt à taux zéro
- **TVA à 5,5%** : pour certains travaux

## Choisir le bon professionnel

Pour vos travaux d'isolation, privilégiez un artisan :
- Certifié RGE (Reconnu Garant de l'Environnement)
- Spécialisé dans l'isolation
- Capable de vous conseiller sur les matériaux

Une bonne isolation est un investissement rentable à long terme !`,
      },
      {
        title: 'Tendances déco 2024 : les couleurs à adopter',
        slug: 'tendances-deco-2024-couleurs-adopter',
        excerpt: 'Découvrez les palettes de couleurs qui vont marquer 2024 : vert sauge, terracotta, bleu océan et conseils d\'harmonisation.',
        featuredImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['déco', 'couleurs', 'tendances', '2024'],
        content: `# Tendances déco 2024 : les couleurs à adopter

Découvrez les palettes de couleurs qui vont marquer l'année 2024 et transformer vos intérieurs :

## Les couleurs phares de 2024

### 1. Le vert sauge
Cette teinte apaisante apporte sérénité et connexion avec la nature. Parfait pour les chambres et espaces de détente.

### 2. Le terracotta
Cette couleur chaleureuse évoque la terre et l'authenticité. Idéale pour créer une ambiance cosy.

### 3. Le bleu océan
Un bleu profond et apaisant qui rappelle les fonds marins. Parfait pour les salles de bain et espaces zen.

### 4. Le beige rosé
Une couleur douce et moderne qui s'adapte à tous les styles. Excellente base pour vos murs.

## Les tendances par pièce

### Salon
- Murs dans des tons neutres (beige, gris clair)
- Accents colorés sur les textiles et accessoires
- Mobilier aux lignes épurées

### Cuisine
- Blanc cassé pour les meubles
- Dosseret coloré ou en carrelage
- Électroménager intégré

### Chambre
- Couleurs apaisantes (vert sauge, bleu océan)
- Textiles naturels (lin, coton)
- Éclairage doux et tamisé

### Salle de bain
- Carrelage blanc ou gris clair
- Robinetterie dorée ou noire
- Miroirs et accessoires design

## Les associations gagnantes

### Trio gagnant
- **Beige + Vert sauge + Blanc** : nature et sérénité
- **Gris + Terracotta + Noir** : modernité et chaleur
- **Blanc + Bleu océan + Doré** : élégance et fraîcheur

### Contrastes audacieux
- **Noir + Rose poudré** : sophistication
- **Bleu marine + Orange** : énergie et dynamisme
- **Vert foncé + Rouge brique** : caractère et originalité

## Conseils pratiques

### Tester avant de peindre
- Utilisez des échantillons
- Testez sur différentes surfaces
- Observez sous différents éclairages

### Harmoniser les espaces
- Créez une continuité visuelle
- Utilisez des couleurs complémentaires
- Respectez la règle des 60-30-10

### Accessoiriser intelligemment
- Coussins et textiles colorés
- Tableaux et œuvres d'art
- Plantes et éléments naturels

Les couleurs 2024 privilégient le bien-être et la connexion avec la nature. Choisissez celles qui vous ressemblent !`,
      },
      {
        title: 'Économies d\'énergie : 15 gestes simples',
        slug: 'economies-energie-15-gestes-simples',
        excerpt: 'Réduisez votre facture d\'énergie de 20 à 30% avec ces 15 gestes simples : chauffage, éclairage, électroménager et plus.',
        featuredImage: 'https://images.unsplash.com/photo-1548611635-b6e7827aa7f4?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1548611635-b6e7827aa7f4?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['énergie', 'économies', 'écologie', 'conseils'],
        content: `# Économies d'énergie : 15 gestes simples

Réduire sa consommation d'énergie, c'est bon pour la planète et pour le portefeuille ! Voici 15 gestes simples à adopter :

## Chauffage et climatisation

### 1. Réglez votre thermostat
- 19°C dans les pièces à vivre
- 16°C dans les chambres
- Baissez de 1°C = 7% d'économies

### 2. Fermez les volets la nuit
- Évitez les déperditions de chaleur
- Gardez la fraîcheur en été

### 3. Purgez vos radiateurs
- Une fois par an minimum
- Améliore l'efficacité du chauffage

### 4. Utilisez un thermostat programmable
- Adapte la température selon vos habitudes
- Économies automatiques

## Éclairage

### 5. Passez aux LED
- 80% d'économies par rapport aux ampoules classiques
- Durée de vie 10 fois plus longue

### 6. Éteignez les lumières
- Dans les pièces inoccupées
- Installez des détecteurs de mouvement

### 7. Profitez de la lumière naturelle
- Ouvrez les rideaux en journée
- Peignez les murs en couleurs claires

## Électroménager

### 8. Choisissez des appareils A+++
- Plus chers à l'achat mais rentables
- Consommation réduite de 30%

### 9. Lavez à basse température
- 30°C pour le linge peu sale
- 40°C maximum pour le linge normal

### 10. Remplissez vos machines
- Lave-linge et lave-vaisselle pleins
- Évitez les cycles à demi-charge

### 11. Dégivrez votre congélateur
- 3mm de givre = 30% de consommation en plus
- Dégivrage régulier nécessaire

## Eau chaude

### 12. Réduisez la température du chauffe-eau
- 55°C suffisent pour l'usage domestique
- Évitez les risques de brûlure

### 13. Isolez votre ballon d'eau chaude
- Réduit les pertes de chaleur
- Économies immédiates

### 14. Prenez des douches courtes
- 5 minutes maximum
- Fermez l'eau pendant le savonnage

## Autres gestes

### 15. Débranchez les appareils en veille
- Utilisez des multiprises avec interrupteur
- Économies de 10% sur la facture

## Les aides disponibles

- **MaPrimeRénov'** : pour l'isolation et le chauffage
- **Coup de pouce chauffage** : pour remplacer votre chaudière
- **Éco-PTZ** : prêt à taux zéro pour les travaux

Avec ces gestes simples, vous pouvez réduire votre facture d'énergie de 20 à 30% !`,
      },
      // 10 nouveaux articles de blog
      {
        title: 'Rénovation écologique : les matériaux durables',
        slug: 'renovation-ecologique-materiaux-durables',
        excerpt: 'Découvrez les matériaux écologiques pour une rénovation respectueuse de l\'environnement : bois, chanvre, liège et leurs avantages.',
        featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['écologie', 'matériaux', 'durable', 'rénovation'],
        content: `# Rénovation écologique : les matériaux durables

La rénovation écologique est devenue une priorité pour de nombreux propriétaires. Découvrez les matériaux durables qui transforment votre habitat :

## Les matériaux naturels stars

### Le bois
- **Avantages** : renouvelable, isolant, esthétique
- **Utilisations** : charpente, ossature, revêtements
- **Certifications** : PEFC, FSC

### Le chanvre
- **Avantages** : excellent isolant, régulateur d'humidité
- **Utilisations** : isolation, enduits, béton
- **Particularité** : absorbe le CO2 pendant sa croissance

### Le liège
- **Avantages** : isolant phonique et thermique, imputrescible
- **Utilisations** : isolation, revêtements de sol
- **Durabilité** : 50 ans minimum

### La laine de mouton
- **Avantages** : isolant naturel, ignifuge
- **Utilisations** : isolation des combles
- **Particularité** : régule l'humidité

## Les matériaux recyclés

### Le béton recyclé
- **Composition** : granulats de béton concassé
- **Avantages** : réduction des déchets, performance identique
- **Utilisations** : fondations, dalles

### Les briques de terre crue
- **Avantages** : régulation hygrométrique, inertie thermique
- **Utilisations** : murs porteurs, cloisons
- **Particularité** : fabrication locale possible

## Les avantages de l'écoconstruction

### Performance énergétique
- Isolation naturelle efficace
- Réduction des ponts thermiques
- Confort d'été et d'hiver

### Santé et bien-être
- Absence de composés toxiques
- Régulation de l'humidité
- Qualité de l'air intérieur

### Impact environnemental
- Réduction de l'empreinte carbone
- Matériaux renouvelables
- Recyclage en fin de vie

## Les certifications à connaître

- **NF Environnement** : écolabel français
- **Natureplus** : label européen
- **Cradle to Cradle** : économie circulaire

Choisir des matériaux durables, c'est investir dans l'avenir de votre habitat !`,
      },
      {
        title: 'Travaux de plomberie : guide du débutant',
        slug: 'travaux-plomberie-guide-debutant',
        excerpt: 'Apprenez les bases de la plomberie domestique : outils essentiels, réparations courantes et quand faire appel à un professionnel.',
        featuredImage: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4b5?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4b5?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['plomberie', 'bricolage', 'réparation', 'guide'],
        content: `# Travaux de plomberie : guide du débutant

La plomberie peut sembler complexe, mais avec les bonnes connaissances, vous pouvez réaliser de nombreuses réparations vous-même :

## Les outils essentiels

### Outils de base
- **Clé à molette** : pour les raccords
- **Pince multiprise** : polyvalente
- **Tournevis** : différents types
- **Niveau à bulle** : pour l'alignement

### Outils spécialisés
- **Clé à molette à crémaillère** : pour les tuyaux
- **Pince à dénuder** : pour les tuyaux en cuivre
- **Filière** : pour fileter les tuyaux
- **Détecteur de fuites** : électronique

## Les réparations courantes

### Changer un joint de robinet
1. Couper l'arrivée d'eau
2. Démonter le robinet
3. Remplacer le joint
4. Remonter et tester

### Réparer une fuite de chasse d'eau
1. Vider le réservoir
2. Identifier la cause (joint, flotteur)
3. Remplacer la pièce défectueuse
4. Remonter et tester

### Déboucher un évier
1. **Ventouse** : méthode douce
2. **Déboucheur chimique** : attention aux canalisations
3. **Furet** : pour les bouchons tenaces
4. **Démontage** : en dernier recours

## Les matériaux de plomberie

### Tuyaux en cuivre
- **Avantages** : durable, résistant
- **Inconvénients** : cher, installation complexe
- **Utilisations** : eau chaude et froide

### Tuyaux en PER
- **Avantages** : facile à poser, économique
- **Inconvénients** : moins résistant aux UV
- **Utilisations** : eau froide principalement

### Tuyaux multicouches
- **Avantages** : résistant, flexible
- **Inconvénients** : plus cher
- **Utilisations** : eau chaude et froide

## Quand faire appel à un professionnel

### Situations d'urgence
- Fuite importante
- Panne de chauffe-eau
- Canalisation bouchée
- Problème de pression

### Travaux complexes
- Installation complète
- Raccordement au réseau
- Travaux de rénovation
- Mise aux normes

## Les précautions de sécurité

### Avant de commencer
- Couper l'arrivée d'eau générale
- Vider les canalisations
- Aérer la pièce
- Porter des gants

### Pendant les travaux
- Ne pas mélanger les produits chimiques
- Respecter les normes
- Tester après chaque étape
- Garder les outils propres

## Les erreurs à éviter

- **Surcharger les raccords** : risque de fuite
- **Négliger l'étanchéité** : joints et mastics
- **Oublier les vannes d'arrêt** : sécurité
- **Mélanger les matériaux** : incompatibilité

Avec ces bases, vous serez capable de réaliser de nombreuses réparations de plomberie !`,
      },
      {
        title: 'Électricité domestique : sécurité avant tout',
        slug: 'electricite-domestique-securite-avant-tout',
        excerpt: 'Les règles de sécurité en électricité domestique : normes, équipements de protection et bonnes pratiques pour éviter les accidents.',
        featuredImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['électricité', 'sécurité', 'normes', 'protection'],
        content: `# Électricité domestique : sécurité avant tout

L'électricité est un domaine où la sécurité ne doit jamais être négligée. Voici les règles essentielles à respecter :

## Les équipements de protection

### Tableau électrique
- **Disjoncteur différentiel** : protection des personnes
- **Disjoncteurs divisionnaires** : protection des circuits
- **Parafoudre** : protection contre la foudre
- **Interrupteur différentiel** : test mensuel obligatoire

### Prises et interrupteurs
- **Prise de terre** : obligatoire partout
- **Interrupteur différentiel** : 30mA maximum
- **Protection IP** : selon l'environnement
- **Norme NF C 15-100** : respect obligatoire

## Les zones de sécurité

### Salle de bain
- **Zone 0** : dans la baignoire/douche
- **Zone 1** : 60cm autour de la baignoire
- **Zone 2** : 3m autour de la baignoire
- **Protection IP** : IPX4 minimum

### Cuisine
- **Zone humide** : 60cm autour de l'évier
- **Protection IP** : IPX4 minimum
- **Prise 20A** : pour les gros appareils
- **Liaison équipotentielle** : obligatoire

## Les bonnes pratiques

### Avant toute intervention
1. **Couper le courant** au disjoncteur
2. **Vérifier l'absence de tension** avec un testeur
3. **Signaler l'intervention** sur le tableau
4. **Utiliser des outils isolés**

### Pendant les travaux
- **Ne jamais travailler sous tension**
- **Utiliser des outils appropriés**
- **Respecter les codes couleur**
- **Vérifier les connexions**

### Après les travaux
- **Tester l'installation**
- **Vérifier le bon fonctionnement**
- **Mettre à jour le schéma**
- **Informer les occupants**

## Les normes à respecter

### NF C 15-100
- **Règles d'installation**
- **Protection des personnes**
- **Protection des biens**
- **Évolutivité de l'installation**

### RT 2012 / RE 2020
- **Efficacité énergétique**
- **Éclairage performant**
- **Gestion intelligente**
- **Production d'énergie**

## Les situations d'urgence

### Électrocution
1. **Ne pas toucher la victime**
2. **Couper le courant immédiatement**
3. **Appeler les secours (15)**
4. **Pratiquer les gestes de secours**

### Incendie électrique
1. **Couper le courant**
2. **Utiliser un extincteur CO2**
3. **Ne jamais utiliser d'eau**
4. **Évacuer les lieux**

## Les contrôles réguliers

### Vérification mensuelle
- **Test du différentiel**
- **Vérification des prises**
- **Contrôle visuel**
- **Signalement des anomalies**

### Contrôle périodique
- **Tous les 10 ans** : logement
- **Tous les 5 ans** : locaux professionnels
- **Tous les 3 ans** : ERP
- **Par un professionnel qualifié**

## Les erreurs à éviter

- **Travaux sans couper le courant**
- **Mélanger les phases**
- **Négliger la mise à la terre**
- **Utiliser du matériel non conforme**

La sécurité électrique, c'est l'affaire de tous !`,
      },
      {
        title: 'Chauffage : choisir le bon système',
        slug: 'chauffage-choisir-bon-systeme',
        excerpt: 'Comparatif des systèmes de chauffage : gaz, électricité, pompe à chaleur, bois. Avantages, inconvénients et coûts pour faire le bon choix.',
        featuredImage: 'https://images.unsplash.com/photo-1548611635-b6e7827aa7f4?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1548611635-b6e7827aa7f4?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['chauffage', 'énergie', 'comparatif', 'coût'],
        content: `# Chauffage : choisir le bon système

Le choix du système de chauffage est crucial pour votre confort et vos économies. Voici un comparatif détaillé :

## Les systèmes de chauffage

### Chauffage au gaz
**Avantages :**
- Coût d'achat modéré
- Installation simple
- Confort de chauffe
- Disponibilité du réseau

**Inconvénients :**
- Dépendance au prix du gaz
- Émissions de CO2
- Nécessite une évacuation
- Maintenance annuelle

**Coût :** 8 000 à 15 000 €

### Chauffage électrique
**Avantages :**
- Installation simple
- Pas d'évacuation
- Contrôle précis
- Entretien minimal

**Inconvénients :**
- Coût de fonctionnement élevé
- Inertie thermique
- Dépendance au réseau
- Impact environnemental

**Coût :** 3 000 à 8 000 €

### Pompe à chaleur
**Avantages :**
- Très efficace (COP 3-4)
- Énergie renouvelable
- Fraîcheur en été
- Aides financières

**Inconvénients :**
- Coût d'achat élevé
- Nécessite un jardin
- Bruit extérieur
- Maintenance spécialisée

**Coût :** 15 000 à 25 000 €

### Chauffage au bois
**Avantages :**
- Énergie renouvelable
- Coût du combustible faible
- Ambiance chaleureuse
- Indépendance énergétique

**Inconvénients :**
- Stockage du bois
- Manutention
- Entretien régulier
- Émissions de particules

**Coût :** 5 000 à 12 000 €

## Les critères de choix

### Surface à chauffer
- **< 50 m²** : électrique, gaz
- **50-100 m²** : gaz, PAC
- **> 100 m²** : PAC, bois

### Isolation
- **Bien isolé** : tous les systèmes
- **Mal isolé** : éviter l'électrique
- **Très mal isolé** : isoler d'abord

### Budget
- **Faible** : électrique, gaz
- **Moyen** : gaz, bois
- **Élevé** : PAC, géothermie

### Environnement
- **Urbain** : gaz, PAC
- **Rural** : bois, PAC
- **Montagne** : bois, PAC

## Les aides financières

### MaPrimeRénov'
- **Pompe à chaleur** : jusqu'à 4 000 €
- **Chaudière gaz** : jusqu'à 1 200 €
- **Poêle à bois** : jusqu'à 2 000 €

### Coup de pouce chauffage
- **Remplacement chaudière** : jusqu'à 4 000 €
- **Pompe à chaleur** : jusqu'à 4 000 €

### Éco-PTZ
- **Prêt à taux zéro** : jusqu'à 30 000 €
- **Travaux d'efficacité énergétique**
- **Remboursement sur 15 ans**

## Les calculs de rentabilité

### Coût d'installation
- Achat du système
- Installation
- Aides déduites
- Coût réel

### Coût de fonctionnement
- Consommation annuelle
- Prix de l'énergie
- Maintenance
- Coût total

### Temps de retour
- Investissement initial
- Économies annuelles
- Calcul du ROI
- Comparaison des systèmes

## Les tendances 2024

### Électrification
- **Pompe à chaleur** : solution d'avenir
- **Réseau électrique** : renforcement
- **Smart grid** : gestion intelligente

### Écologie
- **Énergies renouvelables** : priorité
- **Bilan carbone** : prise en compte
- **Réglementation** : évolution

### Confort
- **Régulation intelligente** : domotique
- **Confort d'été** : rafraîchissement
- **Qualité de l'air** : ventilation

Choisir son chauffage, c'est anticiper l'avenir !`,
      },
      {
        title: 'Rénovation de salle de bain : les étapes clés',
        slug: 'renovation-salle-bain-etapes-cles',
        excerpt: 'Guide complet pour rénover votre salle de bain : planification, choix des matériaux, étapes de travaux et conseils pratiques.',
        featuredImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['salle de bain', 'rénovation', 'travaux', 'guide'],
        content: `# Rénovation de salle de bain : les étapes clés

Une rénovation de salle de bain bien planifiée transforme votre quotidien. Voici les étapes essentielles :

## La phase de planification

### Définir vos besoins
- **Surface disponible** : optimisation de l'espace
- **Nombre d'utilisateurs** : fonctionnalités nécessaires
- **Budget** : réaliste et cohérent
- **Délais** : planification des travaux

### Établir le plan
- **Cotation** : mesures précises
- **Implantation** : position des équipements
- **Évacuations** : respect des pentes
- **Arrivées d'eau** : position optimale

### Choisir le style
- **Moderne** : lignes épurées, couleurs neutres
- **Classique** : matériaux nobles, finitions soignées
- **Rustique** : matériaux naturels, ambiance chaleureuse
- **Minimaliste** : fonctionnalité, simplicité

## Le choix des matériaux

### Carrelage
- **Grès cérame** : résistant, facile d'entretien
- **Carrelage pâte blanche** : esthétique, fragile
- **Mosaïque** : décorative, délicate
- **Carrelage imitation bois** : chaleureux, pratique

### Sanitaires
- **Lavabo** : suspendu, posé, encastré
- **Baignoire** : droite, d'angle, balnéo
- **Douche** : à l'italienne, receveur, cabine
- **WC** : suspendu, posé, bidet

### Robinetterie
- **Chrome** : classique, facile d'entretien
- **Noir** : moderne, tendance
- **Doré** : luxueux, délicat
- **Mat** : épuré, contemporain

## Les étapes de travaux

### Démolition
1. **Protection** des autres pièces
2. **Démontage** des équipements
3. **Dépose** des revêtements
4. **Évacuation** des déchets

### Gros œuvre
1. **Modification** des cloisons
2. **Création** des ouvertures
3. **Renforcement** des structures
4. **Préparation** des supports

### Plomberie
1. **Modification** des arrivées d'eau
2. **Installation** des évacuations
3. **Pose** des équipements
4. **Tests** d'étanchéité

### Électricité
1. **Installation** des prises
2. **Pose** des interrupteurs
3. **Éclairage** adapté
4. **Mise à la terre**

### Finitions
1. **Carrelage** des murs et sols
2. **Pose** des sanitaires
3. **Installation** de la robinetterie
4. **Mise en service**

## Les normes à respecter

### Électricité
- **Zone 0** : dans la baignoire/douche
- **Zone 1** : 60cm autour de la baignoire
- **Zone 2** : 3m autour de la baignoire
- **Protection IP** : IPX4 minimum

### Plomberie
- **Pente d'évacuation** : 2cm/m minimum
- **Diamètre des tuyaux** : selon le débit
- **Ventilation** : évacuation des odeurs
- **Étanchéité** : tests obligatoires

### Accessibilité
- **Largeur de porte** : 80cm minimum
- **Espace de manœuvre** : 150cm de diamètre
- **Hauteur des équipements** : selon les normes
- **Poignées** : ergonomiques

## Les erreurs à éviter

### Planification
- **Négliger les évacuations** : pentes insuffisantes
- **Oublier la ventilation** : humidité excessive
- **Sous-estimer le budget** : 20% de marge
- **Négliger les délais** : planification réaliste

### Travaux
- **Travaux dans le désordre** : respecter les étapes
- **Négliger l'étanchéité** : fuites coûteuses
- **Oublier les tests** : mise en service
- **Négliger la finition** : détails importants

## Les conseils pratiques

### Budget
- **Établir un devis détaillé** : poste par poste
- **Prévoir 20% de marge** : imprévus
- **Comparer plusieurs devis** : 3 minimum
- **Négocier les prix** : possible

### Délais
- **Planifier les travaux** : étapes chronologiques
- **Coordonner les artisans** : planning
- **Anticiper les imprévus** : délais supplémentaires
- **Communiquer** : suivi régulier

### Qualité
- **Choisir des matériaux** : qualité/prix
- **Vérifier les certifications** : normes
- **Contrôler les travaux** : régularité
- **Tester les installations** : fonctionnement

Une salle de bain réussie, c'est une question de planification !`,
      },
      {
        title: 'Isolation phonique : silence, on isole !',
        slug: 'isolation-phonique-silence-on-isole',
        excerpt: 'Les solutions d\'isolation phonique pour réduire les nuisances sonores : matériaux, techniques et réglementation acoustique.',
        featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['isolation', 'phonique', 'bruit', 'confort'],
        content: `# Isolation phonique : silence, on isole !

L'isolation phonique est essentielle pour le confort de vie. Découvrez les solutions pour réduire les nuisances sonores :

## Les types de bruit

### Bruit aérien
- **Voix, musique** : transmission par l'air
- **Solutions** : isolation des murs, plafonds
- **Matériaux** : laine de verre, mousse
- **Techniques** : doublage, faux plafonds

### Bruit d'impact
- **Pas, chutes** : transmission par les structures
- **Solutions** : isolation des sols
- **Matériaux** : sous-couches, moquettes
- **Techniques** : chapes flottantes

### Bruit d'équipement
- **VMC, chauffage** : vibrations mécaniques
- **Solutions** : isolation des équipements
- **Matériaux** : plots antivibratoires
- **Techniques** : suspension, découplage

## Les matériaux d'isolation phonique

### Laine de verre
- **Avantages** : économique, efficace
- **Inconvénients** : irritant, fragile
- **Utilisations** : murs, plafonds
- **Performance** : Rw 40-50 dB

### Laine de roche
- **Avantages** : résistant au feu, durable
- **Inconvénients** : plus cher
- **Utilisations** : murs, plafonds
- **Performance** : Rw 45-55 dB

### Mousse polyuréthane
- **Avantages** : très efficace, compact
- **Inconvénients** : cher, toxique
- **Utilisations** : murs, plafonds
- **Performance** : Rw 50-60 dB

### Laine de chanvre
- **Avantages** : écologique, régulateur
- **Inconvénients** : performance moyenne
- **Utilisations** : murs, plafonds
- **Performance** : Rw 35-45 dB

## Les techniques d'isolation

### Doublage des murs
1. **Pose de rails** : métalliques
2. **Isolation** : laine de verre
3. **Pare-vapeur** : protection
4. **Plaque de plâtre** : finition

### Faux plafonds
1. **Suspension** : rails métalliques
2. **Isolation** : laine de verre
3. **Plaques** : plâtre ou minérales
4. **Finitions** : peinture, enduit

### Chapes flottantes
1. **Isolation** : sous-couche
2. **Chape** : béton ou anhydrite
3. **Découplage** : joints périphériques
4. **Revêtement** : carrelage, parquet

## Les zones prioritaires

### Entre logements
- **Murs mitoyens** : isolation renforcée
- **Plafonds** : faux plafonds
- **Sols** : chapes flottantes
- **Portes** : étanchéité acoustique

### Intérieur du logement
- **Salle de bain** : isolation des équipements
- **Chambre** : isolation des murs
- **Bureau** : isolation des bruits extérieurs
- **Cuisine** : isolation des équipements

### Extérieur
- **Fenêtres** : double vitrage
- **Portes** : étanchéité
- **Murs** : isolation extérieure
- **Toiture** : isolation des combles

## La réglementation acoustique

### Nouvelles constructions
- **Niveau sonore** : 35 dB maximum
- **Isolement** : 53 dB minimum
- **Équipements** : 30 dB maximum
- **Contrôles** : obligatoires

### Rénovations
- **Amélioration** : 3 dB minimum
- **Vérification** : par un acousticien
- **Conformité** : aux normes
- **Aides** : possibles

## Les aides financières

### MaPrimeRénov'
- **Isolation phonique** : jusqu'à 2 000 €
- **Travaux combinés** : bonus
- **Résidence principale** : obligatoire
- **Artisan RGE** : nécessaire

### CEE
- **Certificats d'économie d'énergie**
- **Isolation phonique** : éligible
- **Cumulable** : avec MaPrimeRénov'
- **Montant** : selon les travaux

## Les conseils pratiques

### Avant les travaux
- **Diagnostic acoustique** : par un professionnel
- **Choix des matériaux** : selon les besoins
- **Planification** : étapes chronologiques
- **Budget** : prévoir les imprévus

### Pendant les travaux
- **Respect des techniques** : pose correcte
- **Contrôle qualité** : régularité
- **Tests d'étanchéité** : vérifications
- **Finitions** : détails importants

### Après les travaux
- **Tests acoustiques** : vérification
- **Mise en service** : fonctionnement
- **Entretien** : maintenance
- **Satisfaction** : confort

Le silence, c'est le luxe du confort !`,
      },
      {
        title: 'Travaux de peinture : techniques et conseils',
        slug: 'travaux-peinture-techniques-conseils',
        excerpt: 'Guide complet de la peinture : préparation des supports, choix des produits, techniques de pose et finitions pour un résultat parfait.',
        featuredImage: 'https://images.unsplash.com/photo-1521799022345-481a897e45ca?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1521799022345-481a897e45ca?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['peinture', 'techniques', 'conseils', 'finitions'],
        content: `# Travaux de peinture : techniques et conseils

La peinture transforme un espace. Voici les techniques et conseils pour un résultat professionnel :

## La préparation des supports

### Nettoyage
1. **Dépoussiérage** : chiffon humide
2. **Dégraissage** : produit adapté
3. **Nettoyage** : eau savonneuse
4. **Rinçage** : eau claire

### Réparation
1. **Rebouchage** : enduits de rebouchage
2. **Ponçage** : papier abrasif
3. **Nettoyage** : dépoussiérage
4. **Primaire** : si nécessaire

### Protection
1. **Masquage** : adhésif de masquage
2. **Bâches** : protection du sol
3. **Outils** : pinceaux, rouleaux
4. **Ventilation** : aération

## Les types de peinture

### Peinture acrylique
- **Avantages** : facile à poser, sèche rapidement
- **Inconvénients** : moins résistante
- **Utilisations** : intérieur, murs
- **Dilution** : à l'eau

### Peinture glycérophtalique
- **Avantages** : très résistante, brillant
- **Inconvénients** : odeur forte, séchage lent
- **Utilisations** : extérieur, métaux
- **Dilution** : white spirit

### Peinture à la chaux
- **Avantages** : naturelle, respirante
- **Inconvénients** : application délicate
- **Utilisations** : murs anciens
- **Dilution** : à l'eau

### Peinture au silicate
- **Avantages** : très résistante, minérale
- **Inconvénients** : application complexe
- **Utilisations** : façades, murs
- **Dilution** : à l'eau

## Les techniques de pose

### Au pinceau
- **Avantages** : précision, finitions
- **Inconvénients** : plus lent
- **Utilisations** : angles, détails
- **Technique** : couches croisées

### Au rouleau
- **Avantages** : rapide, uniforme
- **Inconvénients** : moins précis
- **Utilisations** : grandes surfaces
- **Technique** : mouvements en W

### Au pistolet
- **Avantages** : très rapide, uniforme
- **Inconvénients** : équipement coûteux
- **Utilisations** : grandes surfaces
- **Technique** : couches fines

## Les finitions

### Mat
- **Avantages** : cache les défauts
- **Inconvénients** : moins résistant
- **Utilisations** : chambres, salons
- **Entretien** : délicat

### Satin
- **Avantages** : résistant, esthétique
- **Inconvénients** : révèle les défauts
- **Utilisations** : cuisines, salles de bain
- **Entretien** : facile

### Brillant
- **Avantages** : très résistant
- **Inconvénients** : révèle tous les défauts
- **Utilisations** : portes, boiseries
- **Entretien** : très facile

## Les erreurs à éviter

### Préparation
- **Négliger le nettoyage** : adhérence
- **Oublier le primaire** : sur supports absorbants
- **Mal masquer** : finitions
- **Négliger la ventilation** : sécurité

### Application
- **Trop d'épaisseur** : coulures
- **Séchage insuffisant** : entre les couches
- **Mélange de produits** : incompatibilité
- **Conditions météo** : humidité, température

### Finitions
- **Négliger les détails** : angles, bords
- **Oublier le nettoyage** : outils
- **Retirer le masquage** : trop tôt
- **Négliger l'entretien** : durabilité

## Les conseils pratiques

### Choix des couleurs
- **Échantillons** : tester avant
- **Éclairage** : naturel et artificiel
- **Harmonie** : avec le mobilier
- **Tendances** : mais intemporel

### Budget
- **Calculer la surface** : précision
- **Prévoir les pertes** : 10% de marge
- **Qualité** : investissement
- **Outils** : réutilisables

### Délais
- **Planification** : étapes
- **Séchage** : respecter les temps
- **Météo** : conditions optimales
- **Disponibilité** : temps nécessaire

## Les tendances 2024

### Couleurs
- **Vert sauge** : apaisant
- **Terracotta** : chaleureux
- **Bleu océan** : apaisant
- **Beige rosé** : doux

### Techniques
- **Effets** : matières, textures
- **Dégradés** : transitions douces
- **Motifs** : géométriques
- **Métallisé** : accents

### Écologie
- **Peintures naturelles** : sans COV
- **Recyclage** : emballages
- **Durabilité** : qualité
- **Santé** : composants

La peinture, c'est l'art de transformer l'espace !`,
      },
      {
        title: 'Rénovation de cuisine : optimiser l\'espace',
        slug: 'renovation-cuisine-optimiser-espace',
        excerpt: 'Concevoir une cuisine fonctionnelle et esthétique : agencement, choix des équipements, éclairage et solutions de rangement.',
        featuredImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['cuisine', 'rénovation', 'agencement', 'fonctionnel'],
        content: `# Rénovation de cuisine : optimiser l'espace

Une cuisine bien conçue améliore le quotidien. Voici les clés pour optimiser l'espace et la fonctionnalité :

## Les agencements de base

### Cuisine en ligne
- **Avantages** : économique, compact
- **Inconvénients** : moins fonctionnel
- **Utilisations** : petites surfaces
- **Longueur** : 3m minimum

### Cuisine en L
- **Avantages** : fonctionnel, économe
- **Inconvénients** : angles morts
- **Utilisations** : surfaces moyennes
- **Longueur** : 4m minimum

### Cuisine en U
- **Avantages** : très fonctionnel
- **Inconvénients** : plus cher
- **Utilisations** : grandes surfaces
- **Longueur** : 6m minimum

### Cuisine en îlot
- **Avantages** : conviviale, moderne
- **Inconvénients** : nécessite de l'espace
- **Utilisations** : grandes surfaces
- **Surface** : 20m² minimum

## Le triangle d'activité

### Principe
- **Évier** : point central
- **Réfrigérateur** : stockage
- **Plaque de cuisson** : préparation
- **Distance** : 1,20m maximum

### Optimisation
- **Trajets courts** : efficacité
- **Pas d'obstacles** : circulation
- **Éclairage** : chaque zone
- **Ventilation** : évacuation

## Les zones fonctionnelles

### Zone de stockage
- **Réfrigérateur** : produits frais
- **Congélateur** : produits surgelés
- **Rangements** : conserves, épices
- **Accessibilité** : hauteur optimale

### Zone de préparation
- **Plan de travail** : 60cm minimum
- **Évier** : large et profond
- **Robinetterie** : mitigeur
- **Éclairage** : direct

### Zone de cuisson
- **Plaque de cuisson** : induction, gaz
- **Four** : encastré, indépendant
- **Hotte** : extraction efficace
- **Sécurité** : détecteurs

### Zone de service
- **Lave-vaisselle** : intégré
- **Poubelles** : tri sélectif
- **Linge** : machine à laver
- **Rangement** : produits d'entretien

## Les équipements essentiels

### Électroménager
- **Réfrigérateur** : A+++, 200L minimum
- **Lave-vaisselle** : 12 couverts
- **Four** : multifonctions
- **Micro-ondes** : combiné

### Robinetterie
- **Mitigeur** : thermostatique
- **Évier** : inox, granit
- **Dosseret** : carrelage, inox
- **Éclairage** : LED

### Rangements
- **Meubles hauts** : jusqu'au plafond
- **Tiroirs** : profonds, organisés
- **Étagères** : accessibles
- **Coffres** : rangement

## Les matériaux

### Meubles
- **Mélaminé** : économique, résistant
- **Stratifié** : esthétique, durable
- **Bois massif** : noble, chaleureux
- **Inox** : moderne, hygiénique

### Plans de travail
- **Granit** : résistant, esthétique
- **Quartz** : uniforme, coloré
- **Bois** : chaleureux, délicat
- **Inox** : moderne, hygiénique

### Sols
- **Carrelage** : résistant, facile
- **Vinyle** : confortable, coloré
- **Parquet** : chaleureux, délicat
- **Résine** : moderne, uniforme

## L'éclairage

### Éclairage général
- **Plafonnier** : lumière diffuse
- **LED** : économique, durable
- **Dimmable** : intensité variable
- **Couleur** : blanc chaud

### Éclairage de travail
- **Sous meubles** : éclairage direct
- **LED** : économique, efficace
- **Interrupteur** : indépendant
- **Position** : au-dessus du plan

### Éclairage d'ambiance
- **Spots** : directionnels
- **Appliques** : décoratives
- **LED** : colorées
- **Dimmable** : ambiance

## Les solutions de rangement

### Meubles hauts
- **Portes** : battantes, coulissantes
- **Intérieur** : étagères, tiroirs
- **Hauteur** : accessible
- **Éclairage** : intégré

### Meubles bas
- **Tiroirs** : profonds, organisés
- **Portes** : battantes, coulissantes
- **Intérieur** : étagères, paniers
- **Organisation** : par zones

### Accessoires
- **Paniers** : tiroirs, portes
- **Étagères** : réglables
- **Crochets** : muraux
- **Organiseurs** : tiroirs

## Les tendances 2024

### Design
- **Lignes épurées** : minimalisme
- **Couleurs neutres** : beige, gris
- **Matériaux naturels** : bois, pierre
- **Finitions** : mat, satin

### Technologie
- **Électroménager connecté** : domotique
- **Éclairage intelligent** : LED
- **Robinetterie** : électronique
- **Sécurité** : détecteurs

### Écologie
- **Matériaux recyclés** : durables
- **Énergie** : A+++
- **Eau** : économies
- **Déchets** : tri

## Les erreurs à éviter

### Planification
- **Négliger les mesures** : précision
- **Oublier les évacuations** : plomberie
- **Négliger l'éclairage** : fonctionnel
- **Sous-estimer le budget** : 20% de marge

### Travaux
- **Travaux dans le désordre** : étapes
- **Négliger la ventilation** : humidité
- **Oublier les prises** : électriques
- **Négliger la finition** : détails

Une cuisine réussie, c'est une cuisine qui vous ressemble !`,
      },
      {
        title: 'Travaux de toiture : prévention et réparation',
        slug: 'travaux-toiture-prevention-reparation',
        excerpt: 'Entretenir et réparer sa toiture : inspection, détection des problèmes, choix des matériaux et techniques de réparation.',
        featuredImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['toiture', 'entretien', 'réparation', 'prévention'],
        content: `# Travaux de toiture : prévention et réparation

La toiture protège votre habitation. Voici comment l'entretenir et la réparer :

## L'inspection régulière

### Fréquence
- **Inspection visuelle** : 2 fois par an
- **Inspection détaillée** : 1 fois par an
- **Après intempéries** : immédiate
- **Avant l'hiver** : obligatoire

### Points de contrôle
- **Tuiles** : cassées, déplacées
- **Gouttières** : bouchées, détachées
- **Cheminées** : joints, briques
- **Ventilation** : aérateurs, sorties

### Signes d'alerte
- **Fuite d'eau** : taches, moisissures
- **Bruit** : tuiles qui bougent
- **Ventilation** : condensation
- **Isolation** : dégradation

## Les matériaux de couverture

### Tuiles en terre cuite
- **Avantages** : durable, esthétique
- **Inconvénients** : lourd, fragile
- **Durée de vie** : 50-100 ans
- **Entretien** : minimal

### Tuiles en béton
- **Avantages** : économique, résistant
- **Inconvénients** : moins esthétique
- **Durée de vie** : 30-50 ans
- **Entretien** : régulier

### Ardoises
- **Avantages** : très durable, esthétique
- **Inconvénients** : cher, lourd
- **Durée de vie** : 100-200 ans
- **Entretien** : spécialisé

### Tôles
- **Avantages** : léger, économique
- **Inconvénients** : bruit, rouille
- **Durée de vie** : 20-30 ans
- **Entretien** : régulier

## Les problèmes courants

### Fuites
- **Causes** : tuiles cassées, joints
- **Détection** : taches, moisissures
- **Réparation** : remplacement, jointoiement
- **Prévention** : inspection régulière

### Ventilation
- **Problèmes** : condensation, moisissures
- **Solutions** : aérateurs, sorties
- **Installation** : par un professionnel
- **Entretien** : nettoyage régulier

### Isolation
- **Dégradation** : performance
- **Solutions** : renforcement, remplacement
- **Matériaux** : laine de verre, mousse
- **Installation** : par un professionnel

## Les techniques de réparation

### Remplacement de tuiles
1. **Démontage** : tuiles cassées
2. **Nettoyage** : support
3. **Pose** : nouvelles tuiles
4. **Fixation** : clous, crochets

### Réparation de joints
1. **Nettoyage** : joints dégradés
2. **Préparation** : support
3. **Application** : mortier, mastic
4. **Finition** : lissage

### Réparation de gouttières
1. **Nettoyage** : débris, mousse
2. **Réparation** : trous, fissures
3. **Remontage** : fixations
4. **Test** : étanchéité

## La prévention

### Entretien régulier
- **Nettoyage** : gouttières, évacuations
- **Vérification** : fixations, joints
- **Réparation** : petites interventions
- **Surveillance** : après intempéries

### Amélioration
- **Ventilation** : aérateurs
- **Isolation** : renforcement
- **Étanchéité** : joints
- **Sécurité** : garde-corps

### Protection
- **Écrans** : sous-toiture
- **Étanchéité** : membranes
- **Ventilation** : lames d'air
- **Isolation** : laine de verre

## Les aides financières

### MaPrimeRénov'
- **Isolation** : jusqu'à 4 000 €
- **Ventilation** : jusqu'à 2 000 €
- **Étanchéité** : jusqu'à 1 500 €
- **Conditions** : artisan RGE

### CEE
- **Certificats d'économie d'énergie**
- **Isolation** : éligible
- **Cumulable** : avec MaPrimeRénov'
- **Montant** : selon les travaux

### Éco-PTZ
- **Prêt à taux zéro** : jusqu'à 30 000 €
- **Travaux d'efficacité énergétique**
- **Remboursement** : sur 15 ans
- **Conditions** : résidence principale

## Les conseils pratiques

### Avant les travaux
- **Devis détaillé** : plusieurs artisans
- **Vérification** : assurances, garanties
- **Planification** : météo, délais
- **Budget** : prévoir les imprévus

### Pendant les travaux
- **Sécurité** : équipements, formation
- **Qualité** : matériaux, pose
- **Contrôle** : régularité
- **Communication** : suivi

### Après les travaux
- **Réception** : vérification
- **Garanties** : documents
- **Entretien** : conseils
- **Surveillance** : régularité

## Les erreurs à éviter

### Négligence
- **Inspection** : régularité
- **Entretien** : prévention
- **Réparation** : rapidité
- **Surveillance** : vigilance

### Travaux
- **Matériaux** : qualité
- **Pose** : techniques
- **Sécurité** : équipements
- **Finitions** : détails

Une toiture bien entretenue, c'est la garantie de votre tranquillité !`,
      },
      {
        title: 'Rénovation énergétique : les aides 2024',
        slug: 'renovation-energetique-aides-2024',
        excerpt: 'Guide complet des aides financières pour la rénovation énergétique : MaPrimeRénov\', CEE, Éco-PTZ et nouvelles mesures 2024.',
        featuredImage: 'https://images.unsplash.com/photo-1548611635-b6e7827aa7f4?fm=jpg&q=80&w=1200',
        previewImage: 'https://images.unsplash.com/photo-1548611635-b6e7827aa7f4?fm=jpg&q=80&w=600',
        author: 'Équipe D-Via',
        tags: ['aides', 'rénovation', 'énergie', '2024'],
        content: `# Rénovation énergétique : les aides 2024

Les aides financières évoluent en 2024. Voici le guide complet pour optimiser vos travaux :

## MaPrimeRénov' 2024

### Nouveautés
- **Montants revalorisés** : +10% en moyenne
- **Critères élargis** : plus de ménages éligibles
- **Travaux combinés** : bonus renforcé
- **Délais** : raccourcis

### Montants par travaux
- **Isolation toiture** : jusqu'à 4 000 €
- **Isolation murs** : jusqu'à 3 000 €
- **Isolation sols** : jusqu'à 2 000 €
- **Chauffage** : jusqu'à 4 000 €
- **Ventilation** : jusqu'à 2 000 €

### Conditions d'éligibilité
- **Résidence principale** : obligatoire
- **Ancienneté** : 15 ans minimum
- **Artisan RGE** : nécessaire
- **Revenus** : plafonds revalorisés

## Coup de pouce chauffage

### Nouveautés 2024
- **Montants augmentés** : +15%
- **Équipements éligibles** : élargis
- **Cumul** : avec MaPrimeRénov'
- **Délais** : accélérés

### Montants
- **Pompe à chaleur** : jusqu'à 4 000 €
- **Chaudière gaz** : jusqu'à 2 000 €
- **Chaudière bois** : jusqu'à 3 000 €
- **Système solaire** : jusqu'à 4 000 €

### Conditions
- **Remplacement** : chaudière ancienne
- **Performance** : critères techniques
- **Artisan** : qualifié
- **Installation** : aux normes

## Éco-PTZ 2024

### Évolutions
- **Montant** : jusqu'à 30 000 €
- **Durée** : 15 ans maximum
- **Taux** : 0% garanti
- **Travaux** : élargis

### Travaux éligibles
- **Isolation** : toiture, murs, sols
- **Chauffage** : pompe à chaleur
- **Ventilation** : VMC double flux
- **Éclairage** : LED

### Conditions
- **Résidence principale** : obligatoire
- **Ancienneté** : 15 ans minimum
- **Performance** : critères techniques
- **Artisan** : RGE

## Les nouvelles aides 2024

### Prime à la conversion
- **Véhicules** : électriques, hybrides
- **Montant** : jusqu'à 5 000 €
- **Conditions** : revenus, ancienneté
- **Cumul** : avec autres aides

### Aide à la rénovation
- **Montant** : jusqu'à 2 000 €
- **Travaux** : amélioration énergétique
- **Conditions** : revenus modestes
- **Cumul** : avec MaPrimeRénov'

### Prime à la performance
- **Montant** : jusqu'à 1 500 €
- **Travaux** : performance énergétique
- **Conditions** : critères techniques
- **Cumul** : avec autres aides

## Les cumuls possibles

### MaPrimeRénov' + CEE
- **Cumul** : possible
- **Montant total** : jusqu'à 8 000 €
- **Conditions** : respect des critères
- **Délais** : respecter les échéances

### Éco-PTZ + MaPrimeRénov'
- **Cumul** : possible
- **Montant total** : jusqu'à 34 000 €
- **Conditions** : respect des critères
- **Délais** : respecter les échéances

### Aides locales
- **Régions** : complémentaires
- **Départements** : spécifiques
- **Communes** : locales
- **Cumul** : avec aides nationales

## Les démarches

### Avant les travaux
1. **Étude** : faisabilité, coûts
2. **Devis** : plusieurs artisans
3. **Demande** : aides financières
4. **Validation** : éligibilité

### Pendant les travaux
1. **Suivi** : qualité, délais
2. **Contrôle** : respect des normes
3. **Documentation** : factures, attestations
4. **Communication** : avec les organismes

### Après les travaux
1. **Réception** : vérification
2. **Dossier** : complet
3. **Demande** : remboursement
4. **Suivi** : versements

## Les erreurs à éviter

### Dossier
- **Incomplet** : pièces manquantes
- **Erreurs** : informations incorrectes
- **Délais** : dépassement
- **Critères** : non respectés

### Travaux
- **Artisan** : non qualifié
- **Matériaux** : non conformes
- **Pose** : non aux normes
- **Contrôle** : insuffisant

### Suivi
- **Communication** : insuffisante
- **Documentation** : incomplète
- **Délais** : non respectés
- **Qualité** : insuffisante

## Les conseils pratiques

### Optimisation
- **Cumul** : maximiser les aides
- **Délais** : respecter les échéances
- **Qualité** : choisir les bons artisans
- **Suivi** : régularité

### Budget
- **Prévision** : réaliste
- **Marge** : 20% d'imprévus
- **Aides** : déduites
- **Coût réel** : calculé

### Délais
- **Planification** : étapes
- **Démarches** : anticipées
- **Travaux** : chronologiques
- **Suivi** : régularité

Les aides 2024, c'est l'occasion de rénover à moindre coût !`,
      }
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${blogs.count} articles de blog créés avec succès !`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
