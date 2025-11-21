"use client";

import { useState, useEffect } from "react";
import { useSignupStore } from "@/stores/signupStore";
import { useSignupForm } from "@/hooks/useSignupForm";
import ImageUploadMultiple from "../../ImageUploadMultiple";

export default function Step3() {
  const { loadFormData, saveFormData } = useSignupForm();
  const [workPhotos, setWorkPhotos] = useState<
    Array<{ base64: string; name: string; type: string }>
  >([]);

  // Charger les données au montage
  useEffect(() => {
    const data = loadFormData();
    if (data.workPhotos && Array.isArray(data.workPhotos)) {
      setWorkPhotos(data.workPhotos);
    }
  }, [loadFormData]);

  const handleImagesChange = (
    images: Array<{ base64: string; name: string; type: string }>
  ) => {
    setWorkPhotos(images);
    // Sauvegarder dans localStorage via useSignupForm
    saveFormData({ workPhotos: images }, true);
  };

  return (
    <div className="flex flex-col p-8 max-w-[600px] min-h-[272px] gap-4">
      <ImageUploadMultiple
        maxImages={3}
        onImagesChange={handleImagesChange}
        initialImages={workPhotos}
      />
    </div>
  );
}
