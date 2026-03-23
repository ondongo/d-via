import { BiCheck } from "react-icons/bi";
import StripeCheckoutButton from "@/components/atoms/StripeCheckoutButton";

const tiers = [
  {
    name: "Unitaire",
    id: "pack-unitaire",
    priceId: "price_1TE7hRD2zF3CMgdYXgYVPf1U",
    price: "4.90€",
    description: "Besoin ponctuel urgent.",
    features: [
      "1 analyse incluse",
      "Prix/unité : 4.90€",
      "Réduction : —",
      "Usage : besoin ponctuel urgent",
    ],
    featured: false,
  },
  {
    name: "Pack Duo",
    id: "pack-duo",
    priceId: "price_1TE7i5D2zF3CMgdYlGxZw2ZH",
    price: "11.90€",
    description: "Comparaison de 2 à 3 devis sur un projet.",
    features: [
      "3 analyses incluses",
      "Prix/unité : 3.97€",
      "Réduction : -19%",
      "Usage : comparaison 2-3 devis sur 1 projet",
    ],
    featured: false,
  },
  {
    name: "Pack Réno",
    id: "pack-reno",
    priceId: "price_1TE7ifD2zF3CMgdY7LRTW02J",
    price: "18.90€",
    description: "Rénovation multi-corps de métier.",
    features: [
      "5 analyses incluses",
      "Prix/unité : 3.78€",
      "Réduction : -23%",
      "Usage : rénovation multi-corps de métier",
    ],
    featured: false,
    popular: true,
  },
  {
    name: "Pack Complet",
    id: "pack-complet",
    priceId: "price_1TE7j0D2zF3CMgdY6MwtcDJX",
    price: "34.90€",
    description: "Gros chantier ou partage entourage.",
    features: [
      "10 analyses incluses",
      "Prix/unité : 3.49€",
      "Réduction : -29%",
      "Usage : gros chantier ou partage entourage",
    ],
    featured: true,
  },
];

const comparisonRows = [
  {
    offer: "Unitaire",
    analyses: "1",
    price: "4.90€",
    pricePerUnit: "4.90€",
    reduction: "—",
    targetUse: "Besoin ponctuel urgent",
  },
  {
    offer: "Pack Duo",
    analyses: "3",
    price: "11.90€",
    pricePerUnit: "3.97€",
    reduction: "-19%",
    targetUse: "Comparaison 2-3 devis sur 1 projet",
  },
  {
    offer: "Pack Réno",
    analyses: "5",
    price: "18.90€",
    pricePerUnit: "3.78€",
    reduction: "-23%",
    targetUse: "Rénovation multi-corps de métier",
  },
  {
    offer: "Pack Complet",
    analyses: "10",
    price: "34.90€",
    pricePerUnit: "3.49€",
    reduction: "-29%",
    targetUse: "Gros chantier ou partage entourage",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Pricing() {
  return (
    <div className="relative isolate px-6 py-12 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="mx-auto aspect-1155/678 w-288.75 bg-linear-to-tr from-[#E16A26] to-[#f97c27] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base/7 font-semibold text-dviaprimary-40">
          Tarifs
        </h2>
        <p className="mt-2 hidden md:block text-[54px] font-bold leading-display-large tracking-display-large text-dvianeutral-10 text-center">
          Achetez des crédits pour <br />
          <span className="text-dviaprimary-40">analyser vos devis</span>
        </p>
      </div>

      <p className="mt-4 font-normal text-title-small leading-title-small tracking-title-small gap-5 md:text-[20px] text-dvianeutral-10 md:leading-headline-small  md:tracking-headline-small md:mb-10 text-center">
        Des packs de crédits à utiliser à votre rythme. <br /> Chaque crédit
        correspond à une analyse complète de devis par notre IA
      </p>
      <div className="mx-auto mt-8 grid max-w-lg grid-cols-1 items-stretch gap-y-6 sm:mt-20 sm:gap-y-6 md:max-w-3xl md:grid-cols-2 md:gap-6 xl:max-w-7xl xl:grid-cols-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={classNames(
              tier.popular
                ? "relative bg-dviaprimary-40 shadow-2xl ring-2 ring-dviaprimary-30"
                : tier.featured
                ? "relative bg-dvianeutral-10 shadow-2xl"
                : "bg-white/60",
              "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-8 h-full flex flex-col"
            )}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white text-dviaprimary-40 text-xs font-semibold px-3 py-1 shadow-sm">
                Plus populaire
              </span>
            )}
            <h3
              id={tier.id}
              className={classNames(
                tier.popular
                  ? "text-white"
                  : tier.featured
                  ? "text-dviaprimary-30"
                  : "text-dviaprimary-40",
                "text-base/7 font-semibold"
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.popular
                    ? "text-white"
                    : tier.featured
                    ? "text-white"
                    : "text-dvianeutralvariant-30",
                  "text-5xl font-semibold tracking-tight"
                )}
              >
                {tier.price}
              </span>
            </p>
            <p
              className={classNames(
                tier.popular
                  ? "text-white/90"
                  : tier.featured
                  ? "text-gray-300"
                  : "text-gray-600",
                "mt-6 text-base/7"
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.popular
                  ? "text-white/90"
                  : tier.featured
                  ? "text-gray-300"
                  : "text-gray-600",
                "mt-8 space-y-3 text-sm/6 sm:mt-10"
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <BiCheck
                    aria-hidden="true"
                    className={classNames(
                      tier.popular
                        ? "text-white"
                        : tier.featured
                        ? "text-white"
                        : "text-dviaprimary-40",
                      "h-6 w-5 flex-none"
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <StripeCheckoutButton
              priceId={tier.priceId}
              className={classNames(
                tier.popular
                  ? "bg-white text-dviaprimary-40 shadow-xs hover:bg-dvianeutral-96 focus-visible:outline-white"
                  : tier.featured
                  ? "bg-dviaprimary-40 text-white shadow-xs hover:bg-dviaprimary-30 focus-visible:outline-dviaprimary-50"
                  : "text-dviaprimary-40 ring-1 ring-dvianeutral-50  ring-inset hover:ring-dvianeutral-60  focus-visible:outline-dviaprimary-60",
                "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 cursor-pointer"
              )}
            >
              Acheter maintenant
            </StripeCheckoutButton>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-6xl">
        <h3 className="text-dvianeutral-10 text-2xl md:text-3xl font-semibold text-center mb-6">
          Tableau comparatif des offres
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-dvianeutral-50 bg-white">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="bg-[#E16A26] text-white">
                <th className="px-4 py-4 text-left font-medium border-r border-white/30">
                  Offre
                </th>
                <th className="px-4 py-4 text-left font-medium border-r border-white/30">
                  Analyses
                </th>
                <th className="px-4 py-4 text-left font-medium border-r border-white/30">
                  Prix
                </th>
                <th className="px-4 py-4 text-left font-medium border-r border-white/30">
                  Prix/unité
                </th>
                <th className="px-4 py-4 text-left font-medium border-r border-white/30">
                  Réduction
                </th>
                <th className="px-4 py-4 text-left font-medium">Usage cible</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr
                  key={row.offer}
                  className={idx % 2 === 0 ? "bg-white" : "bg-dvianeutral-98"}
                >
                  <td className="px-4 py-4 border-t border-dvianeutral-50">{row.offer}</td>
                  <td className="px-4 py-4 border-t border-dvianeutral-50">{row.analyses}</td>
                  <td className="px-4 py-4 border-t border-dvianeutral-50">{row.price}</td>
                  <td className="px-4 py-4 border-t border-dvianeutral-50">{row.pricePerUnit}</td>
                  <td className="px-4 py-4 border-t border-dvianeutral-50">{row.reduction}</td>
                  <td className="px-4 py-4 border-t border-dvianeutral-50">{row.targetUse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
