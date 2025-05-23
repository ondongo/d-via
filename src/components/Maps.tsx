"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useLocationContext } from "@/providers/LocationProvider";
import { Map as LeafletMap } from "leaflet";
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

const MapComponent: React.FC = () => {
  const { coords, currentLocation, refreshLocation } = useLocationContext();

  const [L, setL] = useState<any>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => setL(leaflet));
  }, []);

  useEffect(() => {
    if (map && coords) {
      map.setView([coords.latitude, coords.longitude], 13);
    }
  }, [map, coords]);

  if (!L) return null;

  const locationIcon = L.divIcon({
    html: `<img src="/icons/icon-localisation.svg" alt="Location" style="width:45px;height:41px;" />`,
    className: "",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const defaultCenter: [number, number] = [48.856614, 2.3522219];
  const latitude = currentLocation?.latitude || defaultCenter[0];
  const longitude = currentLocation?.longitude || defaultCenter[1];
  const zoomIn = () => {
    if (map) map.setZoom(map.getZoom() + 1);
  };
  const zoomOut = () => {
    if (map) map.setZoom(map.getZoom() - 1);
  };

  return (
    <div className="relative h-[705px] max-w-[879px]">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        className="h-full w-full rounded-lg"
        ref={setMap}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Circle
          center={[latitude, longitude]}
          radius={1000}
          pathOptions={{
            color: "#ef4444",
            fillColor: "transparent",
            fillOpacity: 0.3,
          }}
        />

        {/* Entourer Marker dans un svg Circle  */}
        <Marker position={[latitude, longitude]} icon={locationIcon}>
          <Popup>
            <span className="font-medium">
              35 clients trouvés dans cette zone
            </span>
          </Popup>
        </Marker>
      </MapContainer>

      <div className="absolute bottom-7 right-4 flex flex-col rounded-12px overflow-hidden z-[2000]">
        <button
          onClick={zoomIn}
          className="border-b-2 border-b-dvianeutral-50 bg-dvianeutral-92 text-dvianeutral-10 px-3 py-2 shadow-lg hover:shadow-sm transition-shadow duration-300 font-bold text-lg rounded-t-12px cursor-pointer"
          aria-label="Zoom in"
        >
          +
        </button>

        <button
          onClick={zoomOut}
          className="bg-dvianeutral-92 text-dvianeutral-10 px-3 py-2 shadow-lg hover:shadow-sm transition-shadow duration-300 font-bold text-lg rounded-b-12px cursor-pointer"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>

      {/* Bouton (en haut à droite) */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-[2000]">
        <button
          onClick={refreshLocation}
          className="bg-dvianeutral-92 text-dvianeutral-10 px-4 py-2 shadow-lg border rounded-12px border-transparent text-sm font-medium
               hover:shadow-sm transition-shadow duration-300 cursor-pointer"
        >
          Découvrir zone autour de chez vous
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
