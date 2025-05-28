import { LeftSection } from "@/components/molecules/landing-artisan/LeftSection";
import { StepsSection } from "@/components/molecules/landing-artisan/StepsSection";
import MapComponent from "@/components/molecules/Maps";
import Image from "next/image";

export default function Clients() {
  return (
    <div className="flex flex-col h-screen gap-[200px] p-14 overflow-hidden">
      <div className="flex flex-row  gap-12">
        <div className="w-1/2">
          <LeftSection />
        </div>
        <div className="w-1/2">
          <MapComponent />
        </div>
      </div>
      <StepsSection />
    </div>
  );
}
