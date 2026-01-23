"use client";
import { StepsSection } from "@/components/molecules/StepsSection";
import ClientGrid from "@/components/molecules/landing-client/ClientGrid";
import { FaqsSection } from "@/components/molecules/FaqsSection";
import FileMarquee from "@/components/molecules/landing-client/FileMarquee";
import DevisAnalyse from "@/components/molecules/landing-client/DevisAnalyse";

export default function Page() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero upload card */}
      <section className="w-full max-w-5xl px-4 md:px-6 lg:px-0 mt-6 mb-10">
        <div className="rounded-16px border border-dvianeutral-50 bg-dvianeutral-96 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <h2 className="text-headline-small md:text-display-small font-bold text-dviaprimary-50 mb-2">
              Analyse votre devis en quelque seconde
            </h2>
            <p className="text-dvianeutral-20 text-body-medium mb-6">
              Importez votre document. Notre IA vérifie les prix, les assurances et détecte les anomalies.
            </p>
            {/* Composant d'upload et d'analyse du devis */}
            <DevisAnalyse />
            <p className="text-dvianeutral-20 text-sm mt-3">Formats acceptés: PDF, JPG, PNG.</p>
          </div>
          {/* Illustration à droite si disponible */}
          <div className="hidden md:block w-[220px] flex-shrink-0">
            <img
              src="/illustrations/DevisUpload.svg"
              alt="Illustration d'analyse de devis"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>



    </div>
  );
}