"use client";

type Artisan = {
  image: string;
  name: string;
  location: string;
  job: string;
  rating: number;
  completed: number;
};

type ArtisanCardProps = Artisan & {
  opacity?: number;
};

import { artisans } from "@/data";
import { useEffect, useRef, useState } from "react";

const ArtisanGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [opacities, setOpacities] = useState<number[]>(Array(16).fill(1)); // 16 cartes

  useEffect(() => {
    const fadeDistance = 100; // pixels sur lesquels l'opacité diminue

    const updateOpacities = () => {
      if (!containerRef.current) return;

      const cards = containerRef.current.querySelectorAll(".artisan-card");
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const newOpacities = Array(cards.length).fill(1);

      cards.forEach((card, idx) => {
        const cardLeft = card.getBoundingClientRect().left;

        const distanceFromLeftEdge = cardLeft - containerLeft;

        if (distanceFromLeftEdge < fadeDistance) {
          // Plus on est proche de la sortie gauche, plus l'opacité diminue
          const opacity = Math.max(0.4, distanceFromLeftEdge / fadeDistance);
          newOpacities[idx] = opacity;
        } else {
          newOpacities[idx] = 1;
        }
      });

      setOpacities(newOpacities);
      requestAnimationFrame(updateOpacities);
    };

    updateOpacities();
  }, []);

  const cards = [...Array(8)];

  return (
    <section className="relative py-12">
      <div className="text-center flex flex-col items-center justify-center gap-4">
        <h4 className="text-[24px] md:text-[40px] leading-display-small tracking-display-small md:leading-display-medium md:tracking-display-medium font-bold text-dvianeutral-10">
          Rejoignez notre communauté d&apos;artisans d&apos;excellence
        </h4>

        <div className="relative w-full mt-8 " ref={containerRef}>
          <div className="animate-marqueeGrid flex w-max space-x-4">
            {[...artisans].map((artisan, idx) => (
              <div
                key={idx}
                className="mx-2 transition-opacity duration-300 ease-in-out artisan-card"
                style={{
                  opacity: opacities[idx],
                  transition: "opacity 0.3s ease-in-out",
                }}
              >
                <ArtisanCard {...artisan} opacity={opacities[idx] ?? 1} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ArtisanCard = ({
  image,
  name,
  location,
  job,
  rating,
  completed,
  opacity = 1,
}: ArtisanCardProps) => {
  return (
    <div
      className="rounded-12px shadow-md bg-white p-4 w-64 flex-shrink-0"
      style={{ opacity, transition: "opacity 0.3s ease-in-out" }}
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
        <p className="text-sm text-dvianeutralvariant-30">
          {location} · {job}
        </p>

        <div className="bg-dvianeutral-90 p-2 rounded-8px mt-4 w-full text-center">
          <div className="flex items-center justify-center space-x-1 text-dviaprimary-40 mb-1">
            {"★".repeat(rating)}
            {"☆".repeat(5 - rating)}{" "}
            <span className="text-black ml-1">{rating}</span>
          </div>
          <p className="text-dviasecondary-40 font-bold text-sm">
            {completed} chantiers réalisés
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtisanGrid;
