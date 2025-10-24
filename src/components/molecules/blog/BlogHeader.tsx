import Link from "next/link";

export default function BlogHeader() {
  return (
    <div className="bg-gradient-to-r from-dviaprimary-40 to-dviaprimary-30 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Blog D-Via
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Découvrez nos conseils d'experts, nos analyses de marché et nos 
            innovations pour révolutionner l'analyse de devis dans le secteur artisanal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/"
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Retour à l'accueil
            </Link>
            <Link 
              href="/dashboard"
              className="bg-white text-dviaprimary-40 hover:bg-dvianeutral-96 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Accéder au dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
