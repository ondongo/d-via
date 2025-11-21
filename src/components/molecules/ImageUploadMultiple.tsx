"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

interface ImageUploadMultipleProps {
  maxImages?: number;
  onImagesChange?: (
    images: Array<{ base64: string; name: string; type: string }>
  ) => void;
  initialImages?: Array<{ base64: string; name: string; type: string }>;
}

export default function ImageUploadMultiple({
  maxImages = 3,
  onImagesChange,
  initialImages = [],
}: ImageUploadMultipleProps) {
  const [images, setImages] =
    useState<Array<{ base64: string; name: string; type: string }>>(
      initialImages
    );

  // Mettre à jour les images quand initialImages change
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleImagesUpdate = useCallback(
    (newImages: Array<{ base64: string; name: string; type: string }>) => {
      setImages(newImages);
      if (onImagesChange) {
        onImagesChange(newImages);
      }
    },
    [onImagesChange]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        toast.error(`Vous ne pouvez ajouter que ${maxImages} photos maximum.`);
        return;
      }

      const filesToProcess = acceptedFiles.slice(0, remainingSlots);
      const newImages: Array<{ base64: string; name: string; type: string }> =
        [];

      // Traiter tous les fichiers en parallèle
      const filePromises = filesToProcess.map((file) => {
        return new Promise<{
          base64: string;
          name: string;
          type: string;
        } | null>((resolve) => {
          if (!file.type.startsWith("image/")) {
            toast.error(`${file.name} n'est pas une image valide.`);
            resolve(null);
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result?.toString().split(",")[1] || null;
            if (base64) {
              resolve({
                base64,
                name: file.name,
                type: file.type,
              });
            } else {
              resolve(null);
            }
          };
          reader.onerror = () => {
            toast.error(`Erreur lors de la lecture de ${file.name}`);
            resolve(null);
          };
          reader.readAsDataURL(file);
        });
      });

      const results = await Promise.all(filePromises);
      const validImages = results.filter(
        (img): img is { base64: string; name: string; type: string } =>
          img !== null
      );

      if (validImages.length > 0) {
        const updatedImages = [...images, ...validImages];
        handleImagesUpdate(updatedImages);
      }
    },
    [images, maxImages, handleImagesUpdate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    disabled: images.length >= maxImages,
  });

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    handleImagesUpdate(updatedImages);
  };

  const remainingSlots = maxImages - images.length;
  const hasImages = images.length > 0;
  const canAddMore = images.length < maxImages;
  const firstImage = images[0];
  const remainingImages = images.slice(1);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Première image en pleine largeur */}
      {firstImage && (
        <div className="relative group w-full">
          <div className="h-[300px] md:h-[300px] overflow-hidden rounded-12px border border-dvianeutral-50">
            <img
              src={`data:${firstImage.type};base64,${firstImage.base64}`}
              alt="Photo 1"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => handleRemoveImage(0)}
            className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-12px shadow-md transition-all"
          >
            <img src="/icons/trash.svg" alt="delete_icon" />
          </button>
        </div>
      )}

      {/* Zone d'upload et images restantes en dessous */}
      <div className="flex flex-row gap-4">
        {/* Images restantes (2ème et 3ème) */}
        {remainingImages.map((image, index) => (
          <div key={index + 1} className="relative group">
            <div className="min-w-[260px] h-[180px] overflow-hidden rounded-12px border border-dvianeutral-50">
              <img
                src={`data:${image.type};base64,${image.base64}`}
                alt={`Photo ${index + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => handleRemoveImage(index + 1)}
              className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-12px shadow-md transition-all"
            >
              <img src="/icons/trash.svg" alt="delete_icon" />
            </button>
          </div>
        ))}

        {/* Zone d'upload */}
        {canAddMore && (
          <div
            {...getRootProps()}
            className={`flex flex-col ${
              remainingImages.length === 0
                ? "w-[600px] h-[300px]"
                : "min-w-[260px] "
            } h-[180px] items-center justify-center py-8 px-4 border border-dvianeutral-12 border-dashed rounded-2xl cursor-pointer transition-all ${
              isDragActive
                ? "border-dviaprimary-40 bg-dviaprimary-96"
                : "hover:border-dvianeutral-40"
            }`}
          >
            <div className="mb-2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
              >
                <g id="Upload 02">
                  <path
                    id="icon"
                    d="M16.296 25.3935L19.9997 21.6667L23.7034 25.3935M19.9997 35V21.759M10.7404 27.3611H9.855C6.253 27.3611 3.33301 24.4411 3.33301 20.8391C3.33301 17.2371 6.253 14.3171 9.855 14.3171V14.3171C10.344 14.3171 10.736 13.9195 10.7816 13.4326C11.2243 8.70174 15.1824 5 19.9997 5C25.1134 5 29.2589 9.1714 29.2589 14.3171H30.1444C33.7463 14.3171 36.6663 17.2371 36.6663 20.8391C36.6663 24.4411 33.7463 27.3611 30.1444 27.3611H29.2589"
                    stroke="#E16A26"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
            <h2 className="text-center text-gray-400 text-xs font-normal leading-4 mb-1">
              Format PNG ou JPG
            </h2>
            <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">
              Glissez-déposez votre fichier ici ou{" "}
              <span className="text-dviaprimary-40">
                Parcourir vos fichiers
              </span>
            </h4>
            {remainingSlots > 0 && (
              <p className="text-center text-dvianeutral-50 text-xs mt-2">
                {remainingSlots}{" "}
                {remainingSlots === 1 ? "photo restante" : "photos restantes"}
              </p>
            )}
            <input {...getInputProps()} className="hidden" />
          </div>
        )}
      </div>
    </div>
  );
}
