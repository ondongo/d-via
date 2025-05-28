"use client";


const files = [
  "Devis plomberie salle bain 15k.pdf",
  "Renovation cuisine artisan .pdf",
  "toiture devis comparaison 3.pdf",
];

import { MdDriveFileMoveOutline } from "react-icons/md";
import { useInView } from "@/hooks/useInView";

const FileCard = ({ name }: { name: string }) => {
  const { ref, isVisible } = useInView(1); // 1 = entièrement visible

  return (
    <div
      ref={ref}
      className={`artisan-card flex items-center gap-2 px-4 py-3 bg-dvianeutral-96 border border-dvianeutral-50 text-dvianeutral-10 rounded-12px whitespace-nowrap shadow-md text-sm transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-40"
      }`}
    >
      <MdDriveFileMoveOutline className="w-4 h-4 text-dviaprimary-40" />
      <span>{name}</span>
    </div>
  );
};

const MarqueeRow = ({
  direction,
  fileName,
}: {
  direction: "left" | "right";
  fileName: string;
}) => {
  const cards = Array.from({ length: 15 }).map((_, i) => (
    <FileCard key={i} name={fileName} />
  ));

  return (
    <div
      className="overflow-hidden w-full relative"
    >
      <div
        className={`flex gap-4 w-fit animate-marquee ${
          direction === "right" ? "animate-reverse" : ""
        }`}
      >
        {cards}
        {cards}
      </div>
    </div>
  );
};

export default function FileMarquee() {
  return (
    <div className="space-y-6 py-10">
      <MarqueeRow direction="left" fileName={files[0]} />
      <MarqueeRow direction="right" fileName={files[1]} />
      <MarqueeRow direction="left" fileName={files[2]} />
    </div>
  );
}
