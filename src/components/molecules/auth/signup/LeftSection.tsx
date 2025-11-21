"use client";

import React, { ReactNode } from "react";

type TitleWithHighlight = {
  text: string;
  highlight?: string;
};

interface LeftSectionProps {
  stepName?: string;
  illustration?: string | ReactNode;
  title: string | TitleWithHighlight | ReactNode;
  description?: string | ReactNode;
  className?: string;
}

export default function LeftSection({
  stepName,
  illustration,
  title,
  description,
  className = "",
}: LeftSectionProps) {
  const renderTitle = (): ReactNode => {
    if (typeof title === "string") {
      return (
        <h1 className="text-[24px] md:text-[44px] font-bold leading-display-small md:leading-display-large tracking-display-small md:tracking-display-large text-dvianeutral-10">
          {title}
        </h1>
      );
    }

    if (
      typeof title === "object" &&
      title !== null &&
      !React.isValidElement(title) &&
      "text" in title
    ) {
      const titleObj = title as TitleWithHighlight;
      return (
        <h1 className="text-[24px] md:text-[44px] font-bold leading-display-small md:leading-display-large tracking-display-small md:tracking-display-large text-dvianeutral-10">
          {titleObj.text}{" "}
          {titleObj.highlight && (
            <span className="text-dviaprimary-40">{titleObj.highlight}</span>
          )}
        </h1>
      );
    }

    return (
      <div className="text-[24px] md:text-[44px] font-bold leading-display-small md:leading-display-large tracking-display-small md:tracking-display-large text-dvianeutral-10">
        {title as ReactNode}
      </div>
    );
  };

  const renderIllustration = () => {
    if (!illustration) return null;

    if (typeof illustration === "string") {
      return (
        <img
          src={illustration}
          alt="Illustration de l'étape"
          className="w-full max-w-[200px] md:max-w-[300px] h-auto"
        />
      );
    }

    return illustration as ReactNode;
  };

  return (
    <div className={`flex flex-col gap-2 md:gap-4 w-full ${className} `}>
      {stepName && (
        <p className="text-headline-small md:text-headline-small text-dvianeutralvariant-50 font-normal tracking-wider">
          {stepName}
        </p>
      )}

      {/* Illustration (optionnel) */}
      {renderIllustration()}

      {/* Titre (obligatoire) */}
      {renderTitle()}

      {/* Description (optionnel) */}
      {description && (
        <div className="text-body-small md:text-[16px] text-dvianeutralvariant-90 leading-body-small md:leading-headline-small tracking-body-small md:tracking-headline-small font-normal">
          {typeof description === "string" ? <p>{description}</p> : description}
        </div>
      )}
    </div>
  );
}
