import React from "react";

export function StepsSection() {
  return (
    <section>
      <div className="mx-auto text-center">
        <h1 className="text-4xl md:text-[40px] leading-display-medium tracking-display-medium font-bold  text-dvianeutral-10 mb-2">
          Gagner du temps avec D-VIA,{" "}
          <span className="text-dviaprimary-40">c’est facile !</span>
        </h1>
        <p className="font-normal text-[20px] text-dvianeutral-10 leading-headline-small  tracking-headline-small mb-10">
          Découvrez comment simplifier la gestion de vos demandes clients en
          trois étapes simples.
        </p>

        <div className="flex justify-center mb-10">
          <img
            src="/illustrations/phone.png"
            alt="Phone 1"
            className="w-[1296px] h-[543px] z-10 relative"
          />
        </div>

        {/* Étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StepCard
            icon="/icons/iconuser.svg"
            text="Créez votre profile en quelques étapes"
          />
          <StepCard
            icon="/icons/iconsuccess.svg"
            text="Faites valider votre expertise"
          />
          <StepCard
            icon="/icons/add_chart.svg"
            text="Recevez des demandes de clients qualifiés"
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="bg-dvianeutral-96 border border-dvianeutral-50 rounded-lg px-4 py-6 text-center inline-flex flex-col items-center max-h-[170px]">
      <img src={icon} alt="Step icon" className="w-[45px] h-[45px] mb-3" />
      <p className="text-dvianeutralvariant-30 text-[16px] leading-title-small tracking-title-small font-[400]">
        {text}
      </p>
    </div>
  );
}
