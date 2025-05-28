import React from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqsSectionProps = {
  title: string;
  subtitle: string;
  faqs: FaqItem[];
  contactTitle?: string;
  contactSubtitle?: string;
};

export function FaqsSection({
  title,
  subtitle,
  faqs,
  contactTitle = "Vous avez encore des questions ?",
  contactSubtitle = "Trouvez des réponses à vos questions auprès de nous.",
}: FaqsSectionProps) {
  return (
    <section>
      <div className="text-center flex flex-col items-center justify-center gap-4">
        <h4 className="text-4xl md:text-[40px] leading-display-medium tracking-display-medium font-bold text-dvianeutral-10">
          {title}
        </h4>
        <p className="font-normal text-[20px] text-dvianeutral-10 leading-headline-small tracking-headline-small mb-5">
          {subtitle}
        </p>

        <div className="space-y-4 min-w-[722px] max-w-[722px]">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer flex items-center justify-between gap-1.5 rounded-md border border-dvianeutralvariant-50 bg-transparent p-4 text-dvianeutral-10">
                <h2 className="text-lg font-medium">{faq.question}</h2>
                <ToggleIcon />
              </summary>
              <p className="px-4 pt-4 text-dvianeutral-10">{faq.answer}</p>
            </details>
          ))}
        </div>

        <h4 className="text-headline-large leading-headline-large tracking-headline-large font-bold text-dvianeutral-10 mt-4">
          {contactTitle}
        </h4>
        <p className="font-normal text-[20px] text-dvianeutral-10 leading-headline-small tracking-headline-small mb-2">
          {contactSubtitle}
        </p>
        <button className="text-white text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px]">
          Nous contacter
        </button>
      </div>
    </section>
  );
}

function ToggleIcon() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="block size-5 shrink-0 group-open:hidden"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="hidden size-5 shrink-0 group-open:block"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </>
  );
}
