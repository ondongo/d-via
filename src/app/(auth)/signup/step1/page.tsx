"use client";

import Step1 from "@/components/molecules/auth/signup/Step1";
import LeftSection from "@/components/molecules/auth/signup/LeftSection";
import StepContentWrapper from "@/components/organisms/StepContentWrapper";
import { useSignupStore } from "@/stores/signupStore";
import React from "react";

export default function page() {
  const { getStepPart } = useSignupStore();
  const step1Part = getStepPart(1);

  return (
    <StepContentWrapper
      centered={step1Part === 2}
      leftSection={
        step1Part === 1 ? (
          <LeftSection
            stepName="Étape 1"
            illustration="/illustrations/etape1.svg"
            title="Créez votre compte"
            description="Entrez vos informations de base : e-mail professionnel, mot de passe sécurisé, numéro de téléphone et votre nom/prénom. Démarrez votre inscription en toute sécurité."
          />
        ) : (
          <LeftSection
            stepName="Étape 1"
            illustration="/illustrations/etape2.svg"
            title="Vérifiez votre numéro"
            description="Nous avons envoyé un code de vérification à 6 chiffres sur votre numéro de téléphone. Entrez-le ci-dessous pour confirmer votre identité."
          />
        )
      }
      rightSection={<Step1 />}
    />
  );
}
