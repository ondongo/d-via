"use client"
import { useLocationContext } from "@/providers/LocationProvider";

export const LeftSection = () => {
  const { currentLocation } = useLocationContext();

  const city = currentLocation?.city || "Paris";
  return (
    <div className="w-full h-full flex flex-col justify-center items-center space-y-6 px-4">
      <h1 className="text-4xl md:text-5xl font-roboto font-bold text-dvianeutral-10 leading-snug text-center">
        Votre inscription pourrait
        <br />
        vous rapporter <span className="text-dviaprimary-40">35 Clients</span>
        <br />
        avec <span className="text-dvianeutral-10">D-VIA</span>
      </h1>

      <p className="text-dvianeutral-10 text-base md:text-lg">
        <a href="#" className="underline font-bold">
          10 km
        </a>
        <span className="font-bold"> · </span> Autour de chez vous
      </p>

      <a
        href="#"
        className="text-dvianeutralvariant-30 underline text-sm font-bold"
      >
        Comprendre l'estimation clients
      </a>

      {/* Slider */}
      <div className="relative mt-10 max-w-[349px] w-full">
        <div className="absolute -top-10 left-[30%] transform -translate-x-1/2">
          <div className="bg-dviaprimary-40 text-white px-3 py-1.5 rounded-full text-sm">
            10 Km
          </div>
        </div>

        <div className="w-full h-4 bg-white rounded-full relative overflow-hidden">
          <div
            className="h-full bg-dviaprimary-40 absolute top-0 left-0"
            style={{ width: "30%" }}
          />
        </div>

        <div
          className="absolute top-[-6px] h-[28px] w-[2px] bg-dviaprimary-40 rounded-full"
          style={{ left: "30%" }}
        />
      </div>

      <div className="mt-6 bg-white border border-dvianeutral-10 rounded-full px-5 py-4 flex items-center space-x-2 text-dvianeutral-10 min-w-[360px]">
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

        <span className="text-sm font-bold text-dvianeutral-10">{city}</span>
        <input
          type="text"
          placeholder="· Carreleur · 3 ans d’expériences"
          className="font-normal outline-none border-none bg-transparent  placeholder-dvianeutralvariant-30 text-sm text-dvianeutral-10 w-full"
        />
      </div>
    </div>
  );
};
