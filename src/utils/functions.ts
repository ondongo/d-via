
import { storage } from "@/configs/firebase/storage";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const uploadImagesToFirebase = async (
  files: File[],
  id: string,
  category: string
) => {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const storageRef = ref(storage, `${category}/${id}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    uploadedUrls.push(downloadURL);
  }

  return uploadedUrls;
};

/**
 * Upload base64 files (images or PDFs) to Firebase Storage using client SDK
 * Convertit base64 en Blob puis utilise uploadBytes comme uploadImagesToFirebase
 */
export const uploadBase64FilesToFirebase = async (
  files: Array<{ base64: string; name: string; type: string }>,
  userId: string,
  category: string = "artisans"
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    try {
      // Convert base64 to Uint8Array (compatible client et serveur)
      const buffer = Buffer.from(file.base64, "base64");
      const uint8Array = new Uint8Array(buffer);

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop() || "";
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `${category}/${userId}/${fileName}`;

      // Determine content type based on file type or extension
      let contentType = file.type;
      if (!contentType) {
        const ext = fileExtension.toLowerCase();
        if (ext === "pdf") {
          contentType = "application/pdf";
        } else if (["jpg", "jpeg"].includes(ext)) {
          contentType = "image/jpeg";
        } else if (ext === "png") {
          contentType = "image/png";
        } else {
          contentType = "application/octet-stream";
        }
      }

      // Upload to Firebase Storage using client SDK (comme uploadImagesToFirebase)
      // uploadBytes accepte Uint8Array, Blob ou File
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, uint8Array, {
        contentType: contentType,
      });
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      uploadedUrls.push(downloadURL);
    } catch (error) {
      console.error(`Erreur lors de l'upload du fichier ${file.name}:`, error);
      throw new Error(`Erreur lors de l'upload du fichier ${file.name}`);
    }
  }

  return uploadedUrls;
};

/**
 * @deprecated Use uploadBase64FilesToFirebase instead
 * Upload base64 images to Firebase Storage using Admin SDK (server-side)
 */
export const uploadBase64ImagesToFirebase = uploadBase64FilesToFirebase;

export const deleteImageFromFirebase = async (imageUrl: string) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log(`Image supprimée : ${imageUrl}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'image :`, error);
  }
};

export const imageLoader = ({ src, width, quality }: any) => {
  return `/loader.webp?w=${width}&q=${quality || 75}`;
};
