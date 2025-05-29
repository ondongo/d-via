import React from "react";

type Step = {
  icon: string;
  text: string;
};

type StepsSectionProps = {
  title: string;
  highlight: string;
  subtitle: string;
  imageSrc?: string;
  steps: Step[];
};

export function StepsSection({
  title,
  highlight,
  subtitle,
  imageSrc = "/illustrations/phone.png",
  steps,
}: StepsSectionProps) {
  return (
    <section>
      <div className="mx-auto text-center">
        <h1 className="text-[24px]  leading-display-small tracking-display-small  md:text-[40px] md:leading-display-medium md:tracking-display-medium font-bold  text-dvianeutral-10 mb-2">
          {title} <span className="text-dviaprimary-40">{highlight}</span>
        </h1>
        <p className="font-normal text-title-small leading-title-small tracking-title-small gap-5 mb-5 md:text-[20px] text-dvianeutral-10 md:leading-headline-small  md:tracking-headline-small md:mb-10 text-center">
          {subtitle}
        </p>

        <div className="flex justify-center mb-10">
          {/* Image pour desktop */}
          <img
            src={imageSrc}
            alt="Phone Desktop"
            className="hidden md:block w-[1296px] h-[543px] z-10 relative"
          />

          {/* Image pour mobile */}
          <img
            src="/illustrations/IllustrationMobile.png"
            alt="Phone Mobile"
            className="block md:hidden w-[634px] h-[270px] z-10 relative"
          />
        </div>

        {/* Étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <StepCard key={index} icon={step.icon} text={step.text} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="bg-dvianeutral-96 border border-dvianeutral-50 rounded-lg px-4 py-6 text-center inline-flex flex-col items-center max-h-[170px]">
      <img src={icon} alt="Step icon" className="w-[35px] h-[30px] md:w-[45px] md:h-[45px] mb-3" />
      <p className="text-dvianeutralvariant-30 text-[14px] md:text-[16px] leading-title-small tracking-title-small font-[400]">
        {text}
      </p>
    </div>
  );
}
