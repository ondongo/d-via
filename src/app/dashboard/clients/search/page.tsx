import { ArtisanCard } from "@/components/molecules/dashboard/ArtisanCard";
import InputAddress from "@/components/molecules/dashboard/InputAddress";
import React from "react";

function page() {
  const artisans = [
    {
      image:
        "https://plus.unsplash.com/premium_photo-1663100790655-a9a79e9b2d7e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8",
      rating: 4.8,
      reviews: 214,
      verified: true,
      location: "Paris, 75011",
      distance: "5km",
      availability: "Disponible dans 2 semaines",
      certifications: ["RGE", "Qualibat"],
    },
    {
      image:
        "https://img.freepik.com/photos-gratuite/portrait-jeune-femme-noire-professionnelle-ingenieur-civil-architecture-ouvriere-portant-casque-securite-pour-travailler-chantier-construction-entrepot-utilisant-ordinateur-portable-pour-travail_640221-430.jpg?semt=ais_hybrid&w=740",
      rating: 4.5,
      reviews: 120,
      verified: false,
      location: "Toulouse, 31000",
      distance: "6km",
      availability: "Disponible dans 1 mois",
      certifications: ["Qualifelec"],
    },

    {
      image:
        "https://images.unsplash.com/photo-1743222270396-703376b47d58?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tbWUlMjBjaGFudGllcnxlbnwwfHwwfHx8MA%3D%3D",
      rating: 4.6,
      reviews: 180,
      verified: false,
      location: "Lyon, 69003",
      distance: "12km",
      availability: "Disponible la semaine prochaine",
      certifications: ["RGE"],
    },
    {
      image:
        "https://images.unsplash.com/photo-1521799022345-481a897e45ca?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXJ0aXNhbnxlbnwwfHwwfHx8MA%3D%3D",
      rating: 4.9,
      reviews: 300,
      verified: true,
      location: "Marseille, 13006",
      distance: "8km",
      availability: "Disponible immédiatement",
      certifications: ["Qualibat", "EcoArtisan"],
    },

    {
      image:
        "https://plus.unsplash.com/premium_photo-1681989486976-9ec9d2eac57a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29uc3RydWN0aW9ufGVufDB8fDB8fHww",
      rating: 4.7,
      reviews: 150,
      verified: true,
      location: "Nice, 06000",
      distance: "3km",
      availability: "Disponible dans 3 jours",
      certifications: ["RGE"],
    },
  ];
  return (
    <div className="min-h-screen p-4  md:p-6 w-full">
      <div className="flex w-full items-center mb-6 gap-4">
        <div className="w-full max-w-[350px]  border px-4 py-3 flex items-center gap-2 rounded-8px border-dvianeutral-50  bg-dvianeutral-94">
          <img src="/dashboard/card/search.svg" alt="loc" className="w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par nom ou métier..."
            className="flex-1 text-sm  text-dvianeutralvariant-30 outline-none placeholder:dvianeutralvariant-30 placeholder:text-sm placeholder:font-normal"
          />
        </div>

        <div className="hidden md:flex flex-row justify-center items-center">
          <p className="text-dvianeutralvariant-30 text-[16px] font-normal">
            Catégorie :
          </p>
          <div className="relative w-fit">
            <select className="appearance-none ml-4 p-3 pr-10 px-4 rounded-8px border border-dvianeutral-50 bg-dvianeutral-94   focus:outline-none focus:border-dvianeutral-40 text-dvianeutralvariant-30 text-sm font-normal cursor-pointer">
              <option>Tous les métiers</option>
            </select>
            <img
              src="/dashboard/card/select.svg"
              alt="flèche"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3"
            />
          </div>
        </div>

        <button className="border border-dvianeutral-50 bg-dvianeutral-94 text-sm px-4 py-3 rounded-8px cursor-pointer">
          <img
            src="/dashboard/card/discover_tune.svg"
            alt="loc"
            className="w-4 h-4"
          />
        </button>
      </div>

      <div className="flex gap-2 mb-4 items-center text-dvianeutralvariant-30 overflow-x-scroll md:overflow-hidden w-full whitespace-nowrap">
        <div className="flex flex-row gap-2 justify-center items-center mr-4 md:mr-0">
          <img
            src="/dashboard/card/filter_alt.svg"
            alt="filtrer"
            className="w-4 h-4"
          />
          <span>Filtrer par :</span>
        </div>

        <button className="border border-dvianeutralvariant-30 text-sm px-4 py-2 rounded-8px flex flex-row gap-2 justify-center items-center cursor-pointer">
          <img src="/dashboard/card/star.svg" alt="note" className="w-4 h-4" />
          Note
        </button>

        <button className="border border-dvianeutralvariant-30 text-sm px-4 py-2 rounded-8px flex flex-row gap-2 justify-center items-center cursor-pointer">
          <img
            src="/dashboard/card/location.svg"
            alt="distance"
            className="w-4 h-4"
          />
          Distance
        </button>

        <button className="border border-dvianeutralvariant-30 text-sm px-4 py-2 rounded-8px flex flex-row gap-2 justify-center items-center cursor-pointer">
          <img
            src="/dashboard/card/check.svg"
            alt="artisans vérifiés"
            className="w-4 h-4"
          />
          Artisans vérifiés uniquement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artisans.map((artisan, index) => (
          <ArtisanCard
            key={index}
            {...artisan}
            onContactClick={() => alert("Contact " + artisan.location)}
          />
        ))}
      </div>
    </div>
  );
}

export default page;
