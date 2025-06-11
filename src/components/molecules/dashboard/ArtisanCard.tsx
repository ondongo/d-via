interface ArtisanCardProps {
  image: string;
  rating: number;
  reviews: number;
  verified: boolean;
  location: string;
  distance: string;
  availability: string;
  certifications: string[];
  onContactClick: () => void;
}

export const ArtisanCard = ({
  image,
  rating,
  reviews,
  verified,
  location,
  distance,
  availability,
  certifications,
  onContactClick,
}: ArtisanCardProps) => {
  return (
    <div className="  border border-dvianeutral-50 rounded-2xl  p-4 w-full max-w-xs">
      <div className="text-sm text-gray-500">Rénovation Habitat</div>
      <div className="text-xs text-gray-400 mb-2">
        Entreprise générale de rénovation
      </div>

      <img
        src={image}
        alt="Artisan work"
        className="rounded-xl mb-3 h-40 w-full object-cover"
      />

      <div className="flex items-center text-sm mb-1">
        <span className="text-dviaprimary-40">★ {rating}</span>
        <span className="text-gray-400 ml-1">({reviews})</span>
        {verified && (
          <span className="ml-auto border border-dvianeutralvariant-50  text-xs px-2 py-1 rounded">
            Vérifié
          </span>
        )}
      </div>

      <div className="text-xs text-gray-500 mb-1">
        {location} ({distance})
      </div>
      <div className="text-xs text-gray-500 mb-2">{availability}</div>

      <div className="flex gap-2 mb-2">
        {certifications.map((cert) => (
          <span
            key={cert}
            className="border border-dvianeutralvariant-50 text-xs px-2 py-1 rounded"
          >
            {cert}
          </span>
        ))}
      </div>

      <div className="flex flex-row gap-2">
        <button className="w-full border border-dvianeutral-50 text-dviaprimary-40 text-sm py-2 rounded">
          Contacter
        </button>

        <button className="max-w-[50px] w-full border bg-dviaprimary-40  text-white text-sm py-2 rounded-8px flex items-center justify-center">
          <img src="/icons/call.svg" alt="" className="w-[14px] h-[14px]" />
        </button>
      </div>
    </div>
  );
};
