import NavigationRail from "@/components/molecules/dashboard/NavigationRail";
import BottomHeaderDashboard from "@/components/organisms/BottonHeaderDashboard";
import HeaderDashboard from "@/components/organisms/HeaderDashboard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh max-h-dvh flex-row overflow-hidden">
      <div className="hidden md:block">
        <NavigationRail />
      </div>
      <div className="flex min-h-0 flex-1 flex-col md:ml-[90px]">
        <HeaderDashboard />
        {/* Zone scrollable / pleine hauteur : min-h-0 indispensable pour que h-full / flex-1 des pages enfants fonctionne */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto transition-all duration-300">
          <div className="flex w-full flex-1 flex-col">{children}</div>
        </div>

        <div className="block md:hidden">
          <BottomHeaderDashboard />
        </div>
      </div>
    </div>
  );
}
