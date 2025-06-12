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
        <NavigationRail />
        <div className="ml-[100px] transition-all duration-300">
          <div className="mt-5">
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

