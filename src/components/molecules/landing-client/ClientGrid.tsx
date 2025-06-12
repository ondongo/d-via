"use client";

import { clients } from "@/data";
import { useInView } from "@/hooks/useInView";
type ClientCardProps = {
  image: string;
  name: string;
  location: string;
  description: string;
  rating: number; 
  savings: string; 
};
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

 const ClientCard = ({
  image,
  name,
  location,
  description,
  rating,
  savings,
}: ClientCardProps) => {
  const { ref, isVisible } = useInView(1);

  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

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
            src={image}
            alt={`Portrait de ${name}`}
            className="object-cover w-full h-full"
          />
        </div>
        <p className="text-lg font-semibold">{name}</p>
        <p className="text-sm text-dvianeutralvariant-30">{location} · {description}</p>

        <div className="bg-dvianeutral-90 p-2 rounded-8px mt-4 w-full text-center">
          <div className="flex items-center justify-center space-x-1 text-dviaprimary-40 mb-1">
            {stars} <span className="text-black ml-1">{rating}</span>
          </div>
          <p className="text-dviasecondary-40 font-bold text-sm">{savings}</p>
        </div>
      </div>
    </div>
  );
};
const MarqueeRow = ({ direction, className }: { direction: "left" | "right", className?: string }) => {
  const cards = (
    <>
      {clients.map((client, index) => (
        <ClientCard
          key={index}
          image={client.image}
          name={client.name}
          location={client.location}
          description={client.description}
          rating={client.rating}
          savings={client.savings}
        />
      ))}
    </>
  );
  

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
