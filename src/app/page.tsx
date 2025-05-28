import FaqsSection from "@/components/molecules/FaqsSection";
import { LeftSection } from "@/components/molecules/landing-artisan/LeftSection";
import { StepsSection } from "@/components/molecules/landing-artisan/StepsSection";
import MapComponent from "@/components/molecules/Maps";


export default function Home() {
  return (
    <div className="flex flex-col h-auto gap-[100px] py-14 px-16 overflow-hidden">
      <div className="flex flex-row  gap-12">
        <div className="w-1/2">
          <LeftSection />
        </div>
        <div className="w-1/2">
          <MapComponent />
        </div>
      </div>
      <StepsSection />
      <FaqsSection />
    </div>
  );
}
