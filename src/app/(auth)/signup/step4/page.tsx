"use client";

import StepContentWrapper from "@/components/organisms/StepContentWrapper";
import Step4 from "../../../../components/molecules/auth/signup/Step4";
import LeftSection from "@/components/molecules/auth/signup/LeftSection";
import { useSignupStore } from "@/stores/signupStore";

export default function Step4Page() {
  const { getStepPart } = useSignupStore();
  const step4Part = getStepPart(4);

  const leftProps = {
    stepName: "Étape 4",
    illustration: "/illustrations/etape4.svg",
    title: "Présentez votre profil pro",
    description:
      "Décrivez vos services, années d'expérience, ajoutez des photos de réalisations, et valorisez vos spécialités pour attirer les clients !",
  };

  return (
    <StepContentWrapper
      centered={false}
      leftSection={<LeftSection {...leftProps} />}
      rightSection={<Step4 />}
    />
  );
}
