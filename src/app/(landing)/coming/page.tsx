export default function Coming() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-4">
      <h1 className="block md:hidden text-[24px] font-bold leading-display-small tracking-display-small text-dviaprimary-50 text-center mb-4">
        Bientôt disponible !
      </h1>

      <h1 className="hidden md:block text-[64px] font-bold leading-display-large tracking-display-large text-dviaprimary-50 text-center mb-4">
        Bientôt disponible !
      </h1>

      <p className="font-normal text-title-small leading-title-small tracking-title-small gap-5 md:text-[20px] text-dvianeutral-10 md:leading-headline-small md:tracking-headline-small md:mb-10 text-center max-w-xl">
        Cette fonctionnalité est en cours de développement.
        <br />
        Merci de patienter, elle arrive très bientôt.
      </p>
    </main>
  );
}
