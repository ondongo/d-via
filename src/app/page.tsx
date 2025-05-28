import { LeftSection } from "@/components/molecules/landing-artisan/LeftSection";
import { StepsSection } from "@/components/molecules/StepsSection";
import ClientGrid from "@/components/molecules/landing-client/ClientGrid";
import MapComponent from "@/components/molecules/landing-artisan/Maps";
import { FaqsSection } from "@/components/molecules/FaqsSection";
import FileMarquee from "@/components/molecules/landing-client/FileMarquee";

export default function Home() {
  return (
    <div className="flex flex-col h-auto gap-[90px] py-14 px-16 overflow-hidden">
      <div className="flex flex-col  gap-4 items-center">
        <h1 className="text-4xl md:text-[44px] font-bold leading-display-large tracking-display-large  text-dvianeutral-10 text-center">
          Analysez vos devis. Trouver des artisans.
          <br /> Évitez{" "}
          <span className="text-dviaprimary-40">les arnaques.</span>
        </h1>

        <p className="font-normal text-[20px] text-dvianeutral-10 leading-headline-small  tracking-headline-small mb-10 text-center">
          Premier devis gratuit. Essai instantané. Il suffit d'uploader votre
          devis et D-VIA peut vous aider pour la vérification des prix, la
          validation des artisans, la détection d'arnaques et bien plus encore.
        </p>

        <button className="my-5 text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px] flex items-center gap-2">
          <img src="/icons/draft.svg" alt="Icône draft" className="w-4 h-4" />
          Analyser votre devis
        </button>

        <div className="relative overflow-hidden">
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
