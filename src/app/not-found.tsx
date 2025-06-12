"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-4">
      <h1 className="block md:hidden text-[24px] font-bold leading-display-small tracking-display-small text-dviaprimary-50 text-center mb-4">
        404 Page non trouvée
      </h1>

      <h1 className="hidden md:block text-[64px] font-bold leading-display-large tracking-display-large text-dviaprimary-50 text-center mb-4">
        404 Page non trouvée
      </h1>

      <p className="font-normal text-title-small leading-title-small tracking-title-small gap-5 md:text-[20px] text-dvianeutral-10 md:leading-headline-small md:tracking-headline-small md:mb-10 text-center max-w-xl">
        Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
      </p>

      <button
        onClick={() => router.back()}
        className="my-5 text-white text-[12px] md:text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-8 py-3 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px] flex items-center gap-2"
      >
        Retourner 
      </button>
    </main>
  );
}
