"use client";

import { useInView } from "@/hooks/useInView";

const ClientGrid = () => {
  const cards = [...Array(8)];

  return (
    <section className="py-12">
      <div className="text-center flex flex-col items-center justify-center gap-4">
        <h4 className="text-[24px] md:text-[40px] leading-display-small tracking-display-small md:leading-display-medium md:tracking-display-medium font-bold text-dvianeutral-10">
          Rejoignez les milliers de clients qui évitent les arnaques
        </h4>

        <div className=" w-full mt-8 ">
          <UserMarqueeGrid />
        </div>
      </div>
    </section>
  );
};

const ClientCard = () => {
  const { ref, isVisible } = useInView(1);
  return (
    <div
      ref={ref}
      className={`rounded-12px shadow-md bg-white p-4 w-64 flex-shrink-0 ${
        isVisible ? "opacity-100" : "md:opacity-40"
      }`}
      style={{ transition: "opacity 0.3s ease-in-out" }}
    >
      <div className="flex flex-col items-center">
        <div className="bg-dvianeutral-96 w-40 h-40 flex items-center justify-center rounded-lg overflow-hidden mb-4">
          <img
            src="/artisans/plombier_salledebain_rennes 2.png"
            alt="Portrait Client"
            className="object-cover w-full h-full"
          />
        </div>
        <p className="text-lg font-semibold">Marvin</p>
        <p className="text-sm text-dvianeutralvariant-30">
          Paris · Rénovation cuisine
        </p>

        <div className="bg-dvianeutral-90 p-2 rounded-8px mt-4 w-full text-center">
          <div className="flex items-center justify-center space-x-1 text-dviaprimary-40 mb-1">
            {"★".repeat(4)}☆ <span className="text-black ml-1"> 4</span>
          </div>
          <p className="text-dviasecondary-40 font-bold text-sm">
            200€ d&apos;économies
          </p>
        </div>
      </div>
    </div>
  );
};

const MarqueeRow = ({ direction, className }: { direction: "left" | "right", className?: string }) => {
  const cards = Array.from({ length: 15 }).map((_, i) => (
    <ClientCard key={i} />
  ));

  return (
    <div className={`w-full relative ${className || ''}`}>
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

function UserMarqueeGrid() {
  return (
    <div className="space-y-6 py-10">
      <MarqueeRow direction="left" />
      <MarqueeRow direction="right" className="block md:hidden" />
    </div>
  );
}

export default ClientGrid;
