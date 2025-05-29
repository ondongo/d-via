"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
type GlobalStateType = {
  selectedAddress: string;
  setSelectedAddress: (address: string) => void;
};

// Contexte
const GlobalStateContext = createContext<GlobalStateType | undefined>(undefined);

// Provider
export const GlobalStateProvider = ({
  children,
  defaultCity = "Paris",
}: {
  children: ReactNode;
  defaultCity?: string;
}) => {
  const [selectedAddress, setSelectedAddress] = useState<string>(defaultCity);

  return (
    <GlobalStateContext.Provider value={{ selectedAddress, setSelectedAddress }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Hook custom pour accéder au contexte
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
