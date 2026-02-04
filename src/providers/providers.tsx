"use client";

import { GlobalStateProvider } from "./globalState";
import { LocationProvider } from "./LocationProvider";
import { TestPhaseProvider } from "./TestPhaseProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TestPhaseProvider>
        <LocationProvider>
          <GlobalStateProvider defaultCity="Paris">{children}</GlobalStateProvider>
        </LocationProvider>
      </TestPhaseProvider>
    </SessionProvider>
  );
}
