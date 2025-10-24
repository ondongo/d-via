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
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
