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
          <br /> Évitez {" "}
          <span className="text-dviaprimary-40">les arnaques.</span>
        </h1>

        <p className="font-normal text-[20px] text-dvianeutral-10 leading-headline-small  tracking-headline-small mb-10 text-center">
          Premier devis gratuit. Essai instantané. Il suffit d'uploader votre
          devis et D-VIA peut vous aider pour la vérification des prix, la
          validation des artisans, la détection d'arnaques et bien plus encore.
        </p>

        <button
  className="my-5 text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px] flex items-center gap-2"
>
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
