import Step1 from "@/components/molecules/auth/signup/Step1";
import LeftSection from "@/components/molecules/auth/signup/LeftSection";
import StepContentWrapper from "@/components/organisms/StepContentWrapper";
import React from "react";

export default function page() {
  return (
    <StepContentWrapper
      centered={false}
      leftSection={
        <LeftSection
          stepName="Étape 1"
          illustration="/illustrations/etape1.svg"
          title="Créez votre compte"
          description="Entrez vos informations de base : e-mail professionnel, mot de passe sécurisé, numéro de téléphone et votre nom/prénom. Démarrez votre inscription en toute sécurité."
        />
      }
      rightSection={<Step1 />}
    />
  );
}
