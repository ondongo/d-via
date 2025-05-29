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
  isArtisan?: boolean;
};

export function FaqsSection({
  title,
  subtitle,
  faqs,
  contactTitle = "Vous avez encore des questions ?",
  contactSubtitle = "Trouvez des réponses à vos questions auprès de nous.",
  isArtisan ,
}: FaqsSectionProps) {
  return (
    <section>
      <div className="text-center flex flex-col items-center justify-center gap-4">
        <h4 className="text-[24px] md:text-[40px] leading-display-small tracking-display-small md:leading-display-medium md:tracking-display-medium  font-bold text-dvianeutral-10">
          {title}
        </h4>
        <p className="font-normal text-title-small  md:text-[20px] text-dvianeutral-10 md:leading-headline-small tracking-headline-small mb-5">
          {subtitle}
        </p>

        <div className="space-y-4 max-w-[300px] md:min-w-[722px] md:max-w-[722px]">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group [&_summary::-webkit-details-marker]:hidden rounded-md border border-dvianeutralvariant-50 bg-transparent open:bg-dvianeutral-94 open:border-dvianeutralvariant-50"
            >
              <summary className="cursor-pointer flex items-center justify-between gap-1.5 p-2 md:p-4 text-dvianeutral-10 mx-2">
                <h2 className="text-sm md:text-lg font-medium text-start md:text-center">{faq.question}</h2>
                <ToggleIcon />
              </summary>

              <div className="flex flex-col gap-4 items-start mb-6 mx-2">
                <p className="px-4 pt-4 text-dvianeutral-10 text-start text-sm md:text-title-medium-size">{faq.answer}</p>

                {index == 0 && (
                  <button className="flex items-center gap-2 text-dviaprimary-40 hover:bg-dviaprimary-87 py-1 text-label-large leading-label-large tracking-label-large bg-transparent px-4  hover:rounded-full text-sm font-medium cursor-pointer">
                    <img
                      src="/icons/error.svg"
                      alt="Icône draft"
                      className="w-4 h-4"
                    />{" "}
                    {isArtisan
                      ? "Voir les conditions d’inscription"
                      : "Voir les tarifs"}
                  </button>
                )}
              </div>
            </details>
          ))}
        </div>

        <h4 className=" text-[16px] md:text-headline-large leading-headline-large tracking-headline-large font-bold text-dvianeutral-10 mt-4">
          {contactTitle}
        </h4>
        <p className="font-normal text-title-small  md:text-[20px] text-dvianeutral-10 md:leading-headline-small tracking-headline-small mb-2">
          {contactSubtitle}
        </p>
        <button className="text-white text-[12px] md:text-label-large leading-label-large tracking-label-large bg-dviaprimary-40 px-4 py-2 shadow-lg border rounded-8px border-transparent text-sm font-medium hover:shadow-sm transition-shadow duration-300 cursor-pointer max-w-[220px]">
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
