"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Modal } from "@/components/atoms/ui/modals/CustomModal";
import OverviewStep from "./OverviewStep";
import AddressStep from "./AddressStep";
import { useGlobalState } from "@/providers/globalState";
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
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  const [modalStep, setModalStep] = useState<"overview" | "address">(
    "overview"
  );

  const closeModal = () => {
    if (modalStep === "overview") {
      setModalOpen(false);
    } else {
      setModalStep("overview");
    }
  };

  const {
    selectedAddress,
    setSelectedAddress,
    coordinates,
    setCoordinates,
    map,
    setMap,
  } = useGlobalState();

  const handleSelectAddress = (
    address: string,
    lat?: number,
    long?: number
  ) => {
    setSelectedAddress(address);

    if (typeof lat === "number" && typeof long === "number") {
      setCoordinates([lat, long]);
    }
  };

  const handleBack = () => setModalStep("overview");

  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => setL(leaflet));
  }, []);



  // Quand coordinates changent, on recentre la carte
  useEffect(() => {
    if (map && coordinates) {
      map.setView(coordinates, map.getZoom());
    }
  }, [coordinates, map]);

  if (!L) return null;

  const locationIcon = L.divIcon({
    html: `<img src="/icons/icon-localisation.svg" alt="Location" style="width:45px;height:41px;" />`,
    className: "",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const defaultCenter: [number, number] = [48.856614, 2.3522219];
  const latitude = coordinates?.[0] || defaultCenter[0];
  const longitude = coordinates?.[1] || defaultCenter[1];

  const handleUpdateEstimation = () => {
    if (map && coordinates) {
      map.setView(coordinates, 13);
    }

    setModalOpen(false);
  };

  const zoomIn = () => {
    if (map) map.setZoom(map.getZoom() + 1);
  };

  const zoomOut = () => {
    if (map) map.setZoom(map.getZoom() - 1);
  };

  return (
    <>
      <div className="relative h-[350px] w-full md:h-[650px] md:max-w-[879px] shadow-lg   border-2 border-dvianeutral-50 rounded-12px overflow-hidden">
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
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-[2000] flex justify-center w-full px-4">
          <button
            onClick={() => openModal()}
            className="w-full max-w-[280px] md:max-w-[306px] bg-dvianeutral-92 text-dvianeutral-10 px-4 py-2 shadow-lg border border-transparent rounded-[12px] text-xs md:text-sm font-medium tracking-label-large hover:shadow-sm transition-shadow duration-300 cursor-pointer whitespace-nowrap"
          >
            Découvrir zone autour de chez vous
          </button>
        </div>
      </div>
      <Modal
        onClose={closeModal}
        title={
          modalStep === "overview"
            ? "Parlez-nous de votre situation"
            : "Votre adresse ou votre zone"
        }
        isOpen={modalOpen}
      >
        <div className="flex flex-col gap-4 w-[450px] overflow-hidden items-center">
          {modalStep === "overview" ? (
            <OverviewStep
              onAddressClick={() => setModalStep("address")}
              city={selectedAddress}
              handleUpdateEstimation={handleUpdateEstimation}
            />
          ) : (
            <AddressStep
              onSelectAddress={handleSelectAddress}
              onBack={handleBack}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default MapComponent;
