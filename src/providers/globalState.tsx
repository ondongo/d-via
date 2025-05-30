"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Map as LeafletMap } from "leaflet";

// Types
type GlobalStateType = {
  selectedAddress: string;
  setSelectedAddress: (address: string) => void;
  coordinates: [number, number];
  setCoordinates: (coords: [number, number]) => void;
  job: string;
  setJob: (job: string) => void;
  experienceYears: number;
  setExperienceYears: (years: number) => void;
  map: LeafletMap | null;
  setMap: (map: LeafletMap | null) => void;
};

const GlobalStateContext = createContext<GlobalStateType | undefined>(
  undefined
);

export const GlobalStateProvider = ({
  children,
  defaultCity = "Paris",
  defaultCenter = [48.856614, 2.3522219],
}: {
  children: ReactNode;
  defaultCity?: string;
  defaultCenter?: [number, number];
}) => {
  const [selectedAddress, setSelectedAddress] = useState<string>(defaultCity);
  const [coordinates, setCoordinates] =
    useState<[number, number]>(defaultCenter);
  const [job, setJob] = useState<string>("Carreleur");
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [map, setMap] = useState<LeafletMap | null>(null);

  return (
    <GlobalStateContext.Provider
      value={{
        selectedAddress,
        setSelectedAddress,
        coordinates,
        setCoordinates,
        job,
        setJob,
        experienceYears,
        setExperienceYears,
        map,
        setMap,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Hook custom
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
