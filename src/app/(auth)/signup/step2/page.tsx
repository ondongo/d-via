"use client";

import StepContentWrapper from "@/components/organisms/StepContentWrapper";
import Step2 from "../../../../components/molecules/auth/signup/Step2";
import LeftSection from "@/components/molecules/auth/signup/LeftSection";
import { useSignupStore } from "@/stores/signupStore";

export default function Step2Page() {
  const { getStepPart } = useSignupStore();
  const step2Part = getStepPart(2);

  return (
    <StepContentWrapper
      centered={false}
      leftSection={
        step2Part === 1 ? (
          <LeftSection
            stepName="Étape 2"
            illustration="/illustrations/etape2.svg"
            title="Identifiez votre entreprise"
            description="Renseignez les infos légales : nom de l’entreprise, raison sociale, numéro SIRET, statut juridique, spécialité du métier, adresse du siège. La vérification du SIRET est automatique."
          />
        ) : (
          <LeftSection
            stepName="Étape 2"
            illustration="/illustrations/etape2.svg"
            title="Identifiez votre entreprise"
            description="Indiquez l'adresse de votre entreprise pour permettre aux clients de vous localiser facilement. Vous pouvez rechercher une adresse ou cliquer directement sur la carte."
          />
        )
      }
      rightSection={<Step2 />}
    />
  );
}
