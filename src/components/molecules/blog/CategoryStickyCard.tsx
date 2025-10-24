"use client";

interface CategoryStickyCardProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryStickyCard({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryStickyCardProps) {
  return (
    <div className="sticky top-4 bg-dvianeutral-96 border border-dvianeutral-50 rounded-2xl p-4 mb-6">
      <h3 className="text-sm font-semibold text-dvianeutral-10 mb-3">
        Catégories
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("Tous")}
          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
            selectedCategory === "Tous"
              ? "bg-dviaprimary-40 text-white border-dviaprimary-40"
              : "bg-dvianeutral-94 text-dvianeutral-30 border-dvianeutral-50 hover:bg-dvianeutral-90"
          }`}
        >
          Tous
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              selectedCategory === category
                ? "bg-dviaprimary-40 text-white border-dviaprimary-40"
                : "bg-dvianeutral-94 text-dvianeutral-30 border-dvianeutral-50 hover:bg-dvianeutral-90"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
