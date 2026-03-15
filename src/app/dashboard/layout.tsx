import Breadcumb from "@/components/molecules/dashboard/Breadcumb";
import DashboardClientCreditsHeader from "@/components/molecules/dashboard/DashboardClientCreditsHeader";
import NavigationRail from "@/components/molecules/dashboard/NavigationRail";
import BottomHeaderDashboard from "@/components/organisms/BottonHeaderDashboard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="hidden md:block">
          <NavigationRail />
        </div>

        <div className="mb-[100px] md:mb-[0px] md:ml-[100px] transition-all duration-300">
          <div className="mt-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
              <Breadcumb />
              <div className="px-6 md:px-0">
                <DashboardClientCreditsHeader />
              </div>
            </div>
            <div className="w-full flex justify-center items-center mt-4">
              {children}
            </div>
          </div>
        </div>

        <div className="block md:hidden">
          <BottomHeaderDashboard />
        </div>
      </body>
    </html>
  );
}
