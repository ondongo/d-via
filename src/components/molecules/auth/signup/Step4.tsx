"use client";

import { useState, useEffect } from "react";
import { useSignupStore } from "@/stores/signupStore";
import { useSignupForm } from "@/hooks/useSignupForm";
import ImageUploadMultiple from "../../ImageUploadMultiple";

export default function Step4() {
  const { getStepPart } = useSignupStore();
  const { loadFormData, saveFormData } = useSignupForm();
  const step4Part = getStepPart(4);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // États pour partie 1
  const [description, setDescription] = useState("");

  // États pour partie 2
  const [workPhotos, setWorkPhotos] = useState<
    Array<{ base64: string; name: string; type: string }>
  >([]);

  // Charger les données au montage
  useEffect(() => {
    const data = loadFormData();
    if (data.description) setDescription(data.description);
    if (data.workPhotos && Array.isArray(data.workPhotos)) {
      const workPhotosArray = data.workPhotos as Array<{
        base64: string;
        name: string;
        type: string;
      }>;
      if (workPhotosArray.length > 0 && workPhotosArray[0]?.base64) {
        setWorkPhotos(workPhotosArray);
      }
    }
  }, [loadFormData]);

  const handleImagesChange = (
    images: Array<{ base64: string; name: string; type: string }>
  ) => {
    setWorkPhotos(images);
    // Sauvegarder dans localStorage via useSignupForm
    saveFormData({ workPhotos: images }, true);
  };

  // Partie 2 : Photos de travaux
  if (step4Part === 2) {
    return (
      <div className="flex flex-col p-8 max-w-[600px] min-h-[272px] gap-4">
        <h2 className="text-xl font-bold text-dvianeutral-10">
          Ajoutez quelques photos de vos travaux
        </h2>
        <p className="text-dvianeutral-10 mb-4">
          Pour commencer, vous aurez besoin de 3 photos. Vous pourrez en ajouter
          d'autres ou faire des modifications plus tard.
        </p>
        <ImageUploadMultiple
          maxImages={3}
          onImagesChange={handleImagesChange}
          initialImages={workPhotos}
          allowPdf={false}
        />
      </div>
    );
  }

  // Partie 1 : Services, expérience, spécialités
  return (
    <div className="flex flex-col gap-4 w-full max-w-[600px]">
      <h2 className="text-xl font-bold text-dvianeutral-10">
        Créez votre description
      </h2>
      <p className="text-dvianeutral-10 mb-4"> Partagez ce qui rend unique.</p>

      <textarea
        id="description-input"
        placeholder="Décrivez votre entreprise, vos services, votre expérience..."
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          // Sauvegarder dans le store
          useSignupStore.getState().setDescription(e.target.value);
          // Sauvegarder dans localStorage
          saveFormData({ description: e.target.value }, true);
        }}
        onFocus={() => setFocusedField("description")}
        onBlur={() => setFocusedField(null)}
        rows={8}
        className="w-full px-4 py-3 border-1 border-dvianeutral-50 rounded-md focus:border-dvianeutral-60 focus:outline-none resize-none"
      />
    </div>
  );
}
