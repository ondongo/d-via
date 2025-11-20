import Step3 from "@/components/molecules/auth/signup/Step3";
import LeftSection from "@/components/molecules/auth/signup/LeftSection";
import StepContentWrapper from "@/components/organisms/StepContentWrapper";
import React from "react";

export default function Step3Page() {
  return (
    <StepContentWrapper
      centered={false}
      leftSection={
        <LeftSection
          stepName="Étape 3"
          illustration="/illustrations/etape2.svg"
          title="Identifiez votre entreprise"
          description="Renseignez les infos légales : nom de l'entreprise, raison sociale, numéro SIRET, statut juridique, spécialité du métier, adresse du siège. La vérification du SIRET est automatique."
        />
      }
      rightSection={<Step3 />}
    />
  );
}

