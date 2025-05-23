
"use client";

import { LocationProvider } from "./LocationProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LocationProvider>{children}</LocationProvider>;
}
