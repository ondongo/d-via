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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);

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
  const [categories, setCategories] = useState<string[]>(["Tous les métiers"]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetch("/api/artisans/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.categories)) {
          setCategories([
            "Tous les métiers",
            ...data.categories.filter((c) => c !== "Tous les métiers"),
          ]);
        }
      })
      .catch(() => setCategories(["Tous les métiers"]));
  }, []);

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
        params.set("page", page.toString());
        params.set("pageSize", pageSize.toString());
        const res = await fetch(
          `/api/artisans?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();
        setArtisans(data.artisans || []);
        setTotalCount(data.totalCount || 0);
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message || "Erreur");
      } finally {
        setLoading(false);
      }
    }
    fetchArtisans();
    return () => controller.abort();
  }, [debouncedSearch, category, filterRating, filterDistance, onlyVerified, ratingThreshold, distanceThreshold, page, pageSize]);

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

  // Pagination UI
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Skeleton
  function SkeletonArtisanCard() {
    return (
      <div className="animate-pulse bg-dviaprimary-94 border border-dviaprimary-80 rounded-8px p-4 flex flex-col gap-3">
        <div className="bg-dviaprimary-80 h-32 w-full rounded-8px mb-2" />
        <div className="h-4 bg-dviaprimary-80 rounded w-2/3 mb-1" />
        <div className="h-3 bg-dvianeutral-90 rounded w-1/2 mb-1" />
        <div className="h-3 bg-dvianeutral-90rounded w-1/3" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-16 bg-dvianeutral-90 rounded" />
          <div className="h-6 w-10 bg-dvianeutral-90 rounded" />
        </div>
      </div>
    );
  }

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
        {loading &&
          Array.from({ length: pageSize }).map((_, i) => (
            <SkeletonArtisanCard key={i} />
          ))}
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
      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          className="px-3 py-2 border rounded-8px bg-white text-sm disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Précédent
        </button>
        <span className="text-sm">Page {page} / {totalPages}</span>
        <button
          className="px-3 py-2 border rounded-8px bg-white text-sm disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Suivant
        </button>
        <select
          className="ml-4 px-2 py-1 border rounded-8px text-sm"
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
        >
          {[6, 12, 24, 48].map(size => (
            <option key={size} value={size}>{size} / page</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default page;
