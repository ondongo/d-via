"use client";

import { GlobalStateProvider } from "./globalState";
import { LocationProvider } from "./LocationProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocationProvider>
        <GlobalStateProvider defaultCity="Paris">{children}</GlobalStateProvider>
      </LocationProvider>
    </SessionProvider>
  );
}
