import HeaderDashboard from "@/components/organisms/HeaderDashboard";
import ArtisanNavigationRail from "@/components/molecules/dashboard/artisan/ArtisanNavigationRail";
import BottomHeaderArtisanDashboard from "@/components/organisms/BottonHeaderArtisanDashboard";

export default function DashboardArtisanLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh max-h-dvh flex-row overflow-hidden">
      <div className="hidden md:block">
        <ArtisanNavigationRail />
      </div>
      <div className="flex min-h-0 flex-1 flex-col md:ml-[90px]">
        <HeaderDashboard />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto transition-all duration-300">
          <div className="flex w-full flex-1 flex-col">{children}</div>
        </div>

        <div className="block md:hidden">
          <BottomHeaderArtisanDashboard />
        </div>
      </div>
    </div>
  );
}
