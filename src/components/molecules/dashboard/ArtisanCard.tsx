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
    <div className="  border border-dvianeutral-50 rounded-2xl  px-4 w-full md:max-w-xs min-h-[450px]">
      <div className="flex items-center justify-between py-4  rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dviaprimary-90 flex items-center justify-center text-dviaprimary-10 font-semibold">
            A
          </div>
          <div>
            <div className="text-sm text-gray-800 font-medium">
              Rénovation Habitat
            </div>
            <div className="text-xs text-gray-500 max-w-[150px] truncate overflow-hidden whitespace-nowrap">
              Entreprise générale de rénovation
            </div>
          </div>
        </div>

        <img
          src="/dashboard/card/threePoints.svg"
          alt="Options"
          className="w-4 h-4 cursor-pointer"
        />
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
          <div className="ml-auto border border-dvianeutralvariant-50  text-xs px-2 py-1 rounded flex flex-row gap-2 justify-content-center items-center">
            <img
              src="/dashboard/card/check.svg"
              alt="loc"
              className="w-3 h-3"
            />{" "}
            Vérifié
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 mb-2 flex flex-row gap-2 justify-content-center items-center mt-6 ">
        <img src="/dashboard/card/location.svg" alt="loc" className="w-4 h-4" />
        {location} ({distance})
      </div>
      <div className="text-xs text-gray-500 mb-6 flex flex-row gap-2 justify-content-center items-center ">
        <img src="/dashboard/card/clock.svg" alt="loc" className="w-4 h-4" />
        {availability}
      </div>

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
        <button className="w-full border border-dvianeutral-50 text-dviaprimary-40 text-sm py-2 rounded flex flex-row gap-2 justify-center items-center px-4 cursor-pointer">
          <img
            src="/dashboard/card/contact.svg"
            alt="loc"
            className="w-4 h-4"
          />{" "}
          Contacter
        </button>

        <button className="max-w-[50px] w-full border bg-dviaprimary-40  text-white text-sm py-2 rounded-8px flex items-center justify-center cursor-pointer">
          <img src="/icons/call.svg" alt="" className="w-[14px] h-[14px]" />
        </button>
      </div>
    </div>
  );
};
