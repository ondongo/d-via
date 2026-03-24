"use client";

import { ICONS } from "@/constants/icons";
import { useRouter } from "next/navigation";

interface ArtisanCardProps {
  id: string;
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
  onContactClick: () => void;
}

export const ArtisanCard = ({
  id,
  image,
  rating,
  reviews,
  verified,
  location,
  distance,
  availability,
  certifications,
  companyName,
  profession,
  firstName,
  lastName,
  onContactClick,
}: ArtisanCardProps) => {
  const router = useRouter();
  const displayName =
    companyName || `${firstName ?? ""} ${lastName ?? ""}`.trim() || "Artisan";
  const initials = displayName.slice(0, 1).toUpperCase();
  const subtitle = profession || "Artisan";

  return (
    <div
      className="border border-dvianeutral-50 rounded-2xl px-4 w-full md:max-w-xs min-h-[450px] cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/dashboard/clients/search/${id}`)}
    >
      <div className="flex items-center justify-between py-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dviaprimary-90 flex items-center justify-center text-dviaprimary-10 font-semibold shrink-0">
            {initials}
          </div>
          <div>
            <div className="text-sm text-gray-800 font-medium truncate max-w-[150px]">
              {displayName}
            </div>
            <div className="text-xs text-gray-500 max-w-[150px] truncate overflow-hidden whitespace-nowrap">
              {subtitle}
            </div>
          </div>
        </div>

        <img
          src={ICONS.artisanCard.moreMenu}
          alt="Options"
          className="w-4 h-4 cursor-pointer"
        />
      </div>
      <img
        src={image || "/illustrations/avatar-placeholder.svg"}
        alt={displayName}
        className="rounded-xl mb-3 h-40 w-full object-cover"
      />

      <div className="flex items-center text-sm mb-1">
        <span className="text-dviaprimary-40">★ {rating}</span>
        <span className="text-gray-400 ml-1">({reviews})</span>
        {verified && (
          <div className="ml-auto border border-dvianeutralvariant-50 text-xs px-2 py-1 rounded flex flex-row gap-2 justify-content-center items-center">
            <img
              src={ICONS.artisanCard.verified}
              alt="vérifié"
              className="w-3 h-3"
            />
            Vérifié
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 mb-2 flex flex-row gap-2 justify-content-center items-center mt-6">
        <img
          src={ICONS.artisanCard.location}
          alt="localisation"
          className="w-4 h-4"
        />
        {location} ({distance})
      </div>
      <div className="text-xs text-gray-500 mb-6 flex flex-row gap-2 justify-content-center items-center">
        <img
          src={ICONS.artisanCard.clock}
          alt="disponibilité"
          className="w-4 h-4"
        />
        {availability}
      </div>

      <div className="flex gap-2 mb-2 flex-wrap">
        {certifications.slice(0, 2).map((cert) => (
          <span
            key={cert}
            className="border border-dvianeutralvariant-50 text-xs px-2 py-1 rounded"
          >
            {cert}
          </span>
        ))}
      </div>

      <div className="flex flex-row gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onContactClick();
          }}
          className="w-full border border-dvianeutral-50 text-dviaprimary-40 text-sm py-2 rounded flex flex-row gap-2 justify-center items-center px-4 cursor-pointer"
        >
          <img
            src={ICONS.artisanCard.contact}
            alt="contacter"
            className="w-4 h-4"
          />
          Contacter
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/clients/search/${id}`);
          }}
          className="max-w-[90px] w-full border bg-dviaprimary-40 text-white text-sm py-2 rounded-8px flex items-center justify-center gap-2 cursor-pointer"
        >
          <img
            src={ICONS.artisanCard.userWhite}
            alt="Profil"
            className="w-[14px] h-[14px]"
          />
          Profil
        </button>
      </div>
    </div>
  );
};
