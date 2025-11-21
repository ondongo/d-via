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
          illustration="/illustrations/etape3.svg"
          title="Fournissez vos garanties professionnelles"
          description="Ajoutez vos justificatifs : attestation d’assurance décennale, documents d’assurance mentionnant le SIRET, les coordonnées, la compagnie, période de validité, et attestation de qualification si nécessaire."
        />
      }
      rightSection={<Step3 />}
    />
  );
}
