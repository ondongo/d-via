"use client";
import React, { useState, useEffect } from "react";

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
};

function AddressInputWithSeparator({ onBack, onSelectAddress, selectedAddress }: any) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  
  // Mettre à jour le champ avec l'adresse sélectionnée depuis le parent
  useEffect(() => {
    if (selectedAddress && selectedAddress !== query) {
      setQuery(selectedAddress);
      setResults([]); // Fermer la liste des résultats
    }
  }, [selectedAddress]);

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
    <div className="lg:min-w-[429px] max-w-[429px] lg:min-h-[56px] p-4 flex flex-col px-16 md:px-4 justify-center items-center">
      <div
        className={`border flex items-center gap-2 w-full ${
          query && (results.length > 0 || query !== selectedAddress)
            ? "rounded-t-28px border-dvianeutral-50 bg-dviaprimary-99"
            : "rounded-full border-dvianeutralvariant-12 bg-white"
        }`}
      >
        <div className={`flex items-center  px-4 py-3  gap-2`}>
          <img src="/icons/LocationBrown.svg" alt="loc" className="w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => searchAddress(e.target.value)}
            placeholder="Où êtes-vous situé ?"
            className="flex-1 text-sm font-bold text-dvianeutralvariant-30 outline-none placeholder:text-dvianeutralvariant-90 placeholder:text-sm placeholder:font-normal"
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
        <div className="h-full w-[1px] bg-dvianeutralvariant-12" />

        <div className={`flex items-center gap-2 px-4 py-3 `}>
          <img
            src="/icons/circleBrown.svg"
            alt="state-layer"
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-dvianeutralvariant-30">
            15 Km
          </span>
        </div>
      </div>

      {/* Address Results */}
      {query != "" && results.length > 0 && (
        <>
          {" "}
          <div
            className={`bg-white border border-dvianeutral-50  overflow-hidden rounded-b-28px
            mb-4 w-full max-w-full`}
          >
            {results.slice(0, 3).map((r: NominatimResult, i: number) => (
              <div
                key={i}
                onClick={() => {
                  // Mettre à jour le champ avec l'adresse sélectionnée
                  setQuery(r.display_name);
                  // Fermer la liste des résultats
                  setResults([]);
                  // Appeler les callbacks
                  if (onBack) onBack();
                  onSelectAddress(
                    r.display_name,
                    parseFloat(r.lat),
                    parseFloat(r.lon)
                  );
                }}
                className={`flex items-center gap-2 px-4 py-3 text-sm hover:bg-dvianeutral-90 cursor-pointer ${
                  i !== results.length - 1
                    ? "border-b border-dvianeutral-50"
                    : ""
                }`}
              >
                <img src="/icons/OutlineLocation.svg" className="w-4 h-4" />
                {r.display_name}
              </div>
            ))}
          </div>
        </>
      )}
      {/* Message "Aucun résultat trouvé" seulement si on cherche mais qu'il n'y a pas de résultats */}
      {query != "" && results.length === 0 && query !== selectedAddress && (
        <div
          className={`bg-white border border-dvianeutral-50  overflow-hidden rounded-b-28px
          mb-4 w-full max-w-full`}
        >
          <p className="text-sm text-gray-500 px-4 py-2">
            Aucun résultat trouvé.
          </p>
        </div>
      )}
    </div>
  );
}

export default AddressInputWithSeparator;
