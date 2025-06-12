"use client";
import { LeftSection } from "@/components/molecules/landing-artisan/LeftSection";
import { StepsSection } from "@/components/molecules/StepsSection";
import ClientGrid from "@/components/molecules/landing-client/ClientGrid";
import MapComponent from "@/components/molecules/landing-artisan/Maps";
import { FaqsSection } from "@/components/molecules/FaqsSection";
import FileMarquee from "@/components/molecules/landing-client/FileMarquee";
import { useState } from "react";
import DevisAnalyse from "@/components/molecules/landing-client/DevisAnalyse";

export default function Home() {
  return (
    <div className="flex flex-col h-auto gap-12 lg:gap-[90px] py-10 sm:py-12 lg:py-14 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="flex flex-col  gap-4 items-center">
        {/* Pour les grands écrans (md et +) */}
        <h1 className="hidden md:block text-[44px] font-bold leading-display-large tracking-display-large text-dvianeutral-10 text-center">
          Analysez vos devis. Trouver des artisans.
          <br /> Évitez{" "}
          <span className="text-dviaprimary-40">les arnaques.</span>
        </h1>

        {/* Pour les petits écrans (en dessous de md) */}
        <h1 className="block md:hidden text-[24px] font-bold leading-display-small tracking-display-small text-dvianeutral-10 text-center">
          Analysez vos devis. <br /> Trouver des artisans.
          <br /> Évitez{" "}
          <span className="text-dviaprimary-40">les arnaques.</span>
        </h1>

        <p className="font-normal text-title-small leading-title-small tracking-title-small gap-5 md:text-[20px] text-dvianeutral-10 md:leading-headline-small  md:tracking-headline-small md:mb-10 text-center">
          Premier devis gratuit. Essai instantané. Il suffit d'uploader votre
          devis et D-VIA peut vous aider pour la vérification des prix, la
          validation des artisans, la détection d'arnaques et bien plus encore.
        </p>
        <DevisAnalyse />

        <div className=" overflow-hidden">
          <FileMarquee />
        </div>
      </div>
      <StepsSection
        title="Analyser vos devis avec D-VIA, "
        highlight="c’est facile !"
        subtitle="Découvrez comment vérifier la fiabilité de vos devis d'artisans en trois étapes simples."
        steps={[
          {
            icon: "/icons/iconDownload.svg",
            text: "Uploadez votre devis en quelques clics",
          },
          {
            icon: "/icons/iconSearch.svg",
            text: "Notre IA analyse les prix et vérifie l'artisan",
          },
          {
            icon: "/icons/iconsuccess.svg",
            text: "Recevez votre rapport détaillé instantanément",
          },
        ]}
      />
      <ClientGrid />
      <FaqsSection
        title="Questions fréquentes"
        subtitle="Voici les questions les plus fréquentes que se posent nos clients."
        faqs={[
          {
            question: "Combien coûte l'analyse de devis sur la plateforme ?",
            answer: `La première analyse est entièrement gratuite. 
      Ensuite, pour accéder aux analyses suivantes, vous devrez utiliser des crédits que vous pouvez acheter depuis votre espace personnel.`,
          },
          {
            question: "Comment fonctionne l'analyse de devis ?",
            answer: `Nos experts analysent chaque devis en s’appuyant sur une base de données actualisée de prix du marché et sur les retours clients. 
      Cela permet d’identifier les incohérences, les éventuelles surévaluations ou les frais cachés.`,
          },
          {
            question: "Mes données personnelles sont-elles sécurisées ?",
            answer: `Oui, la sécurité de vos données est notre priorité. 
      Elles sont chiffrées et stockées selon les normes en vigueur. 
      Vous pouvez également configurer vos préférences de confidentialité depuis votre profil.`,
          },
        ]}
        isArtisan={false}
      />
    </div>
  );
}
