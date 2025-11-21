export const SkeletonArtisanCard = () => {
  return (
    <div className="animate-pulse border border-dvianeutral-50 rounded-2xl px-4 w-full md:max-w-xs min-h-[450px]">
      {/* Header avec avatar et nom */}
      <div className="flex items-center justify-between py-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dvianeutral-94" />
          <div>
            <div className="h-4 bg-dvianeutral-94 rounded w-32 mb-2" />
            <div className="h-3 bg-dvianeutral-94 rounded w-24" />
          </div>
        </div>
        <div className="w-4 h-4 bg-dvianeutral-94 rounded" />
      </div>
      
      {/* Image */}
      <div className="bg-dvianeutral-94 h-40 w-full rounded-xl mb-3" />
      
      {/* Rating et verified */}
      <div className="flex items-center text-sm mb-1">
        <div className="h-4 bg-dvianeutral-94 rounded w-12" />
        <div className="h-4 bg-dvianeutral-94 rounded w-8 ml-1" />
        <div className="ml-auto h-5 bg-dvianeutral-94 rounded w-16" />
      </div>
      
      {/* Location */}
      <div className="flex items-center gap-2 mt-6 mb-2">
        <div className="w-4 h-4 bg-dvianeutral-94 rounded" />
        <div className="h-3 bg-dvianeutral-94 rounded w-24" />
      </div>
      
      {/* Availability */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-4 h-4 bg-dvianeutral-94 rounded" />
        <div className="h-3 bg-dvianeutral-94 rounded w-20" />
      </div>
      
      {/* Certifications */}
      <div className="flex gap-2 mb-2">
        <div className="h-6 bg-dvianeutral-94 rounded w-16" />
        <div className="h-6 bg-dvianeutral-94 rounded w-20" />
      </div>
      
      {/* Boutons */}
      <div className="flex flex-row gap-2">
        <div className="w-full h-10 bg-dvianeutral-94 rounded" />
        <div className="w-[50px] h-10 bg-dvianeutral-94 rounded-8px" />
      </div>
    </div>
  );
};

