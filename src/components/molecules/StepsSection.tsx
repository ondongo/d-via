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
        <h1 className="text-4xl md:text-[40px] leading-display-medium tracking-display-medium font-bold  text-dvianeutral-10 mb-2">
        {title}{" "}
          <span className="text-dviaprimary-40">{highlight}</span>
        </h1>
        <p className="font-normal text-[20px] text-dvianeutral-10 leading-headline-small  tracking-headline-small mb-10">
        {subtitle}
        </p>

        <div className="flex justify-center mb-10">
          <img
           src={imageSrc}
            alt="Phone 1"
            className="w-[1296px] h-[543px] z-10 relative"
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
      <img src={icon} alt="Step icon" className="w-[45px] h-[45px] mb-3" />
      <p className="text-dvianeutralvariant-30 text-[16px] leading-title-small tracking-title-small font-[400]">
        {text}
      </p>
    </div>
  );
}
