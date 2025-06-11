import Breadcumb from "@/components/molecules/dashboard/Breadcumb";
import NavigationRail from "@/components/molecules/dashboard/NavigationRail";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="overflow-hidden flex flex-row gap-[40px]">
          <NavigationRail />
          <div className="flex-1 mt-5">
            <Breadcumb />
            <div className="w-full flex justify-center items-center mt-4">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
