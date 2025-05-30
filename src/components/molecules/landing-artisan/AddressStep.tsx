"use client";
import React, { useState } from "react";

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

function AddressStep({ onBack, onSelectAddress }: any) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);

  const searchAddress = async (value: string) => {
    setQuery(value);

    if (!value) return setResults([]);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=fr&limit=3&q=${value}`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setResults(data);
      } else {
        console.log("Données inattendues :", data);
        setResults([]);
      }
    } catch (err) {
      console.log("Erreur de requête :", err);
      setResults([]);
    }
  };

  return (
    <div className="w-full p-4 flex flex-col  bg-red-50 rounded-xl px-16 md:px-4">
      <div
        className={` border px-4 py-3 flex items-center gap-2 ${
          query
            ? "rounded-t-28px border-dvianeutral-50 bg-dvianeutral-96"
            : "rounded-full border-dvianeutralvariant-30 bg-white"
        }`}
      >
        <img src="/icons/LocationBlue.svg" alt="loc" className="w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => searchAddress(e.target.value)}
          placeholder="Où êtes-vous situé ?"
          className="flex-1 text-sm font-bold text-dvianeutralvariant-30 outline-none placeholder:dvianeutralvariant-30 placeholder:text-sm placeholder:font-normal"
        />
        {query && (
          <button
            className="cursor-pointer"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Address Results */}
      {query != "" && (
        <>
          {" "}
          <div
            className={`bg-white border border-dvianeutral-50  overflow-hidden rounded-b-28px
            mb-4 }`}
          >
            {results.length > 0
              ? results.slice(0, 3).map((r: NominatimResult, i: number) => (
                  <div
                    key={i}
                    onClick={() => {
                      onBack();
                      onSelectAddress(
                        r.display_name,
                        parseFloat(r.lat),
                        parseFloat(r.lon)
                      );
                    }}
                    className={`flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-100 cursor-pointer ${
                      i !== results.length - 1
                        ? "border-b border-dvianeutral-50"
                        : ""
                    }`}
                  >
                    <img src="/icons/OutlineLocation.svg" className="w-4 h-4" />
                    {r.display_name}
                  </div>
                ))
              : query.length > 0 && (
                  <p className="text-sm text-gray-500 px-4 py-2">
                    Aucun résultat trouvé.
                  </p>
                )}
          </div>
          {/* Use typed address */}
          <button
            onClick={() => {
              onBack();
              onSelectAddress(query);
            }}
            className="text-sm text-center underline text-dvianeutralvariant-30 hover:text-dvianeutralvariant-40 cursor-pointer"
          >
            Utiliser l’adresse saisie
          </button>
        </>
      )}
    </div>
  );
}

export default AddressStep;
