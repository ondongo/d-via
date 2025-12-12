"use client";

import { useState, useEffect } from "react";
import { useSignupStore } from "@/stores/signupStore";
import { useSignupForm } from "@/hooks/useSignupForm";
import ImageUploadMultiple from "../../ImageUploadMultiple";

export default function Step3() {
  const { loadFormData, saveFormData } = useSignupForm();
  const [professionalGuarantees, setProfessionalGuarantees] = useState<
    Array<{ base64: string; name: string; type: string }>
  >([]);

  // Charger les données au montage
  useEffect(() => {
    const data = loadFormData();
    if (data.professionalGuarantees && Array.isArray(data.professionalGuarantees)) {
      setProfessionalGuarantees(data.professionalGuarantees);
    }
  }, [loadFormData]);

  const handleImagesChange = (
    images: Array<{ base64: string; name: string; type: string }>
  ) => {
    setProfessionalGuarantees(images);
    // Sauvegarder dans localStorage via useSignupForm
    saveFormData({ professionalGuarantees: images }, true);
  };

  return (
    <div className="flex flex-col p-8 max-w-[600px] min-h-[272px] gap-4">
      <ImageUploadMultiple
        maxImages={3}
        onImagesChange={handleImagesChange}
        initialImages={professionalGuarantees}
        allowPdf={true}
      />
    </div>
  );
}
