import ArtisansRecommandesView from "./ArtisansRecommandesView";
import { getTopRecommendedArtisans } from "@/services/database/recommended-artisans";

export const dynamic = "force-dynamic";

export default async function ArtisansRecommandesPage() {
  const initialArtisans = await getTopRecommendedArtisans(5);
  return <ArtisansRecommandesView initialArtisans={initialArtisans} />;
}
