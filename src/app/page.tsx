import { LeftSection } from "@/components/home/LeftSection";
import MapComponent from "@/components/Maps";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-row h-screen p-14 gap-12">
      <div className="w-1/2">
        <LeftSection />
      </div>
      <div className="w-1/2">
        <MapComponent />
      </div>
    </div>
  );
}
