"use client";

import { ICONS } from "@/constants/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ─── Données mockées ───────────────────────────────────────────────
const ARTISANS_MOCK = [
  {
    id: "artisan-1",
    initiale: "R",
    nom: "Rénovation Habitat",
    specialite: "Entreprise générale de rénovation",
    image: "/dashboard/artisan/mock1.jpg",
    note: 4.8,
    avis: 214,
    verifie: true,
    localisation: "Paris, 75011",
    distance: "5km",
    disponibilite: "Disponible dans 2 semaines",
    certifications: ["RGE", "Qualibat"],
  },
  {
    id: "artisan-2",
    initiale: "M",
    nom: "Martin Carrelage",
    specialite: "Pose carrelage & faïence",
    image: "/dashboard/artisan/mock2.jpg",
    note: 4.7,
    avis: 98,
    verifie: true,
    localisation: "Paris, 75010",
    distance: "3km",
    disponibilite: "Disponible cette semaine",
    certifications: ["Qualibat"],
  },
  {
    id: "artisan-3",
    initiale: "P",
    nom: "Pro Bâtiment 75",
    specialite: "Rénovation & second œuvre",
    image: "/dashboard/artisan/mock3.jpg",
    note: 4.6,
    avis: 147,
    verifie: false,
    localisation: "Montreuil, 93100",
    distance: "8km",
    disponibilite: "Disponible dans 3 semaines",
    certifications: ["RGE"],
  },
  {
    id: "artisan-4",
    initiale: "A",
    nom: "Atelier Dupont",
    specialite: "Carrelage & marbrerie",
    image: "/dashboard/artisan/mock4.jpg",
    note: 4.9,
    avis: 321,
    verifie: true,
    localisation: "Vincennes, 94300",
    distance: "6km",
    disponibilite: "Disponible dans 1 semaine",
    certifications: ["RGE", "Qualibat"],
  },
  {
    id: "artisan-5",
    initiale: "S",
    nom: "Sud-Est Rénovation",
    specialite: "Rénovation intérieure complète",
    image: "/dashboard/artisan/mock5.jpg",
    note: 4.5,
    avis: 63,
    verifie: true,
    localisation: "Paris, 75020",
    distance: "4km",
    disponibilite: "Disponible dans 10 jours",
    certifications: ["Qualibat"],
  },
  {
    id: "artisan-6",
    initiale: "C",
    nom: "Carrelage Express",
    specialite: "Pose rapide & garantie 10 ans",
    image: "/dashboard/artisan/mock6.jpg",
    note: 4.7,
    avis: 182,
    verifie: true,
    localisation: "Pantin, 93500",
    distance: "7km",
    disponibilite: "Disponible dans 2 semaines",
    certifications: ["RGE"],
  },
  {
    id: "artisan-7",
    initiale: "L",
    nom: "Les Bâtisseurs",
    specialite: "Gros œuvre & second œuvre",
    image: "/dashboard/artisan/mock7.jpg",
    note: 4.6,
    avis: 89,
    verifie: false,
    localisation: "Bagnolet, 93170",
    distance: "9km",
    disponibilite: "Disponible dans 3 semaines",
    certifications: ["Qualibat"],
  },
  {
    id: "artisan-8",
    initiale: "N",
    nom: "Nexo Bâtiment",
    specialite: "Carrelage, faïence, peinture",
    image: "/dashboard/artisan/mock8.jpg",
    note: 4.8,
    avis: 255,
    verifie: true,
    localisation: "Saint-Denis, 93200",
    distance: "10km",
    disponibilite: "Disponible dans 1 semaine",
    certifications: ["RGE", "Qualibat"],
  },
];

// ─── Composant ArtisanCard recommandé ─────────────────────────────
interface ArtisanRecommandeCardProps {
  artisan: (typeof ARTISANS_MOCK)[0];
  onProfil: (id: string) => void;
  onDevis: (id: string) => void;
}

function ArtisanRecommandeCard({
  artisan,
  onProfil,
  onDevis,
}: ArtisanRecommandeCardProps) {
  return (
    <div className="border border-dvianeutral-50 rounded-2xl overflow-hidden bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-dviaprimary-90 flex items-center justify-center text-dviaprimary-10 font-semibold text-sm shrink-0">
            {artisan.initiale}
          </div>
          <div>
            <p className="text-sm font-medium text-dvianeutral-10 leading-tight">
              {artisan.nom}
            </p>
            <p className="text-xs text-dvianeutralvariant-60 max-w-[160px] truncate">
              {artisan.specialite}
            </p>
          </div>
        </div>
        <img
          src={ICONS.artisanCard.moreMenu}
          alt="Options"
          className="w-4 h-4 cursor-pointer opacity-60"
        />
      </div>

      {/* Image mock */}
      <div className="mx-4 h-36 bg-dvianeutral-94 rounded-xl overflow-hidden mb-3">
        <img
          src="/dashboard/artisan/placeholder.jpg"
          alt="Chantier"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Note + Vérifié */}
      <div className="flex items-center px-4 mb-1">
        <span className="text-dviaprimary-40 text-sm font-medium">
          ★ {artisan.note}
        </span>
        <span className="text-dvianeutralvariant-60 text-xs ml-1">
          ({artisan.avis})
        </span>
        {artisan.verifie && (
          <div className="ml-auto border border-dvianeutralvariant-50 text-xs px-2 py-1 rounded flex items-center gap-1">
            <img src={ICONS.artisanCard.verified} alt="vérifié" className="w-3 h-3" />
            Vérifié
          </div>
        )}
      </div>

      {/* Localisation */}
      <div className="flex items-center gap-1.5 px-4 mt-3 mb-1">
        <img src={ICONS.artisanCard.location} alt="loc" className="w-4 h-4" />
        <span className="text-xs text-dvianeutralvariant-60">
          {artisan.localisation} ({artisan.distance})
        </span>
      </div>

      {/* Disponibilité */}
      <div className="flex items-center gap-1.5 px-4 mb-3">
        <img src={ICONS.artisanCard.clock} alt="dispo" className="w-4 h-4" />
        <span className="text-xs text-dvianeutralvariant-60">
          {artisan.disponibilite}
        </span>
      </div>

      {/* Certifications */}
      <div className="flex gap-2 px-4 mb-4">
        {artisan.certifications.map((cert) => (
          <span
            key={cert}
            className="border border-dvianeutralvariant-50 text-xs px-2 py-1 rounded"
          >
            {cert}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex gap-2 px-4 pb-4 mt-auto">
        <button
          onClick={() => onDevis(artisan.id)}
          className="flex-1 border border-dvianeutral-50 text-dviaprimary-40 text-sm py-2 rounded-8px flex items-center justify-center gap-1.5 cursor-pointer hover:bg-dvianeutral-96 transition-colors"
        >
          <img src={ICONS.artisanCard.contact} alt="" className="w-4 h-4" />
          Demander un devis
        </button>
        <button
          onClick={() => onProfil(artisan.id)}
          className="px-4 bg-dviaprimary-40 text-white text-sm py-2 rounded-8px cursor-pointer hover:shadow-md transition-shadow"
        >
          Profil
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────
function SkeletonRecommandeCard() {
  return (
    <div className="animate-pulse border border-dvianeutral-50 rounded-2xl overflow-hidden bg-white flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div className="w-9 h-9 rounded-full bg-dvianeutral-94 shrink-0" />
        <div className="flex-1">
          <div className="h-3 bg-dvianeutral-94 rounded w-28 mb-1.5" />
          <div className="h-2.5 bg-dvianeutral-94 rounded w-20" />
        </div>
      </div>
      <div className="mx-4 h-36 bg-dvianeutral-94 rounded-xl mb-3" />
      <div className="px-4 flex gap-2 mb-3">
        <div className="h-3 bg-dvianeutral-94 rounded w-10" />
        <div className="h-3 bg-dvianeutral-94 rounded w-8" />
      </div>
      <div className="px-4 flex gap-1.5 mb-2">
        <div className="w-4 h-4 bg-dvianeutral-94 rounded" />
        <div className="h-3 bg-dvianeutral-94 rounded w-24" />
      </div>
      <div className="px-4 flex gap-1.5 mb-4">
        <div className="w-4 h-4 bg-dvianeutral-94 rounded" />
        <div className="h-3 bg-dvianeutral-94 rounded w-32" />
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <div className="flex-1 h-9 bg-dvianeutral-94 rounded-8px" />
        <div className="w-16 h-9 bg-dvianeutral-94 rounded-8px" />
      </div>
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────
export default function ArtisansRecommandesPage() {
  const router = useRouter();
  const [filterNote, setFilterNote] = useState(false);
  const [filterDistance, setFilterDistance] = useState(false);
  const [filterVerifies, setFilterVerifies] = useState(false);

  let artisansFiltres = [...ARTISANS_MOCK];
  if (filterVerifies) {
    artisansFiltres = artisansFiltres.filter((a) => a.verifie);
  }
  if (filterNote) {
    artisansFiltres = artisansFiltres.sort((a, b) => b.note - a.note);
  }
  if (filterDistance) {
    artisansFiltres = artisansFiltres.sort(
      (a, b) => parseInt(a.distance) - parseInt(b.distance),
    );
  }

  const handleProfil = (id: string) => {
    router.push(`/dashboard/clients/search/${id}`);
  };

  const handleDevis = (_id: string) => {
    router.push("/dashboard/clients/messages");
  };

  return (
    <div className="w-full max-w-[1200px] px-4 md:px-8 pb-10">
      {/* Retour */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-dvianeutralvariant-40 hover:text-dviaprimary-40 transition-colors mb-6 cursor-pointer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Retour à l&apos;analyse
      </button>

      {/* Titre */}
      <div className="mb-6">
        <h1 className="text-headline-large leading-headline-large font-semibold text-dvianeutral-10 mb-1">
          Artisans recommandés
        </h1>
        <p className="text-sm text-dvianeutralvariant-60">
          Ces artisans pourraient réaliser votre projet pour{" "}
          <span className="font-semibold text-dviaprimary-40">~25% moins cher.</span>
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 items-center text-dvianeutralvariant-40 overflow-x-auto md:overflow-visible whitespace-nowrap">
        <div className="flex items-center gap-1.5 mr-2">
          <img
            src={ICONS.artisanCard.filter}
            alt="filtrer"
            className="w-4 h-4"
          />
          <span className="text-sm">Filtrer par :</span>
        </div>

        <button
          onClick={() => setFilterNote((v) => !v)}
          className={`flex items-center gap-1.5 border text-sm px-4 py-2 rounded-8px cursor-pointer transition-colors ${
            filterNote
              ? "bg-dviaprimary-40 text-white border-dviaprimary-40"
              : "border-dvianeutralvariant-30 hover:border-dviaprimary-40"
          }`}
        >
          <img src={ICONS.artisanCard.star} alt="note" className="w-4 h-4" />
          Note
        </button>

        <button
          onClick={() => setFilterDistance((v) => !v)}
          className={`flex items-center gap-1.5 border text-sm px-4 py-2 rounded-8px cursor-pointer transition-colors ${
            filterDistance
              ? "bg-dviaprimary-40 text-white border-dviaprimary-40"
              : "border-dvianeutralvariant-30 hover:border-dviaprimary-40"
          }`}
        >
          <img
            src={ICONS.artisanCard.location}
            alt="distance"
            className="w-4 h-4"
          />
          Distance
        </button>

        <button
          onClick={() => setFilterVerifies((v) => !v)}
          className={`flex items-center gap-1.5 border text-sm px-4 py-2 rounded-8px cursor-pointer transition-colors ${
            filterVerifies
              ? "bg-dviaprimary-40 text-white border-dviaprimary-40"
              : "border-dvianeutralvariant-30 hover:border-dviaprimary-40"
          }`}
        >
          <img
            src={ICONS.artisanCard.verified}
            alt="vérifiés"
            className="w-4 h-4"
          />
          Artisans vérifiés uniquement
        </button>
      </div>

      {/* Grille artisans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {artisansFiltres.map((artisan) => (
          <ArtisanRecommandeCard
            key={artisan.id}
            artisan={artisan}
            onProfil={handleProfil}
            onDevis={handleDevis}
          />
        ))}
        {artisansFiltres.length === 0 && (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRecommandeCard key={i} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
