"use client";
import { usePathname } from "next/navigation";

interface BreadcumbProps {
  title?: string;
}

function Breadcumb({ title }: BreadcumbProps) {
  const pathname = usePathname();

  const getBreadcrumbTitle = () => {
    switch (true) {
      case pathname.startsWith("/dashboard/clients/blog"):
        return "Articles et Blog";
      case pathname.startsWith("/dashboard/clients/messages"):
        return "Messages";
      case pathname.startsWith("/dashboard/clients/artisans-recommandes"):
        return "Artisans recommandés";
      case pathname.startsWith("/dashboard/clients/analyse-comparative"):
        return "Analyse Comparative";
      case pathname.startsWith("/dashboard/clients/search/"):
        return "Profil artisan";
      default:
        switch (pathname) {
          case "/dashboard/clients":
            return "Analyse de devis";
          case "/dashboard/clients/search":
            return "Trouver des artisans";
          default:
            return "Analyse de devis";
        }
    }
  };


  return (
    <h1 className="text-headline-small leading-headline-small  tracking-headline-small  md:text-display-medium md:leading-display-medium md:tracking-display-medium text-dvianeutral-10 font-[600]  px-6">
      {title || getBreadcrumbTitle()}
    </h1>
  );
}

export default Breadcumb;
