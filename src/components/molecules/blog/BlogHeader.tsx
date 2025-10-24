import Link from "next/link";

export default function BlogHeader() {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <h1 className="hidden md:block text-[44px] font-bold leading-display-large tracking-display-large text-dvianeutral-10 text-center">
            Blog <span className="text-dviaprimary-40">D.VIA</span>
          </h1>
          <p className="text-xl text-dvianeutral-10  max-w-3xl mx-auto mb-8">
            Découvrez nos conseils d'experts, nos analyses de marché et nos
            innovations pour révolutionner l'analyse de devis dans le secteur
            artisanal.
          </p>
        </div>
      </div>
    </div>
  );
}
