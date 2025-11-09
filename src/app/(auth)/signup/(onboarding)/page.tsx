import LeftSection from "@/components/molecules/auth/signup/LeftSection";
import StepContentWrapper from "@/components/organisms/StepContentWrapper";
import React from "react";

export default function page() {
  return (
    <StepContentWrapper
      centered={false}
      leftSection={
        <LeftSection
          title={{ text: "Commencer sur D·VIA,", highlight: "c'est facile !" }}
        />
      }
    />
  );
}
