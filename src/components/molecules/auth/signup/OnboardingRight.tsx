"use client";

import React from "react";

interface Step {
  number: number;
  title: string;
  description: string;
  illustration: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Créez votre compte",
    description:
      "Entrez vos informations de base : e-mail professionnel, mot de passe sécurisé, numéro de téléphone et votre nom/prénom. Démarrez votre inscription en toute sécurité.",
    illustration: "/illustrations/etape1.svg",
  },
  {
    number: 2,
    title: "Identifiez votre entreprise",
    description:
      "Renseignez les infos légales : nom de l’entreprise, raison sociale, numéro SIRET, statut juridique, spécialité du métier, adresse du siège. La vérification du SIRET est automatique.",
    illustration: "/illustrations/etape3.svg",
  },

  {
    number: 3,
    title: "Fournissez vos garanties professionnelles",
    description:
      "Ajoutez vos justificatifs : attestation d’assurance décennale, documents d’assurance mentionnant le SIRET, les coordonnées, la compagnie, période de validité, et attestation de qualification si nécessaire.",
    illustration: "/illustrations/etape3.svg",
  },
  {
    number: 4,
    title: "Présentez votre profil pro",
    description:
      "Décrivez vos services, zones d’intervention, années d’expérience, ajoutez des photos de réalisations, et valorisez vos spécialités pour attirer les clients !t",
    illustration: "/illustrations/etape4.svg",
  },
];

export default function OnboardingRight() {
  return (
    <div className="flex flex-col gap-0 w-full">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-row items-start gap-4 md:gap-6 py-3">
            <div className="flex flex-col gap-2 md:max-w-[547px]">
              <div className="flex flex-row items-center gap-1 md:gap-2 flex-shrink-0 ">
                <span className="text-[16px] md:text-[20px] font-bold text-dviaprimary-40 leading-tight">
                  {step.number}.
                </span>
                <h3 className="text-[16px] md:text-[20px] font-bold text-dvianeutral-10 leading-tight">
                  {step.title}
                </h3>
              </div>

              <div className="text-body-small md:text-[14px] text-dvianeutralvariant-90 leading-body-small md:leading-headline-small tracking-body-small md:tracking-headline-small font-normal">
                {step.description}
              </div>
            </div>

            <div className="flex flex-row items-start gap-4 md:gap-6 flex-1">
              <div className="flex-shrink-0">
                <img
                  src={step.illustration}
                  alt={`Illustration étape ${step.number}`}
                  className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-contain"
                />
              </div>
            </div>
          </div>

          {index < steps.length - 1 && (
            <div className="w-full h-[1px] bg-dvianeutral-50"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
