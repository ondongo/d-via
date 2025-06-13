import { BiCheck } from "react-icons/bi";

const tiers = [
  {
    name: "Pack décourverte",
    id: "pack-5",
    href: "/coming",
    price: "8.99€",
    description: "Créditez votre compte pour analyser 10 devis avec l’IA.",
    features: ["10 crédits d’analyse de devis", "Utilisable à tout moment"],
    featured: false,
  },
  {
    name: "Pack pro",
    id: "pack-20",
    href: "/coming",
    price: "29.99€",
    description: "Idéal pour un usage plus régulier ou professionnel.",
    features: [
      "30 crédits d’analyse de devis",
      "Utilisable à tout moment",
      "Sans expiration",
    ],
    featured: true,
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
          className="mx-auto aspect-1155/678 w-288.75 bg-linear-to-tr from-[#e5451d] to-[#f97c27] opacity-30"
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
      <div className="mx-auto mt-8 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured
                ? "relative bg-dvianeutral-10 shadow-2xl"
                : "bg-white/60 sm:mx-8 lg:mx-0",
              tier.featured
                ? ""
                : tierIdx === 0
                ? "rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl"
                : "sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none",
              "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10"
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? "text-dviaprimary-30" : "text-dviaprimary-40",
                "text-base/7 font-semibold"
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? "text-white" : "text-dvianeutralvariant-30",
                  "text-5xl font-semibold tracking-tight"
                )}
              >
                {tier.price}
              </span>
            </p>
            <p
              className={classNames(
                tier.featured ? "text-gray-300" : "text-gray-600",
                "mt-6 text-base/7"
              )}
            >
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? "text-gray-300" : "text-gray-600",
                "mt-8 space-y-3 text-sm/6 sm:mt-10"
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <BiCheck
                    aria-hidden="true"
                    className={classNames(
                      tier.featured ? "text-white" : "text-dviaprimary-40",
                      "h-6 w-5 flex-none"
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? "bg-dviaprimary-40 text-white shadow-xs hover:bg-dviaprimary-30 focus-visible:outline-dviaprimary-50"
                  : "text-dviaprimary-40 ring-1 ring-dvianeutral-50  ring-inset hover:ring-dvianeutral-60  focus-visible:outline-dviaprimary-60",
                "mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10"
              )}
            >
              Acheter maintenant
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
