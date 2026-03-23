"use client";

import { useRouter } from "next/navigation";

export default function NonAuthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[65vh] w-full max-w-2xl flex-col items-center justify-center text-center px-4 pb-16">
      <h1 className="block md:hidden text-[28px] font-bold leading-display-small tracking-display-small text-dvianeutral-10 mb-4">
        Accès refusé
      </h1>
      <h1 className="hidden md:block text-[56px] font-bold leading-display-large tracking-display-large text-dvianeutral-10 mb-6">
        Accès refusé
      </h1>
      <p className="text-body-medium md:text-title-small text-dvianeutralvariant-60 max-w-lg mb-10">
        Vous n&apos;avez pas l&apos;autorisation d&apos;accéder à cette page. Si
        vous pensez qu&apos;il s&apos;agit d&apos;une erreur, connectez-vous avec
        un compte approprié ou revenez en arrière.
      </p>
      <button
        type="button"
        onClick={() => router.back()}
        className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-8 py-3 shadow-lg border rounded-8px border-transparent font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer"
      >
        Retour
      </button>
    </div>
  );
}
