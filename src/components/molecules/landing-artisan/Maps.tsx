"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useLocationContext } from "@/providers/LocationProvider";
import { Map as LeafletMap } from "leaflet";
import { Modal } from "@/components/atoms/ui/modals/CustomModal";
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
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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
    <>
      <div className="relative h-[705px] max-w-[879px] shadow-lg   border-2 border-dvianeutral-50 rounded-12px overflow-hidden">
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
            /*  onClick={refreshLocation} */
            onClick={() => openModal()}
            className="bg-dvianeutral-92 text-dvianeutral-10 px-4 py-2 shadow-lg border rounded-12px border-transparent text-sm font-medium
               hover:shadow-sm transition-shadow duration-300 cursor-pointer tracking-label-large"
          >
            Découvrir zone autour de chez vous
          </button>
        </div>
      </div>
      <Modal
        onClose={closeModal}
        title="Parlez-nous de votre situation"
        isOpen={modalOpen}
      >
        <div className="flex flex-col gap-4 w-[450px] overflow-hidden items-center">
          <div className="flex flex-col gap-2 p-6 border-dvianeutral-50 border-b-1 w-full">
            <p className="text-dvianeutralvariant-30 text-[14px] leading-title-small tracking-title-small font-[400]">
              Adresse ou zone
            </p>
            <div className=" mx-4 bg-white border border-dvianeutral-10 rounded-full px-5 py-4 flex items-center space-x-2 text-dvianeutral-10 ">
              <svg
                className="w-4 h-4 text-dvianeutral-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>

              <span className="text-sm font-bold text-dvianeutral-10">
                Paris
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-6 border-dvianeutral-50 border-b-1 w-full">
            <p className="text-dvianeutralvariant-30 text-[14px] leading-title-small tracking-title-small font-[400]">
              Métier
            </p>
            <div className=" mx-4 bg-white border border-dvianeutral-10 rounded-full px-5 py-4 flex items-center space-x-2 text-dvianeutral-10 ">
              <svg
                className="w-4 h-4 text-dvianeutral-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>

              <span className="text-sm font-bold text-dvianeutral-10">
                Carreleur
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-6 border-dvianeutral-50 border-b-1 w-full">
            <p className="text-dvianeutralvariant-30 text-[14px] leading-title-small tracking-title-small font-[400]">
              Années d&apos;expériences
            </p>
            <div className=" mx-4 bg-white border border-dvianeutral-10 rounded-full px-5 py-4 flex items-center space-x-2 text-dvianeutral-10 ">
              <svg
                className="w-4 h-4 text-dvianeutral-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>

              <span className="text-sm font-bold text-dvianeutral-10">
                3 ans d’expériences
              </span>
            </div>
          </div>

          <button className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px] mb-4">
            Mettre à jour l’estimation
          </button>
        </div>
      </Modal>
    </>
  );
};

export default MapComponent;
