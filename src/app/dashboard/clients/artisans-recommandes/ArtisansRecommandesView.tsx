"use client";

import { ICONS } from "@/constants/icons";
import type { RecommendedArtisanCard } from "@/services/database/recommended-artisans";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ArtisanRecommandeCardProps {
  artisan: RecommendedArtisanCard;
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

      <div className="flex items-center gap-1.5 px-4 mt-3 mb-1">
        <img src={ICONS.artisanCard.location} alt="loc" className="w-4 h-4" />
        <span className="text-xs text-dvianeutralvariant-60">
          {artisan.localisation} ({artisan.distance})
        </span>
      </div>

      <div className="flex items-center gap-1.5 px-4 mb-3">
        <img src={ICONS.artisanCard.clock} alt="dispo" className="w-4 h-4" />
        <span className="text-xs text-dvianeutralvariant-60">
          {artisan.disponibilite}
        </span>
      </div>

      <div className="flex gap-2 px-4 mb-4 flex-wrap">
        {artisan.certifications.map((cert) => (
          <span
            key={cert}
            className="border border-dvianeutralvariant-50 text-xs px-2 py-1 rounded"
          >
            {cert}
          </span>
        ))}
      </div>

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

interface Props {
  initialArtisans: RecommendedArtisanCard[];
}

export default function ArtisansRecommandesView({ initialArtisans }: Props) {
  const router = useRouter();
  const [filterNote, setFilterNote] = useState(false);
  const [filterDistance, setFilterDistance] = useState(false);
  const [filterVerifies, setFilterVerifies] = useState(false);

  let artisansFiltres = [...initialArtisans];
  if (filterVerifies) {
    artisansFiltres = artisansFiltres.filter((a) => a.verifie);
  }
  if (filterNote) {
    artisansFiltres = [...artisansFiltres].sort((a, b) => b.note - a.note);
  }
  if (filterDistance) {
    const km = (d: string) => {
      const m = String(d).match(/(\d+)/);
      return m ? parseInt(m[1], 10) : 9999;
    };
    artisansFiltres = [...artisansFiltres].sort(
      (a, b) => km(a.distance) - km(b.distance),
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

      <div className="mb-6">
        <h1 className="text-headline-large leading-headline-large font-semibold text-dvianeutral-10 mb-1">
          Artisans recommandés
        </h1>
        <p className="text-sm text-dvianeutralvariant-60">
          Sélection des 1 à 5 meilleurs profils (note, avis, vérification) — vous
          pouvez affiner avec les filtres ci-dessous.
        </p>
      </div>

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
