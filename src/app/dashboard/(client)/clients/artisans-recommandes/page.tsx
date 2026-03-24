import { Suspense } from "react";
import ArtisansRecommandesView from "./ArtisansRecommandesView";

export default function ArtisansRecommandesPage() {
  return (
    <Suspense>
      <ArtisansRecommandesView />
    </Suspense>
  );
}
