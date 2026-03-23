import Link from "next/link";

export default function DashboardPaymentSuccessPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-dviaprimary-90 text-dviaprimary-40"
        aria-hidden
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h1 className="text-headline-small font-semibold leading-headline-small text-dvianeutral-10 mb-2">
        Paiement confirmé
      </h1>
      <p className="text-body-medium text-dvianeutralvariant-60 max-w-md mb-8">
        Merci pour votre achat. Vos crédits d&apos;analyse sont ajoutés à votre
        compte ; vous pouvez analyser de nouveaux devis tout de suite.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center justify-center bg-dviaprimary-40 text-white text-sm font-medium px-6 py-3 rounded-8px hover:shadow-md transition-shadow"
        >
          Analyser un devis
        </Link>
      </div>
    </div>
  );
}
