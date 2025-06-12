"use client";
import { usePathname } from "next/navigation";
import React from "react";

interface BreadcumbProps {
  title?: string;
}

function Breadcumb({ title }: BreadcumbProps) {
  const pathname = usePathname();

  const getBreadcrumbTitle = () => {
    switch (pathname) {
      case "/dashboard/clients":
        return "Analyse de devis";
      case "/dashboard/clients/search":
        return "Trouver des artisans";
      case "/dashboard/clients/blog":
        return "Articles et Blog";
      default:
        return "Analyse de devis";
    }
  };

  return (
    <h1 className="text-display-medium leading-display-medium tracking-display-medium text-dvianeutral-10 font-[600]  px-6">
      {title || getBreadcrumbTitle()}
    </h1>
  );
}

export default Breadcumb;
