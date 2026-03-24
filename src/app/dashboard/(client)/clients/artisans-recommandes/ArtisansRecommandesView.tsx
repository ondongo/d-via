"use client";

import { ArtisanCard } from "@/components/molecules/dashboard/ArtisanCard";
import { SkeletonArtisanCard } from "@/components/molecules/dashboard/SkeletonArtisanCard";
import { ICONS } from "@/constants/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PROFESSION_LABELS: Record<string, string> = {
  plomberie: "Plomberie",
  electricite: "Électricité",
  maconnerie: "Maçonnerie",
  carrelage: "Carrelage",
  peinture: "Peinture",
  toiture: "Toiture / Couverture",
  menuiserie: "Menuiserie",
  charpente: "Charpente",
  platrerie: "Plâtrerie",
  chauffage: "Chauffage / Climatisation",
  isolation: "Isolation",
  terrassement: "Terrassement",
  jardinage: "Jardinage",
  vitrerie: "Vitrerie",
  serrurerie: "Serrurerie",
  ravalement: "Ravalement de façade",
};

interface ArtisanData {
  id: string;
  userId: string;
  image: string;
  rating: number;
  reviews: number;
  verified: boolean;
  location: string;
  distance: string;
  availability: string;
  certifications: string[];
  companyName?: string;
  profession?: string;
  firstName?: string;
  lastName?: string;
}

const MAX_RECOMMENDED = 10;

export default function ArtisansRecommandesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const professionParam = searchParams.get("search") ?? "";
  const professionLabel = PROFESSION_LABELS[professionParam] ?? professionParam;

  const [artisans, setArtisans] = useState<ArtisanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterNote, setFilterNote] = useState(false);
  const [filterDistance, setFilterDistance] = useState(false);
  const [filterVerifies, setFilterVerifies] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchArtisans() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("pageSize", String(MAX_RECOMMENDED));
        if (professionParam) params.set("search", professionParam);
        if (filterVerifies) params.set("verified", "true");

        const res = await fetch(`/api/artisans?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();

        const mapped: ArtisanData[] = (data.artisans ?? []).map((a: any) => ({
          id: a.id,
          userId: a.userId,
          image: a.image || "",
          rating: a.rating ?? 0,
          reviews: a.reviews ?? 0,
          verified: a.verified,
          location: a.location || "",
          distance: a.distance != null ? `${Math.round(a.distance)}km` : "",
          availability: a.availability || "",
          certifications: a.certifications ?? [],
          companyName: a.companyName || undefined,
          profession: a.profession || undefined,
          firstName: a.firstName || undefined,
          lastName: a.lastName || undefined,
        }));

        setArtisans(mapped);
        setLoading(false);
      } catch (e: any) {
        if (e.name === "AbortError") return;
        setLoading(false);
      }
    }

    fetchArtisans();
    return () => controller.abort();
  }, [professionParam, filterVerifies]);

  const handleContact = async (artisanUserId: string) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artisanId: artisanUserId }),
      });
      if (!response.ok) throw new Error("Impossible de contacter l'artisan");
      const conversation = await response.json();
      router.push(`/dashboard/clients/messages?id=${conversation.id}`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise en relation");
    }
  };

  const kmVal = (d: string) => {
    const m = String(d).match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 9999;
  };

  let displayed = [...artisans];
  if (filterNote) displayed = [...displayed].sort((a, b) => b.rating - a.rating);
  if (filterDistance) displayed = [...displayed].sort((a, b) => kmVal(a.distance) - kmVal(b.distance));

  const chipClass = (active: boolean) =>
    `border text-sm px-4 py-2 rounded-8px flex flex-row gap-2 justify-center items-center cursor-pointer transition-colors ${
      active
        ? "bg-dvianeutral-94 border-dvianeutral-94 text-dvianeutralvariant-50 font-medium"
        : "border-dvianeutralvariant-30 text-dvianeutralvariant-40"
    }`;

  return (
    <div className="min-h-screen p-4 md:p-6 w-full">
      {/* Retour */}
      <button
        onClick={() => router.back()}
        className="text-label-large leading-label-large tracking-label-large h-[40px] cursor-pointer rounded-8px border border-dvianeutral-50 bg-transparent px-4 py-1 text-sm font-medium text-dviaprimary-40 transition-shadow duration-300 hover:shadow-sm flex items-center gap-2 mb-6"
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

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dvianeutral-10 mb-1">
          Artisans recommandés
        </h1>
        <p className="text-sm text-dvianeutralvariant-60">
          Sélection des{" "}
          <span className="font-medium text-dvianeutral-10">
            {MAX_RECOMMENDED} meilleurs profils
          </span>{" "}
          basée sur votre dernier devis analysé — affinez avec les filtres.
        </p>
        {professionLabel && (
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-dviaprimary-96 border border-dviaprimary-90 rounded-28px text-xs font-medium text-dviaprimary-30">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Filtré par : {professionLabel}
          </div>
        )}
      </div>

      {/* Chips de filtre */}
      <div className="flex gap-2 mb-6 items-center text-dvianeutralvariant-30 overflow-x-auto md:overflow-visible whitespace-nowrap w-full">
        <div className="flex flex-row gap-2 justify-center items-center mr-4 md:mr-0">
          <img src={ICONS.artisanCard.filter} alt="filtrer" className="w-4 h-4" />
          <span>Filtrer par :</span>
        </div>

        <button className={chipClass(filterNote)} onClick={() => setFilterNote((v) => !v)}>
          {filterNote && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          <img src={ICONS.artisanCard.star} alt="note" className="w-4 h-4" />
          Note
        </button>

        <button className={chipClass(filterDistance)} onClick={() => setFilterDistance((v) => !v)}>
          {filterDistance && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          <img src={ICONS.artisanCard.location} alt="distance" className="w-4 h-4" />
          Distance
        </button>

        <button className={chipClass(filterVerifies)} onClick={() => setFilterVerifies((v) => !v)}>
          {filterVerifies && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          <img src={ICONS.artisanCard.verified} alt="vérifiés" className="w-4 h-4" />
          Artisans vérifiés uniquement
        </button>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading &&
          Array.from({ length: MAX_RECOMMENDED }).map((_, i) => (
            <SkeletonArtisanCard key={i} />
          ))}

        {!loading &&
          displayed.map((artisan) => (
            <ArtisanCard
              key={artisan.id}
              {...artisan}
              onContactClick={() => handleContact(artisan.userId)}
            />
          ))}

        {!loading && displayed.length === 0 && (
          <p className="col-span-full text-sm text-dvianeutralvariant-40 text-center py-12">
            Aucun artisan recommandé pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
