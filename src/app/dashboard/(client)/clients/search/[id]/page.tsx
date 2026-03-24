"use client";

import React, { useEffect, useState } from "react";
import { ICONS } from "@/constants/icons";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaCheck } from "react-icons/fa";

type ScheduleDay = {
  day: string;
  enabled: boolean;
  amStart: string;
  amEnd: string;
  pmStart: string;
  pmEnd: string;
};

type ArtisanData = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  companyName: string | null;
  profession: string | null;
  category: string | null;
  description: string | null;
  image: string | null;
  rating: number | null;
  reviews: number | null;
  verified: boolean;
  certifications: string[];
  services: string | null;
  location: string | null;
  distance: number | null;
  availability: string | null;
  hourlyRateMin: number | null;
  hourlyRateMax: number | null;
  dailyRateMin: number | null;
  dailyRateMax: number | null;
  travelFee: number | null;
  freeEstimate: boolean;
  schedule: string | null;
  workPhotos: string[];
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  tiktok: string | null;
  websiteUrl: string | null;
};

function formatSchedule(
  scheduleJson: string | null,
): { jour: string; plage: string }[] {
  if (!scheduleJson) return [];
  try {
    const days: ScheduleDay[] = JSON.parse(scheduleJson);
    return days.map((d) => ({
      jour: d.day,
      plage: d.enabled ? `${d.amStart} – ${d.pmEnd}` : "Fermé",
    }));
  } catch {
    return [];
  }
}

function parseServices(services: string | null): string[] {
  if (!services) return [];
  try {
    const parsed = JSON.parse(services);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    return services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export default function DetailArtisanPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [artisan, setArtisan] = useState<ArtisanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtisan() {
      try {
        const res = await fetch(`/api/artisans/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setArtisan(data);
        }
      } catch (err) {
        console.error("Erreur chargement artisan:", err);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchArtisan();
  }, [params.id]);

  const handleDemandeDevis = async () => {
    if (!artisan) return;
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artisanId: artisan.userId }),
      });
      if (!response.ok) throw new Error("Impossible de contacter l'artisan");
      const conversation = await response.json();
      router.push(`/dashboard/clients/messages?id=${conversation.id}`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise en relation");
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 md:px-8 pb-10 pt-6 animate-pulse">
        {/* Bouton retour */}
        <div className="h-[40px] w-52 bg-dvianeutral-94 rounded-8px mb-6" />

        {/* Header profil */}
        <div className="border border-dvianeutral-50 rounded-2xl overflow-hidden mb-6">
          <div className="w-full h-36 bg-dvianeutral-94" />
          <div className="px-6 -mt-[100px]">
            <div className="w-[140px] h-[140px] rounded-full bg-dvianeutral-50 border-4 border-white" />
          </div>
          <div className="px-6 pb-6 pt-3 flex flex-col md:flex-row md:justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-dvianeutral-94 rounded" />
              <div className="h-4 w-32 bg-dvianeutral-94 rounded" />
              <div className="h-4 w-40 bg-dvianeutral-94 rounded" />
              <div className="flex gap-2 mt-2">
                <div className="h-6 w-14 bg-dvianeutral-94 rounded-8px" />
                <div className="h-6 w-16 bg-dvianeutral-94 rounded-8px" />
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-10 w-44 bg-dvianeutral-94 rounded-8px" />
              <div className="h-14 w-20 bg-dvianeutral-94 rounded-8px" />
            </div>
          </div>
        </div>

        {/* Corps 2 colonnes */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-6">
            <div className="h-5 w-28 bg-dvianeutral-94 rounded" />
            <div className="h-16 bg-dvianeutral-94 rounded" />
            <hr className="border-dvianeutral-50" />
            <div className="h-5 w-36 bg-dvianeutral-94 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-dvianeutral-94 rounded-28px" />
              <div className="h-8 w-20 bg-dvianeutral-94 rounded-28px" />
              <div className="h-8 w-28 bg-dvianeutral-94 rounded-28px" />
            </div>
            <hr className="border-dvianeutral-50" />
            <div className="h-5 w-28 bg-dvianeutral-94 rounded" />
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-square bg-dvianeutral-94 rounded-xl" />
              ))}
            </div>
          </div>

          <div className="lg:w-[360px] shrink-0 space-y-6">
            <div className="h-5 w-32 bg-dvianeutral-94 rounded" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-dvianeutral-94 rounded-8px" />
              <div className="h-16 bg-dvianeutral-94 rounded-8px" />
              <div className="h-16 bg-dvianeutral-94 rounded-8px" />
              <div className="h-16 bg-dvianeutral-94 rounded-8px" />
            </div>
            <hr className="border-dvianeutral-50" />
            <div className="h-5 w-24 bg-dvianeutral-94 rounded" />
            <div className="space-y-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-dvianeutral-94 rounded" />
                  <div className="h-4 w-28 bg-dvianeutral-94 rounded" />
                </div>
              ))}
            </div>
            <hr className="border-dvianeutral-50" />
            <div className="h-5 w-24 bg-dvianeutral-94 rounded" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dvianeutral-94" />
                  <div className="h-4 w-32 bg-dvianeutral-94 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="w-full px-4 md:px-8 pb-10 pt-6">
        <p className="text-dvianeutralvariant-40">Artisan non trouvé.</p>
      </div>
    );
  }

  const servicesList = parseServices(artisan.services);
  const horaires = formatSchedule(artisan.schedule);
  const socialIcons: Record<string, React.ReactNode> = {
    website: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    facebook: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    linkedin: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM6.92 20.452H3.756V9H6.92v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    tiktok: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.1a8.16 8.16 0 0 0 4.77 1.52V6.17a4.83 4.83 0 0 1-1.01.52z" />
      </svg>
    ),
  };

  const socialLinks = [
    artisan.websiteUrl && {
      label: artisan.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      url: artisan.websiteUrl,
      icon: socialIcons.website,
    },
    artisan.facebook && {
      label: artisan.facebook.replace(
        /^https?:\/\/(www\.)?facebook\.com\//,
        "@",
      ),
      url: artisan.facebook,
      icon: socialIcons.facebook,
    },
    artisan.instagram && {
      label: artisan.instagram.replace(
        /^https?:\/\/(www\.)?instagram\.com\//,
        "@",
      ),
      url: artisan.instagram,
      icon: socialIcons.instagram,
    },
    artisan.linkedin && {
      label: "LinkedIn",
      url: artisan.linkedin,
      icon: socialIcons.linkedin,
    },
    artisan.tiktok && {
      label: artisan.tiktok.replace(/^https?:\/\/(www\.)?tiktok\.com\/@?/, ""),
      url: artisan.tiktok,
      icon: socialIcons.tiktok,
    },
  ].filter(Boolean) as { label: string; url: string; icon: React.ReactNode }[];

  return (
    <div className="w-full px-4 md:px-8 pb-10 pt-6">
      {/* Retour */}
      <button
        onClick={() => router.back()}
        className="text-label-large leading-label-large tracking-label-large h-[40px] cursor-pointer rounded-8px border border-dvianeutral-50 bg-transparent px-4 py-1 text-sm font-medium text-dviaprimary-40 transition-shadow duration-300 hover:shadow-sm flex items-center gap-2 mb-6"
      >
        <FaArrowLeft />
        Retour à la recherche
      </button>

      {/* Header profil */}
      <div className="border border-dvianeutral-50 rounded-2xl overflow-hidden mb-6">
        {/* Bannière */}
        <div className="relative w-full h-36 bg-dvianeutral-94">
          <div className="absolute inset-0 bg-gradient-to-r from-dvianeutral-94 to-dvianeutral-50 opacity-60" />
          <div className="absolute inset-0 flex items-center justify-end pr-8 opacity-20">
            <div className="w-48 h-48 rounded-full bg-dviaprimary-40 blur-3xl" />
          </div>
        </div>

        {/* Photo qui chevauche la bannière */}
        <div className="px-6 -mt-[144px]">
          <div className="relative w-[240px] h-[240px] shrink-0">
            <div className="w-[240px] h-[240px] rounded-full bg-dvianeutral-50 border-4 border-white flex items-center justify-center text-4xl font-bold text-dvianeutral-10 overflow-hidden shadow-lg">
              {artisan.image ? (
                <img
                  src={artisan.image}
                  alt={`${artisan.firstName} ${artisan.lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}
              <span className={artisan.image ? "hidden" : "flex"}>{artisan.firstName?.charAt(0)}</span>
            </div>
            {artisan.verified && (
              <div className="absolute bottom-2 right-2 w-14 h-14 bg-[#00B983] rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <img
                  src="/icons/badge-certified.svg"
                  alt="certifié"
                  className="w-7 h-7"
                />
              </div>
            )}
          </div>
        </div>

        {/* Infos + CTA en row */}
        <div className="px-6 pb-6 pt-3">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            {/* Col gauche : nom, métier, certifications */}
            <div>
              <h1 className="text-display-medium font-bold text-dvianeutral-10 leading-tight">
                {artisan.companyName ||
                  `${artisan.firstName} ${artisan.lastName}`}
              </h1>
              <p className="text-sm text-dvianeutralvariant-60 mt-1">
                {artisan.firstName} {artisan.lastName}
              </p>
              <p className="text-sm font-medium text-dvianeutralvariant-40 mt-0.5">
                {artisan.profession}
                {artisan.category ? ` · ${artisan.category}` : ""}
              </p>
              {artisan.certifications.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {artisan.certifications.map((c) => (
                    <span
                      key={c}
                      className="border border-dvianeutralvariant-50 text-xs px-2.5 py-1 rounded-8px font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Col droite : CTA + Note */}
            <div className="flex flex-row items-center gap-3 shrink-0">
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-sm  text-dvianeutral-10 font-semibold hidden md:block">
                  Contactez cet artisan
                </p>
                <button
                  onClick={handleDemandeDevis}
                  className="flex items-center gap-2 bg-dviaprimary-40 text-white text-sm font-medium px-5 py-2.5 rounded-8px cursor-pointer hover:shadow-md transition-shadow"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Demander un devis
                </button>
              </div>
              {artisan.rating && (
                <div className="flex flex-col items-center bg-dviaalert border border-dviaprimary-40 px-4 py-2 rounded-8px">
                  <span className="text-dviaprimary-40 font-normal text-lg">
                    ★ {artisan.rating}
                  </span>
                  <span className="text-xs text-dviaprimary-20">
                    {artisan.reviews} avis clients
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Corps en 2 colonnes */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Colonne principale */}
        <div className="flex-1 min-w-0">
          {/* À propos */}
          {artisan.description && (
            <section className="py-6">
              <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-3">
                À propos
              </h2>
              <p className="text-sm text-dvianeutralvariant-40 leading-relaxed">
                {artisan.description}
              </p>
            </section>
          )}

          <hr className="border-dvianeutral-50" />

          {/* Services proposés */}
          {servicesList.length > 0 && (
            <>
              <section className="py-6">
                <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
                  Services proposés
                </h2>
                <div className="flex flex-wrap gap-2">
                  {servicesList.map((service) => (
                    <span className="border border-dvianeutralvariant-12 text-xs px-2.5 py-1 rounded-8px font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              </section>
              <hr className="border-dvianeutral-50" />
            </>
          )}

          {/* Réalisations */}
          <section className="py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-title-large font-semibold text-dvianeutral-10">
                Réalisations
              </h2>
              <div className="relative group/voirtout">
                <button className="text-sm text-dviaprimary-40/50 cursor-not-allowed">
                  Voir tout ({artisan.workPhotos.length || 5})
                </button>
                <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-dvianeutral-10 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/voirtout:opacity-100 transition-opacity z-50">
                  Indisponible pour le moment
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {artisan.workPhotos.length > 0
                ? artisan.workPhotos.slice(0, 5).map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden bg-dvianeutral-94"
                    >
                      <img
                        src={url}
                        alt={`Réalisation ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                : Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-dvianeutral-94 rounded-xl animate-pulse"
                    />
                  ))}
            </div>
          </section>

          <hr className="border-dvianeutral-50" />

          {/* Garanties professionnelles */}
          {artisan.verified && (
            <section className="py-6">
              <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
                Garanties professionnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#73FFD7] border border-[#009B6F] rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-[#009B6F] rounded-8px p-2">
                    <FaCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#3D352D]">
                      Identité vérifiée
                    </p>

                    <p className="text-xs text-[#3D352D]/70">
                      Pièce d&apos;identité validée
                    </p>
                  </div>
                </div>
                <div className="bg-[#73FFD7] border border-[#009B6F] rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-[#009B6F] rounded-8px p-2">
                    <FaCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#3D352D]">
                      SIRET vérifié
                    </p>
                    <p className="text-xs text-[#3D352D]/70">
                      Entreprise enregistrée
                    </p>
                  </div>
                </div>
                <div className="bg-[#73FFD7] border border-[#009B6F] rounded-xl p-4 flex items-center gap-3">
                  <div className="bg-[#009B6F] rounded-8px p-2">
                    <FaCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#3D352D]">
                      Assurance Décennale
                    </p>
                    <p className="text-xs text-[#3D352D]/70">
                      Couverture garantie
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Colonne droite */}
        <div className="lg:w-[360px] shrink-0">
          {/* Tarifs indicatifs */}
          <section className="py-6">
            <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
              Tarifs indicatifs
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(artisan.hourlyRateMin || artisan.hourlyRateMax) && (
                <div className="border border-dvianeutral-50 rounded-8px p-3">
                  <p className="text-xs font-semibold text-dvianeutralvariant-60 mb-1">
                    Taux horaire
                  </p>
                  <p className="text-sm  text-dvianeutral-10">
                    {artisan.hourlyRateMin}€ – {artisan.hourlyRateMax}€
                  </p>
                </div>
              )}
              {(artisan.dailyRateMin || artisan.dailyRateMax) && (
                <div className="border border-dvianeutral-50 rounded-8px p-3">
                  <p className="text-xs font-semibold text-dvianeutralvariant-60 mb-1">
                    Taux journalier
                  </p>
                  <p className="text-sm  text-dvianeutral-10">
                    {artisan.dailyRateMin}€ – {artisan.dailyRateMax}€
                  </p>
                </div>
              )}
              {artisan.travelFee !== null && (
                <div className="border border-dvianeutral-50 rounded-8px p-3">
                  <p className="text-xs font-semibold text-dvianeutralvariant-60 mb-1">
                    Déplacement
                  </p>
                  <p className="text-sm  text-dvianeutral-10">
                    {artisan.travelFee === 0
                      ? "Gratuit"
                      : `${artisan.travelFee}€/km`}
                  </p>
                </div>
              )}
              {artisan.freeEstimate && (
                <div className="bg-dviaprimary-40 text-white text-sm font-medium rounded-8px p-3 flex flex-col items-center justify-center gap-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Devis gratuit
                </div>
              )}
            </div>
          </section>

          <hr className="border-dvianeutral-50" />

          {/* Horaires */}
          {horaires.length > 0 && (
            <>
              <section className="py-6">
                <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
                  Horaires
                </h2>
                <ul className="flex flex-col gap-2">
                  {horaires.map(({ jour, plage }) => (
                    <li
                      key={jour}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-dvianeutralvariant-60">{jour}</span>
                      <span
                        className={`font-medium ${plage === "Fermé" ? "text-dvianeutralvariant-60" : "text-dvianeutral-10"}`}
                      >
                        {plage}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
              <hr className="border-dvianeutral-50" />
            </>
          )}

          {/* Sur le web */}
          {socialLinks.length > 0 && (
            <>
              <section className="py-6">
                <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
                  Sur le web
                </h2>
                <ul className="flex flex-col gap-4">
                  {socialLinks.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-dvianeutral-10 hover:text-dviaprimary-40 transition-colors"
                      >
                        <span className="shrink-0 w-10 h-10 rounded-full bg-dvianeutral-94 flex items-center justify-center text-dvianeutralvariant-40">
                          {link.icon}
                        </span>
                        <span className="truncate">{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
              <hr className="border-dvianeutral-50" />
            </>
          )}

          {/* Localisation */}
          <section className="py-6">
            <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-3">
              Localisation
            </h2>
            {artisan.location && (
              <div className="flex items-center gap-2 text-sm text-dvianeutralvariant-60">
                <img
                  src={ICONS.artisanCard.location}
                  alt="loc"
                  className="w-4 h-4"
                />
                {artisan.location}
                {artisan.distance ? ` · ${artisan.distance}km` : ""}
              </div>
            )}
            {artisan.availability && (
              <div className="flex items-center gap-2 text-sm text-dvianeutralvariant-60 mt-1.5">
                <img
                  src={ICONS.artisanCard.clock}
                  alt="dispo"
                  className="w-4 h-4"
                />
                {artisan.availability}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
