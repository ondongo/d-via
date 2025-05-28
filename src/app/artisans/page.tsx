import ArtisanGrid from "@/components/molecules/landing-artisan/ArtisanGrid";
import { LeftSection } from "@/components/molecules/landing-artisan/LeftSection";
import { StepsSection } from "@/components/molecules/StepsSection";
import MapComponent from "@/components/molecules/landing-artisan/Maps";
import React from "react";
import { FaqsSection } from "@/components/molecules/FaqsSection";

function page() {
  return (
    <div className="flex flex-col h-auto gap-[90px] py-14 px-16 overflow-hidden">
      <div className="flex flex-row  gap-12">
        <div className="w-1/2">
          <LeftSection />
        </div>
        <div className="w-1/2">
          <MapComponent />
        </div>
      </div>
      <StepsSection
        title="Gagner du temps avec D-VIA,"
        highlight="c’est facile !"
        subtitle="Découvrez comment simplifier la gestion de vos demandes clients en trois étapes simples."
        steps={[
          {
            icon: "/icons/iconuser.svg",
            text: "Créez votre profil en quelques étapes",
          },
          {
            icon: "/icons/iconsuccess.svg",
            text: "Faites valider votre expertise",
          },
          {
            icon: "/icons/add_chart.svg",
            text: "Recevez des demandes de clients qualifiés",
          },
        ]}
      />
      <ArtisanGrid />
      <FaqsSection
        title="Questions fréquentes"
        subtitle="Voici les questions les plus fréquentes que se posent nos artisans."
        faqs={[
          {
            question: "Combien coûte l'inscription sur la plateforme ?",
            answer: "L'inscription est totalement gratuite pour les artisans.",
          },
          {
            question: "Comment sont vérifiés les profils des artisans ?",
            answer:
              "Chaque profil est vérifié manuellement par notre équipe pour garantir la qualité.",
          },
          {
            question: "Puis-je choisir ma zone d'intervention ?",
            answer:
              "Oui, vous pouvez configurer vos zones préférées dans votre profil.",
          },
        ]}
      />
    </div>
  );
}

export default page;
