"use client";

import { ArtisanCard } from "@/components/molecules/dashboard/ArtisanCard";
import InputAddress from "@/components/molecules/dashboard/InputAddress";
import React, { useState, useEffect, useMemo } from "react";

function page() {
  // États pour les filtres
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous les métiers");
  const [filterRating, setFilterRating] = useState(false);
  const [filterDistance, setFilterDistance] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [ratingThreshold, setRatingThreshold] = useState(4.7);
  const [distanceThreshold, setDistanceThreshold] = useState(5);

  interface ArtisanDB {
    id: string;
    image: string | null;
    rating: number | null;
    reviews: number | null;
    verified: boolean;
    location: string | null;
    distance: number | null;
    availability: string | null;
    certifications: string | null;
    profession: string | null;
    category: string | null;
  }

  const [artisans, setArtisans] = useState<ArtisanDB[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Liste catégories dynamique depuis les artisans chargés
  const categories = useMemo(() => {
    const set = new Set<string>();
    artisans.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ["Tous les métiers", ...Array.from(set).sort()];
  }, [artisans]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchArtisans() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (category && category !== "Tous les métiers")
          params.set("category", category);
        if (filterRating) params.set("minRating", ratingThreshold.toString());
        if (filterDistance) params.set("maxDistance", distanceThreshold.toString());
        if (onlyVerified) params.set("verified", "true");
        const res = await fetch(
          `/api/artisans?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();
        setArtisans(data.artisans || []);
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message || "Erreur");
      } finally {
        setLoading(false);
      }
    }
    fetchArtisans();
    return () => controller.abort();
  }, [debouncedSearch, category, filterRating, filterDistance, onlyVerified, ratingThreshold, distanceThreshold]);

  // Application des filtres côté client retirée (déjà côté serveur)
  const filteredArtisans = artisans.map((a) => ({
    image: a.image || "",
    rating: a.rating || 0,
    reviews: a.reviews || 0,
    verified: a.verified,
    location: a.location || "",
    distance: a.distance != null ? `${a.distance}km` : "",
    availability: a.availability || "",
    certifications: a.certifications
      ? a.certifications.split(",").map((c) => c.trim())
      : [],
  }));

  return (
    <div className="min-h-screen p-4  md:p-6 w-full">
      <div className="flex w-full items-center mb-6 gap-4">
        <div className="w-full max-w-[350px]  border px-4 py-3 flex items-center gap-2 rounded-8px border-dvianeutral-50  bg-dvianeutral-94">
          <img src="/dashboard/card/search.svg" alt="loc" className="w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par nom ou métier..."
            className="flex-1 text-sm  text-dvianeutralvariant-30 outline-none placeholder:dvianeutralvariant-30 placeholder:text-sm placeholder:font-normal"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="hidden md:flex flex-row justify-center items-center">
          <p className="text-dvianeutralvariant-30 text-[16px] font-normal">
            Catégorie :
          </p>
          <div className="relative w-fit">
            <select
              className="appearance-none ml-4 p-3 pr-10 px-4 rounded-8px border border-dvianeutral-50 bg-dvianeutral-94   focus:outline-none focus:border-dvianeutral-40 text-dvianeutralvariant-30 text-sm font-normal cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <img
              src="/dashboard/card/select.svg"
              alt="flèche"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3"
            />
          </div>
        </div>

        <button className="border border-dvianeutral-50 bg-dvianeutral-94 text-sm px-4 py-3 rounded-8px cursor-pointer" onClick={() => setShowAdvanced(v => !v)} aria-expanded={showAdvanced} aria-controls="advanced-filters">
          <img
            src="/dashboard/card/discover_tune.svg"
            alt="filtres avancés"
            className="w-4 h-4"
          />
        </button>
      </div>

      {showAdvanced && (
        <div id="advanced-filters" className="mb-6 border border-dvianeutral-50 bg-dvianeutral-94 rounded-8px p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-dvianeutralvariant-30">Note minimale</label>
            <input type="number" min={0} max={5} step={0.1} value={ratingThreshold} onChange={e => { setRatingThreshold(parseFloat(e.target.value)||0); setFilterRating(true); }} className="px-3 py-2 text-sm border rounded-8px bg-white outline-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-dvianeutralvariant-30">Distance maximale (km)</label>
            <input type="number" min={0} step={1} value={distanceThreshold} onChange={e => { setDistanceThreshold(parseFloat(e.target.value)||0); setFilterDistance(true); }} className="px-3 py-2 text-sm border rounded-8px bg-white outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <input id="verified" type="checkbox" checked={onlyVerified} onChange={() => setOnlyVerified(v => !v)} className="cursor-pointer" />
            <label htmlFor="verified" className="text-xs text-dvianeutralvariant-30">Artisans vérifiés uniquement</label>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setFilterRating(false); setFilterDistance(false); setOnlyVerified(false); setRatingThreshold(4.7); setDistanceThreshold(5); }} className="text-xs px-3 py-2 border rounded-8px bg-white">Réinitialiser</button>
            <button onClick={() => setShowAdvanced(false)} className="text-xs px-3 py-2 border rounded-8px bg-dviaprimary-40 text-white">Fermer</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4 items-center text-dvianeutralvariant-30 overflow-x-scroll md:overflow-hidden w-full whitespace-nowrap">
        <div className="flex flex-row gap-2 justify-center items-center mr-4 md:mr-0">
          <img
            src="/dashboard/card/filter_alt.svg"
            alt="filtrer"
            className="w-4 h-4"
          />
          <span>Filtrer par :</span>
        </div>

        <button
          className={`border border-dvianeutralvariant-30 text-sm px-4 py-2 rounded-8px flex flex-row gap-2 justify-center items-center cursor-pointer ${
            filterRating ? "bg-dvianeutral-80 text-white" : ""
          }`}
          onClick={() => setFilterRating((v) => !v)}
        >
          <img src="/dashboard/card/star.svg" alt="note" className="w-4 h-4" />
          Note
        </button>

        <button
          className={`border border-dvianeutralvariant-30 text-sm px-4 py-2 rounded-8px flex flex-row gap-2 justify-center items-center cursor-pointer ${
            filterDistance ? "bg-dvianeutral-80 text-white" : ""
          }`}
          onClick={() => setFilterDistance((v) => !v)}
        >
          <img
            src="/dashboard/card/location.svg"
            alt="distance"
            className="w-4 h-4"
          />
          Distance
        </button>

        <button
          className={`border border-dvianeutralvariant-30 text-sm px-4 py-2 rounded-8px flex flex-row gap-2 justify-center items-center cursor-pointer ${
            onlyVerified ? "bg-dvianeutral-80 text-white" : ""
          }`}
          onClick={() => setOnlyVerified((v) => !v)}
        >
          <img
            src="/dashboard/card/check.svg"
            alt="artisans vérifiés"
            className="w-4 h-4"
          />
          Artisans vérifiés uniquement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading && (
          <p className="text-sm text-dvianeutralvariant-30">Chargement...</p>
        )}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading &&
          !error &&
          filteredArtisans.map((artisan, index) => (
            <ArtisanCard
              key={index}
              {...artisan}
              onContactClick={() => alert("Contact " + artisan.location)}
            />
          ))}
        {!loading && !error && filteredArtisans.length === 0 && (
          <p className="text-sm text-dvianeutralvariant-30">
            Aucun artisan trouvé.
          </p>
        )}
      </div>
    </div>
  );
}

export default page;
