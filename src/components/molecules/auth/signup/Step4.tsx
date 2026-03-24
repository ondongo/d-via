"use client";

import { useState, useEffect } from "react";
import { useSignupStore } from "@/stores/signupStore";
import { useSignupForm } from "@/hooks/useSignupForm";
import ImageUploadMultiple from "../../ImageUploadMultiple";

const PREDEFINED_SERVICES = [
  "Plomberie",
  "Électricité",
  "Peinture",
  "Carrelage",
  "Maçonnerie",
  "Menuiserie",
  "Couverture / Toiture",
  "Isolation",
  "Rénovation complète",
  "Chauffage / Climatisation",
];

const DELAY_OPTIONS = [
  { value: "sous_24h", label: "Sous 24h", sublabel: "Urgences" },
  { value: "sous_48h", label: "Sous 48h", sublabel: "Rapide" },
  { value: "sous_1_semaine", label: "Sous 1 semaine", sublabel: "Standard" },
  { value: "sous_2_semaines", label: "Sous 2 semaines", sublabel: "Planifié" },
  { value: "sous_1_mois", label: "Sous 1 mois", sublabel: "Flexible" },
  { value: "sur_devis", label: "Sur devis", sublabel: "Selon projet" },
];

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

type ScheduleDay = {
  day: string;
  enabled: boolean;
  amStart: string;
  amEnd: string;
  pmStart: string;
  pmEnd: string;
};

const DEFAULT_SCHEDULE: ScheduleDay[] = DAYS.map((day, i) => ({
  day,
  enabled: i < 5,
  amStart: "08:00",
  amEnd: "12:00",
  pmStart: "13:00",
  pmEnd: "18:00",
}));

export default function Step4() {
  const { getStepPart } = useSignupStore();
  const { loadFormData, saveFormData } = useSignupForm();
  const step4Part = getStepPart(4);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState("");
  const [interventionDelay, setInterventionDelay] = useState("");
  const [hourlyRateMin, setHourlyRateMin] = useState("");
  const [hourlyRateMax, setHourlyRateMax] = useState("");
  const [dailyRateMin, setDailyRateMin] = useState("");
  const [dailyRateMax, setDailyRateMax] = useState("");
  const [travelFee, setTravelFee] = useState("");
  const [freeEstimate, setFreeEstimate] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleDay[]>(DEFAULT_SCHEDULE);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [workPhotos, setWorkPhotos] = useState<
    Array<{ base64: string; name: string; type: string }>
  >([]);

  useEffect(() => {
    const data = loadFormData();
    if (data.services) {
      try {
        const parsed = JSON.parse(data.services);
        if (Array.isArray(parsed)) setSelectedServices(parsed);
      } catch {
        setSelectedServices(
          data.services.split(",").map((s: string) => s.trim()).filter(Boolean)
        );
      }
    }
    if (data.interventionDelay) setInterventionDelay(data.interventionDelay);
    if (data.hourlyRateMin) setHourlyRateMin(data.hourlyRateMin);
    if (data.hourlyRateMax) setHourlyRateMax(data.hourlyRateMax);
    if (data.dailyRateMin) setDailyRateMin(data.dailyRateMin);
    if (data.dailyRateMax) setDailyRateMax(data.dailyRateMax);
    if (data.travelFee) setTravelFee(data.travelFee);
    if (data.freeEstimate !== undefined) setFreeEstimate(data.freeEstimate);
    if (data.schedule) {
      try {
        const parsed = JSON.parse(data.schedule);
        if (Array.isArray(parsed)) setSchedule(parsed);
      } catch { /* keep default */ }
    }
    if (data.facebook) setFacebook(data.facebook);
    if (data.instagram) setInstagram(data.instagram);
    if (data.linkedin) setLinkedin(data.linkedin);
    if (data.tiktok) setTiktok(data.tiktok);
    if (data.websiteUrl) setWebsite(data.websiteUrl);
    if (data.description) setDescription(data.description);
    if (data.workPhotos && Array.isArray(data.workPhotos)) {
      const arr = data.workPhotos as Array<{
        base64: string;
        name: string;
        type: string;
      }>;
      if (arr.length > 0 && arr[0]?.base64) setWorkPhotos(arr);
    }
  }, [loadFormData]);

  const toggleService = (service: string) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    setSelectedServices(updated);
    saveFormData({ services: JSON.stringify(updated) }, true);
  };

  const addCustomService = () => {
    const trimmed = customService.trim();
    if (trimmed && !selectedServices.includes(trimmed)) {
      const updated = [...selectedServices, trimmed];
      setSelectedServices(updated);
      setCustomService("");
      saveFormData({ services: JSON.stringify(updated) }, true);
    }
  };

  const updateScheduleDay = (
    index: number,
    field: keyof ScheduleDay,
    value: string | boolean
  ) => {
    const updated = schedule.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setSchedule(updated);
    saveFormData({ schedule: JSON.stringify(updated) }, true);
  };

  // ─── Part 1: Services ───
  if (step4Part === 1) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-[600px]">
        <h2 className="text-xl font-bold text-dvianeutral-10">
          Liste des services proposés
        </h2>
        <p className="text-sm text-dvianeutralvariant-40 mb-2">
          Sélectionnez ou ajoutez les services que vous proposez à vos clients.
        </p>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-dvianeutralvariant-40">
            Service personnalisé
          </label>
          <input
            type="text"
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomService()}
            placeholder="Serrurerie"
            className="w-full px-4 py-3 border border-dvianeutral-50 rounded-md focus:border-dviaprimary-40 focus:outline-none"
          />
          <button
            onClick={addCustomService}
            className="w-full py-3 bg-dviaprimary-40 text-white font-medium rounded-md hover:bg-dviaprimary-30 transition-colors cursor-pointer"
          >
            + Ajouter
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {PREDEFINED_SERVICES.map((service) => {
            const isSelected = selectedServices.includes(service);
            return (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className={`px-4 py-2 rounded-28px border text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-dviaprimary-40 text-white border-dviaprimary-40"
                    : "bg-white text-dvianeutral-10 border-dvianeutral-50 hover:border-dviaprimary-40"
                }`}
              >
                {isSelected && (
                  <span className="mr-1.5">✓</span>
                )}
                {service}
              </button>
            );
          })}
          {selectedServices
            .filter((s) => !PREDEFINED_SERVICES.includes(s))
            .map((service) => (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className="px-4 py-2 rounded-28px border text-sm font-medium bg-dviaprimary-40 text-white border-dviaprimary-40 transition-all cursor-pointer"
              >
                <span className="mr-1.5">✓</span>
                {service}
              </button>
            ))}
        </div>
      </div>
    );
  }

  // ─── Part 2: Délais d'intervention ───
  if (step4Part === 2) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-[600px]">
        <h2 className="text-xl font-bold text-dvianeutral-10">
          Délais d&apos;intervention
        </h2>
        <p className="text-sm text-dvianeutralvariant-40 mb-2">
          Indiquez vos délais moyens d&apos;intervention pour que les clients
          sachent à quoi s&apos;attendre.
        </p>

        <div className="flex flex-col gap-3">
          {DELAY_OPTIONS.map((opt) => {
            const isSelected = interventionDelay === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setInterventionDelay(opt.value);
                  saveFormData({ interventionDelay: opt.value }, true);
                }}
                className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-dviaprimary-40 bg-dviasecondary-90"
                    : "border-dvianeutral-50 bg-white hover:border-dvianeutral-40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isSelected
                        ? "bg-dviaprimary-40 text-white"
                        : "bg-dvianeutral-94 text-dvianeutralvariant-40"
                    }`}
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
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-dvianeutral-10 text-sm">
                      {opt.label}
                    </p>
                    <p className="text-xs text-dvianeutralvariant-40">
                      {opt.sublabel}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? "border-dviaprimary-40"
                      : "border-dvianeutral-50"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-dviaprimary-40" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Part 3: Tarifs indicatifs ───
  if (step4Part === 3) {
    return (
      <div className="flex flex-col gap-5 w-full max-w-[600px]">
        <h2 className="text-xl font-bold text-dvianeutral-10">
          Tarifs indicatifs
        </h2>
        <p className="text-sm text-dvianeutralvariant-40">
          Donnez une idée de vos tarifs pour aider les clients dans leur choix.
          Ces informations restent indicatives.
        </p>

        <div>
          <p className="font-semibold text-sm text-dvianeutral-10 mb-2">
            Taux horaire
          </p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-dvianeutralvariant-40">
                Min
              </label>
              <input
                type="number"
                value={hourlyRateMin}
                onChange={(e) => {
                  setHourlyRateMin(e.target.value);
                  saveFormData({ hourlyRateMin: e.target.value }, true);
                }}
                className="w-full px-3 py-3 border border-dvianeutral-50 rounded-md focus:border-dviaprimary-40 focus:outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dvianeutralvariant-40">
                €
              </span>
            </div>
            <span className="text-dvianeutralvariant-40 text-sm">à</span>
            <div className="relative flex-1">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-dvianeutralvariant-40">
                Max
              </label>
              <input
                type="number"
                value={hourlyRateMax}
                onChange={(e) => {
                  setHourlyRateMax(e.target.value);
                  saveFormData({ hourlyRateMax: e.target.value }, true);
                }}
                className="w-full px-3 py-3 border border-dvianeutral-50 rounded-md focus:border-dviaprimary-40 focus:outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dvianeutralvariant-40">
                €
              </span>
            </div>
            <span className="text-sm text-dvianeutralvariant-40 whitespace-nowrap">
              /heure
            </span>
          </div>
        </div>

        <div>
          <p className="font-semibold text-sm text-dvianeutral-10 mb-2">
            Taux journalier
          </p>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-dvianeutralvariant-40">
                Min
              </label>
              <input
                type="number"
                value={dailyRateMin}
                onChange={(e) => {
                  setDailyRateMin(e.target.value);
                  saveFormData({ dailyRateMin: e.target.value }, true);
                }}
                className="w-full px-3 py-3 border border-dvianeutral-50 rounded-md focus:border-dviaprimary-40 focus:outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dvianeutralvariant-40">
                €
              </span>
            </div>
            <span className="text-dvianeutralvariant-40 text-sm">à</span>
            <div className="relative flex-1">
              <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] text-dvianeutralvariant-40">
                Max
              </label>
              <input
                type="number"
                value={dailyRateMax}
                onChange={(e) => {
                  setDailyRateMax(e.target.value);
                  saveFormData({ dailyRateMax: e.target.value }, true);
                }}
                className="w-full px-3 py-3 border border-dvianeutral-50 rounded-md focus:border-dviaprimary-40 focus:outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dvianeutralvariant-40">
                €
              </span>
            </div>
            <span className="text-sm text-dvianeutralvariant-40 whitespace-nowrap">
              /jour
            </span>
          </div>
        </div>

        <div>
          <p className="font-semibold text-sm text-dvianeutral-10 mb-2">
            Frais de déplacement
          </p>
          <div className="flex items-center gap-2">
            <div className="relative w-32">
              <input
                type="number"
                step="0.01"
                value={travelFee}
                onChange={(e) => {
                  setTravelFee(e.target.value);
                  saveFormData({ travelFee: e.target.value }, true);
                }}
                className="w-full px-3 py-3 border border-dvianeutral-50 rounded-md focus:border-dviaprimary-40 focus:outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-dvianeutralvariant-40">
                €
              </span>
            </div>
            <span className="text-sm text-dvianeutralvariant-40">/km</span>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer mt-1">
          <div
            className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
              freeEstimate
                ? "bg-dviaprimary-40 border-dviaprimary-40"
                : "border-dvianeutral-50 bg-white"
            }`}
            onClick={() => {
              const val = !freeEstimate;
              setFreeEstimate(val);
              saveFormData({ freeEstimate: val }, true);
            }}
          >
            {freeEstimate && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="text-sm font-medium text-dvianeutral-10">
            Devis gratuit
          </span>
        </label>
      </div>
    );
  }

  // ─── Part 4: Horaires ───
  if (step4Part === 4) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-[650px]">
        <h2 className="text-xl font-bold text-dvianeutral-10">Vos horaires</h2>
        <p className="text-sm text-dvianeutralvariant-40 mb-2">
          Indiquez vos horaires de disponibilité pour que les clients sachent
          quand vous contacter.
        </p>

        <div className="flex flex-col gap-3">
          {schedule.map((s, idx) => (
            <div
              key={s.day}
              className="flex items-center gap-3 py-3 px-4 border border-dvianeutral-50 rounded-xl"
            >
              <span className="w-20 text-sm font-medium text-dvianeutral-10 shrink-0">
                {s.day}
              </span>

              {/* Toggle */}
              <button
                onClick={() => updateScheduleDay(idx, "enabled", !s.enabled)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
                  s.enabled ? "bg-dviaprimary-40" : "bg-dvianeutral-50"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    s.enabled ? "translate-x-5.5" : "translate-x-0.5"
                  }`}
                />
              </button>

              {/* Time inputs */}
              <div
                className={`flex items-center gap-1.5 flex-1 ${
                  !s.enabled ? "opacity-40 pointer-events-none" : ""
                }`}
              >
                <span className="text-[10px] text-dvianeutralvariant-40">AM</span>
                <input
                  type="time"
                  value={s.amStart}
                  onChange={(e) =>
                    updateScheduleDay(idx, "amStart", e.target.value)
                  }
                  className="w-[70px] text-xs px-1.5 py-1.5 border border-dvianeutral-50 rounded focus:outline-none focus:border-dviaprimary-40"
                />
                <span className="text-xs text-dvianeutralvariant-40">à</span>
                <span className="text-[10px] text-dvianeutralvariant-40">AM</span>
                <input
                  type="time"
                  value={s.amEnd}
                  onChange={(e) =>
                    updateScheduleDay(idx, "amEnd", e.target.value)
                  }
                  className="w-[70px] text-xs px-1.5 py-1.5 border border-dvianeutral-50 rounded focus:outline-none focus:border-dviaprimary-40"
                />
                <span className="text-xs text-dvianeutralvariant-40">/</span>
                <span className="text-[10px] text-dvianeutralvariant-40">PM</span>
                <input
                  type="time"
                  value={s.pmStart}
                  onChange={(e) =>
                    updateScheduleDay(idx, "pmStart", e.target.value)
                  }
                  className="w-[70px] text-xs px-1.5 py-1.5 border border-dvianeutral-50 rounded focus:outline-none focus:border-dviaprimary-40"
                />
                <span className="text-xs text-dvianeutralvariant-40">à</span>
                <span className="text-[10px] text-dvianeutralvariant-40">PM</span>
                <input
                  type="time"
                  value={s.pmEnd}
                  onChange={(e) =>
                    updateScheduleDay(idx, "pmEnd", e.target.value)
                  }
                  className="w-[70px] text-xs px-1.5 py-1.5 border border-dvianeutral-50 rounded focus:outline-none focus:border-dviaprimary-40"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Part 5: Réseaux sociaux ───
  if (step4Part === 5) {
    const socialFields = [
      {
        key: "facebook",
        label: "Facebook",
        value: facebook,
        setter: setFacebook,
        placeholder: "https://facebook.com/votre-page",
        color: "#1877F2",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        ),
      },
      {
        key: "instagram",
        label: "Instagram",
        value: instagram,
        setter: setInstagram,
        placeholder: "https://instagram.com/votre-profil",
        color: "#E4405F",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        ),
      },
      {
        key: "linkedin",
        label: "LinkedIn",
        value: linkedin,
        setter: setLinkedin,
        placeholder: "https://linkedin.com/in/votre-profil",
        color: "#0A66C2",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        ),
      },
      {
        key: "tiktok",
        label: "TikTok",
        value: tiktok,
        setter: setTiktok,
        placeholder: "https://tiktok.com/@votre-profil",
        color: "#000000",
        icon: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        ),
      },
      {
        key: "websiteUrl",
        label: "Votre site",
        value: website,
        setter: setWebsite,
        placeholder: "https://www.votre-site.com",
        color: "#E8751A",
        icon: (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-6 h-6"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        ),
      },
    ];

    return (
      <div className="flex flex-col gap-4 w-full max-w-[600px]">
        <h2 className="text-xl font-bold text-dvianeutral-10">
          Liens vers vos réseaux sociaux
        </h2>
        <p className="text-sm text-dvianeutralvariant-40 mb-2">
          Ajoutez vos réseaux sociaux pour renforcer votre visibilité et
          crédibilité.
        </p>

        <div className="flex flex-col gap-4">
          {socialFields.map((field) => (
            <div key={field.key} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white"
                style={{ backgroundColor: field.color }}
              >
                {field.icon}
              </div>
              <div className="flex-1">
                <label className="text-xs text-dvianeutralvariant-40">
                  {field.label}
                </label>
                <input
                  type="url"
                  value={field.value}
                  onChange={(e) => {
                    field.setter(e.target.value);
                    saveFormData({ [field.key]: e.target.value }, true);
                  }}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 border border-dvianeutral-50 rounded-md focus:border-dviaprimary-40 focus:outline-none text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Part 7: Photos de travaux ───
  if (step4Part === 7) {
    return (
      <div className="flex flex-col p-8 max-w-[600px] min-h-[272px] gap-4">
        <h2 className="text-xl font-bold text-dvianeutral-10">
          Ajoutez quelques photos de vos travaux
        </h2>
        <p className="text-dvianeutral-10 mb-4">
          Pour commencer, vous aurez besoin de 3 photos. Vous pourrez en ajouter
          d&apos;autres ou faire des modifications plus tard.
        </p>
        <ImageUploadMultiple
          maxImages={3}
          onImagesChange={(images) => {
            setWorkPhotos(images);
            saveFormData({ workPhotos: images }, true);
          }}
          initialImages={workPhotos}
          allowPdf={false}
        />
      </div>
    );
  }

  // ─── Part 6: Description (default / fallback) ───
  return (
    <div className="flex flex-col gap-4 w-full max-w-[600px]">
      <h2 className="text-xl font-bold text-dvianeutral-10">
        Créez votre description
      </h2>
      <p className="text-dvianeutral-10 mb-4">
        Partagez ce qui vous rend unique.
      </p>
      <textarea
        placeholder="Décrivez votre entreprise, vos services, votre expérience..."
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          useSignupStore.getState().setDescription(e.target.value);
          saveFormData({ description: e.target.value }, true);
        }}
        rows={8}
        className="w-full px-4 py-3 border border-dvianeutral-50 rounded-md focus:border-dviaprimary-40 focus:outline-none resize-none"
      />
    </div>
  );
}
