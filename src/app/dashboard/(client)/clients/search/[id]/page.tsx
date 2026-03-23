"use client";

import { ICONS } from "@/constants/icons";
import { useParams, useRouter } from "next/navigation";

// ─── Données mockées (partagées avec artisans-recommandes) ──────────
const ARTISANS_DETAIL: Record<
  string,
  {
    initiale: string;
    nom: string;
    prenom: string;
    entreprise: string;
    specialite: string;
    note: number;
    avis: number;
    verifie: boolean;
    certifications: string[];
    apropos: string;
    services: string[];
    tarifHoraireMin: number;
    tarifHoraireMax: number;
    tarifJournalierMin: number;
    tarifJournalierMax: number;
    deplacement: string;
    horaires: { jour: string; plage: string }[];
    localisation: string;
    distance: string;
    disponibilite: string;
  }
> = {
  "artisan-1": {
    initiale: "R",
    nom: "Rénovation Habitat",
    prenom: "Matys Coantin",
    entreprise: "D-VIA",
    specialite: "Plomberie & Rénovation",
    note: 4.8,
    avis: 214,
    verifie: true,
    certifications: ["RGE", "Qualibat"],
    apropos:
      "Artisan passionné avec plus de 10 ans d'expérience dans la rénovation complète et le dépannage d'urgence. Je m'engage à fournir un travail de qualité, respectueux des normes, et à accompagner mes clients dans chaque étape de leur projet. Ponctualité et propreté du chantier garanties.",
    services: ["Plomberie", "Chauffage", "Rénovation", "Climatisation"],
    tarifHoraireMin: 45,
    tarifHoraireMax: 70,
    tarifJournalierMin: 350,
    tarifJournalierMax: 500,
    deplacement: "1,5€/km",
    horaires: [
      { jour: "Lundi", plage: "08:00 – 18h00" },
      { jour: "Mardi", plage: "08:00 – 18h00" },
      { jour: "Mercredi", plage: "08:00 – 18h00" },
      { jour: "Jeudi", plage: "08:00 – 18h00" },
      { jour: "Vendredi", plage: "08:00 – 17h00" },
      { jour: "Samedi", plage: "09:00 – 13h00" },
    ],
    localisation: "Paris, 75011",
    distance: "5km",
    disponibilite: "Disponible dans 2 semaines",
  },
};

// Fallback pour les IDs non définis
const FALLBACK_ARTISAN = ARTISANS_DETAIL["artisan-1"];

// ─── Page ─────────────────────────────────────────────────────────
export default function DetailArtisanPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const artisan = ARTISANS_DETAIL[params.id] ?? FALLBACK_ARTISAN;

  const handleContact = () => {
    router.push("/dashboard/clients/messages");
  };

  return (
    <div className="w-full max-w-[1100px] px-4 md:px-8 pb-10">
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
        Retour à la recherche
      </button>

      {/* Header profil */}
      <div className="border border-dvianeutral-50 rounded-2xl overflow-hidden mb-6">
        {/* Bannière */}
        <div className="relative w-full h-36 bg-dvianeutral-94">
          <div className="absolute inset-0 bg-gradient-to-r from-dvianeutral-94 to-dvianeutral-50 opacity-60" />
          {/* Dégradé décoratif mock */}
          <div className="absolute inset-0 flex items-center justify-end pr-8 opacity-20">
            <div className="w-48 h-48 rounded-full bg-dviaprimary-40 blur-3xl" />
          </div>
        </div>

        {/* Info profil */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-8">
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-dvianeutral-50 border-4 border-white flex items-center justify-center text-2xl font-bold text-dvianeutral-10 overflow-hidden">
                  <img
                    src={`/dashboard/artisan/avatar-mock.jpg`}
                    alt={artisan.prenom}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <span className="absolute">{artisan.initiale}</span>
                </div>
                {artisan.verifie && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00B983] rounded-full border-2 border-white flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mb-1">
                <h1 className="text-title-large font-semibold text-dvianeutral-10 leading-tight">
                  {artisan.nom}
                </h1>
                <p className="text-sm text-dvianeutralvariant-60">{artisan.prenom}</p>
                <p className="text-sm font-medium text-dvianeutralvariant-40 mt-0.5">
                  {artisan.specialite}
                </p>
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
              </div>
            </div>

            {/* CTA + Note */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <p className="text-sm text-dvianeutralvariant-60 hidden md:block">
                Contactez cet artisan
              </p>
              <button
                onClick={handleContact}
                className="flex items-center gap-2 bg-dviaprimary-40 text-white text-sm font-medium px-5 py-2.5 rounded-8px hover:shadow-md transition-shadow cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Demander un devis
              </button>
              <div className="flex flex-col items-center bg-dvianeutral-94 border border-dvianeutral-50 px-4 py-2 rounded-8px">
                <span className="text-dviaprimary-40 font-bold text-lg">
                  ★ {artisan.note}
                </span>
                <span className="text-xs text-dvianeutralvariant-60">
                  {artisan.avis} avis clients
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corps en 2 colonnes */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Colonne principale */}
        <div className="flex-1 flex flex-col gap-6">
          {/* À propos */}
          <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
            <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-3">
              À propos
            </h2>
            <p className="text-sm text-dvianeutralvariant-40 leading-relaxed">
              {artisan.apropos}
            </p>
          </section>

          {/* Services proposés */}
          <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
            <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
              Services proposés
            </h2>
            <div className="flex flex-wrap gap-2">
              {artisan.services.map((service) => (
                <span
                  key={service}
                  className="bg-dvianeutral-94 border border-dvianeutral-50 text-sm text-dvianeutralvariant-40 px-3 py-1.5 rounded-28px"
                >
                  {service}
                </span>
              ))}
            </div>
          </section>

          {/* Réalisations — placeholder */}
          <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-title-large font-semibold text-dvianeutral-10">
                Réalisations
              </h2>
              <button className="text-sm text-dviaprimary-40 hover:underline cursor-pointer">
                Voir tout (5)
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-dvianeutral-94 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </section>
        </div>

        {/* Colonne droite */}
        <div className="lg:w-[280px] shrink-0 flex flex-col gap-6">
          {/* Tarifs indicatifs */}
          <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
            <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
              Tarifs indicatifs
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-dvianeutral-50 rounded-8px p-3">
                <p className="text-xs text-dvianeutralvariant-60 mb-1">
                  Taux horaire
                </p>
                <p className="text-sm font-semibold text-dvianeutral-10">
                  {artisan.tarifHoraireMin}€ – {artisan.tarifHoraireMax}€
                </p>
              </div>
              <div className="border border-dvianeutral-50 rounded-8px p-3">
                <p className="text-xs text-dvianeutralvariant-60 mb-1">
                  Taux journalier
                </p>
                <p className="text-sm font-semibold text-dvianeutral-10">
                  {artisan.tarifJournalierMin}€ – {artisan.tarifJournalierMax}€
                </p>
              </div>
              <div className="border border-dvianeutral-50 rounded-8px p-3">
                <p className="text-xs text-dvianeutralvariant-60 mb-1">
                  Déplacement
                </p>
                <p className="text-sm font-semibold text-dvianeutral-10">
                  {artisan.deplacement}
                </p>
              </div>
              <button
                onClick={handleContact}
                className="bg-dviaprimary-40 text-white text-sm font-medium rounded-8px p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:shadow-md transition-shadow"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Devis gratuit
              </button>
            </div>
          </section>

          {/* Horaires */}
          <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
            <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-4">
              Horaires
            </h2>
            <ul className="flex flex-col gap-2">
              {artisan.horaires.map(({ jour, plage }) => (
                <li
                  key={jour}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-dvianeutralvariant-60">{jour}</span>
                  <span className="text-dvianeutral-10 font-medium">{plage}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Localisation */}
          <section className="bg-white border border-dvianeutral-50 rounded-2xl p-6">
            <h2 className="text-title-large font-semibold text-dvianeutral-10 mb-3">
              Localisation
            </h2>
            <div className="flex items-center gap-2 text-sm text-dvianeutralvariant-60">
              <img src={ICONS.artisanCard.location} alt="loc" className="w-4 h-4" />
              {artisan.localisation} · {artisan.distance}
            </div>
            <div className="flex items-center gap-2 text-sm text-dvianeutralvariant-60 mt-1.5">
              <img src={ICONS.artisanCard.clock} alt="dispo" className="w-4 h-4" />
              {artisan.disponibilite}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
