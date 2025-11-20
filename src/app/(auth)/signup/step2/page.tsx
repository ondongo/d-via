"use client";

import StepContentWrapper from "@/components/organisms/StepContentWrapper";
import Step2 from "../../../../components/molecules/auth/signup/Step2";
import LeftSection from "@/components/molecules/auth/signup/LeftSection";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Import dynamique de la carte pour éviter les problèmes SSR
const MapComponent = dynamic(
  () => import("@/components/molecules/landing-artisan/Maps"),
  { ssr: false }
);

export default function Step2Page() {
  return (
    <StepContentWrapper
      centered={false}
      leftSection={
        <LeftSection
          stepName="Étape 2"
          illustration="/illustrations/etape2.svg"
          title="Situer le lieu de votre entreprise"
          description="Indiquez l'adresse de votre entreprise pour permettre aux clients de vous localiser facilement. Vous pouvez rechercher une adresse ou cliquer directement sur la carte."
        />
      }
      rightSection={
        <div className="w-full h-full flex flex-col gap-4">
          <Step2 />
          <div className="w-full h-[400px] rounded-md overflow-hidden border border-dvianeutral-50">
            <MapComponent />
          </div>
        </div>
      }
    />
  );
}
