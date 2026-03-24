"use client";

import { useEffect, useState } from "react";
import { ICONS } from "@/constants/icons";
import { useParams, useRouter } from "next/navigation";

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

function formatSchedule(scheduleJson: string | null): { jour: string; plage: string }[] {
  if (!scheduleJson) return [];
  try {
    const days: ScheduleDay[] = JSON.parse(scheduleJson);
    return days.map((d) => ({
      jour: d.day,
      plage: d.enabled
        ? `${d.amStart} – ${d.pmEnd}`
        : "Fermé",
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
    return services.split(",").map((s) => s.trim()).filter(Boolean);
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

  if (loading) {
    return (
      <div className="w-full max-w-[1100px] px-4 md:px-8 pb-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-dvianeutral-94 rounded" />
          <div className="h-48 bg-dvianeutral-94 rounded-2xl" />
          <div className="flex gap-6">
            <div className="flex-1 h-64 bg-dvianeutral-94 rounded-2xl" />
            <div className="w-[280px] h-64 bg-dvianeutral-94 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="w-full max-w-[1100px] px-4 md:px-8 pb-10">
        <p className="text-dvianeutralvariant-40">Artisan non trouvé.</p>
      </div>
    );
  }

  const servicesList = parseServices(artisan.services);
  const horaires = formatSchedule(artisan.schedule);
  const socialLinks = [
    artisan.websiteUrl && { label: "Site web", url: artisan.websiteUrl, icon: "🌐" },
    artisan.facebook && { label: "Facebook", url: artisan.facebook, icon: "📘" },
    artisan.instagram && { label: "Instagram", url: artisan.instagram, icon: "📸" },
    artisan.linkedin && { label: "LinkedIn", url: artisan.linkedin, icon: "💼" },
    artisan.tiktok && { label: "TikTok", url: artisan.tiktok, icon: "🎵" },
  ].filter(Boolean) as { label: string; url: string; icon: string }[];

  return (
    <div className="w-full max-w-[1100px] px-4 md:px-8 pb-10">
      {/* Retour */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-dvianeutralvariant-40 hover:text-dviaprimary-40 transition-colors mb-6 cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
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

        {/* Info profil */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-8">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-dvianeutral-50 border-4 border-white flex items-center justify-center text-2xl font-bold text-dvianeutral-10 overflow-hidden">
                  {artisan.image ? (
                    <img
                      src={artisan.image}
                      alt={`${artisan.firstName} ${artisan.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  <span className="absolute">
                    {artisan.firstName?.charAt(0)}
                  </span>
                </div>
                {artisan.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00B983] rounded-full border-2 border-white flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mb-1">
                <h1 className="text-title-large font-semibold text-dvianeutral-10 leading-tight">
                  {artisan.companyName || `${artisan.firstName} ${artisan.lastName}`}
                </h1>
                <p className="text-sm text-dvianeutralvariant-60">
                  {artisan.firstName} {artisan.lastName}
                </p>
                <p className="text-sm font-medium text-dvianeutralvariant-40 mt-0.5">
                  {artisan.profession}
                  {artisan.category ? ` · ${artisan.category}` : ""}
                </p>
                {artisan.certifications.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {artisan.certifications.map((c) => (
                      <span
                        key={c}
                        className="border border-dvianeutralvariant-50 text-xs px-2 py-1 rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA + Note */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <p className="text-sm text-dvianeutralvariant-60 hidden md:block">
                Contactez cet artisan
              </p>
              <div className="relative group/devis">
                <button className="flex items-center gap-2 bg-dviaprimary-40/50 text-white text-sm font-medium px-5 py-2.5 rounded-8px cursor-not-allowed">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Demander un devis
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-dvianeutral-10 text-white text-xs rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover/devis:opacity-100 transition-opacity z-50">
                  Indisponible pour le moment
                </div>
              </div>
              {artisan.rating && (
                <div className="flex flex-col items-center bg-dvianeutral-94 border border-dvianeutral-50 px-4 py-2 rounded-8px">
                  <span className="text-dviaprimary-40 font-bold text-lg">
                    ★ {artisan.rating}
                  </span>
                  <span className="text-xs text-dvianeutralvariant-60">
                    {artisan.reviews} avis clients
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Corps en 2 colonnes */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Colonne principale */}
        <div className="flex-1 flex flex-col gap-6">
          {/* À propos */}
          {artisan.description && (
            <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
              <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-3">
                À propos
              </h2>
              <p className="text-sm text-dvianeutralvariant-40 leading-relaxed">
                {artisan.description}
              </p>
            </section>
          )}

          {/* Services proposés */}
          {servicesList.length > 0 && (
            <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
              <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
                Services proposés
              </h2>
              <div className="flex flex-wrap gap-2">
                {servicesList.map((service) => (
                  <span
                    key={service}
                    className="bg-dvianeutral-94 border border-dvianeutral-50 text-sm text-dvianeutralvariant-40 px-3 py-1.5 rounded-28px"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Réalisations */}
          <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
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
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-dvianeutral-94">
                      <img src={url} alt={`Réalisation ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))
                : Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-dvianeutral-94 rounded-xl animate-pulse" />
                  ))}
            </div>
          </section>

          {/* Garanties professionnelles */}
          {artisan.verified && (
            <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
              <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
                Garanties professionnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#00B983] text-white rounded-xl p-4 flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <p className="font-semibold text-sm">Identité vérifiée</p>
                    <p className="text-xs opacity-80">Pièce d&apos;identité validée</p>
                  </div>
                </div>
                <div className="bg-[#E8751A] text-white rounded-xl p-4 flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <p className="font-semibold text-sm">SIRET vérifié</p>
                    <p className="text-xs opacity-80">Entreprise enregistrée</p>
                  </div>
                </div>
                <div className="bg-[#2563EB] text-white rounded-xl p-4 flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <p className="font-semibold text-sm">Assurance Décennale</p>
                    <p className="text-xs opacity-80">Couverture garantie</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Colonne droite */}
        <div className="lg:w-[300px] shrink-0 flex flex-col gap-6">
          {/* Tarifs indicatifs */}
          <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
            <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
              Tarifs indicatifs
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {(artisan.hourlyRateMin || artisan.hourlyRateMax) && (
                <div className="border border-dvianeutral-50 rounded-8px p-3">
                  <p className="text-xs text-dvianeutralvariant-60 mb-1">Taux horaire</p>
                  <p className="text-sm font-semibold text-dvianeutral-10">
                    {artisan.hourlyRateMin}€ – {artisan.hourlyRateMax}€
                  </p>
                </div>
              )}
              {(artisan.dailyRateMin || artisan.dailyRateMax) && (
                <div className="border border-dvianeutral-50 rounded-8px p-3">
                  <p className="text-xs text-dvianeutralvariant-60 mb-1">Taux journalier</p>
                  <p className="text-sm font-semibold text-dvianeutral-10">
                    {artisan.dailyRateMin}€ – {artisan.dailyRateMax}€
                  </p>
                </div>
              )}
              {artisan.travelFee !== null && (
                <div className="border border-dvianeutral-50 rounded-8px p-3">
                  <p className="text-xs text-dvianeutralvariant-60 mb-1">Déplacement</p>
                  <p className="text-sm font-semibold text-dvianeutral-10">
                    {artisan.travelFee === 0 ? "Gratuit" : `${artisan.travelFee}€/km`}
                  </p>
                </div>
              )}
              {artisan.freeEstimate && (
                <div className="bg-dviaprimary-40 text-white text-sm font-medium rounded-8px p-3 flex flex-col items-center justify-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Devis gratuit
                </div>
              )}
            </div>
          </section>

          {/* Horaires */}
          {horaires.length > 0 && (
            <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
              <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
                Horaires
              </h2>
              <ul className="flex flex-col gap-2">
                {horaires.map(({ jour, plage }) => (
                  <li key={jour} className="flex items-center justify-between text-sm">
                    <span className="text-dvianeutralvariant-60">{jour}</span>
                    <span className={`font-medium ${plage === "Fermé" ? "text-dvianeutralvariant-60" : "text-dvianeutral-10"}`}>
                      {plage}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Sur le web */}
          {socialLinks.length > 0 && (
            <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
              <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
                Sur le web
              </h2>
              <ul className="flex flex-col gap-3">
                {socialLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-dviaprimary-40 hover:underline"
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Localisation */}
          <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
            <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-3">
              Localisation
            </h2>
            {artisan.location && (
              <div className="flex items-center gap-2 text-sm text-dvianeutralvariant-60">
                <img src={ICONS.artisanCard.location} alt="loc" className="w-4 h-4" />
                {artisan.location}
                {artisan.distance ? ` · ${artisan.distance}km` : ""}
              </div>
            )}
            {artisan.availability && (
              <div className="flex items-center gap-2 text-sm text-dvianeutralvariant-60 mt-1.5">
                <img src={ICONS.artisanCard.clock} alt="dispo" className="w-4 h-4" />
                {artisan.availability}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
