"use client";

import { GlobalStateProvider } from "./globalState";
import { LocationProvider } from "./LocationProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      {" "}
      <GlobalStateProvider defaultCity="Paris">{children} </GlobalStateProvider>
    </LocationProvider>
  );
}
