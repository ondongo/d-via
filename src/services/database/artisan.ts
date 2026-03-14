"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/configs/prisma/prisma";
import { uploadBase64FilesToFirebase } from "@/utils/functions";
import bcrypt from "bcryptjs";
import { createStripeCustomer } from "./stripe-customer";

export interface CreateArtisanData {
  // User data
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  
  // Artisan data
  address: string;
  coordinates: [number, number] | null;
  siret?: string;
  companyName?: string;
  legalName?: string;
  legalStatus?: string;
  services?: string;
  experienceYears?: string;
  specialties?: string;
  description?: string;
  professionalGuarantees?: Array<{ base64: string; name: string; type: string }>; // Garanties professionnelles (Step3)
  workPhotos?: Array<{ base64: string; name: string; type: string }>; // Photos de travaux (Step4 partie 2)
  certificationNames?: string[]; // Noms des certifications (RGE, Qualibat, etc.)
  certificationFiles?: Array<{ base64: string; name: string; type: string }>; // Fichiers de certificats
}

export interface CreateArtisanResult {
  success: boolean;
  userId?: string;
  artisanId?: string;
  error?: string;
}

/**
 * Crée un utilisateur artisan dans la base de données
 * - Hash le mot de passe
 * - Crée le User
 * - Crée l'Artisan
 * - Upload les images dans Firebase Storage
 * - Crée un client Stripe
 */
export async function createArtisan(
  data: CreateArtisanData
): Promise<CreateArtisanResult> {
  try {
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Un utilisateur avec cet email existe déjà",
      };
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Créer le User d'abord pour obtenir son ID (nécessaire pour les uploads)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        // Le mot de passe sera stocké dans Account avec le provider "credentials"
      },
    });

    // Uploader les fichiers AVANT la transaction pour éviter les timeouts
    // Les URLs seront stockées en base de données après l'upload
    let professionalGuaranteesUrls: string[] = [];
    if (data.professionalGuarantees && data.professionalGuarantees.length > 0) {
      try {
        professionalGuaranteesUrls = await uploadBase64FilesToFirebase(
          data.professionalGuarantees,
          user.id,
          "artisans/professional-guarantees"
        );
        console.log(`${professionalGuaranteesUrls.length} garantie(s) professionnelle(s) uploadée(s) sur Firebase Storage`);
      } catch (error) {
        console.error("Erreur lors de l'upload des garanties professionnelles:", error);
        // Supprimer l'utilisateur créé si l'upload échoue
        await prisma.user.delete({ where: { id: user.id } });
        throw new Error("Échec de l'upload des garanties professionnelles sur Firebase Storage");
      }
    }

    // Uploader les photos de travaux (images) dans Firebase Storage si elles existent
    let workPhotosUrls: string[] = [];
    if (data.workPhotos && data.workPhotos.length > 0) {
      try {
        workPhotosUrls = await uploadBase64FilesToFirebase(
          data.workPhotos,
          user.id,
          "artisans/work-photos"
        );
        console.log(`${workPhotosUrls.length} photo(s) de travail(s) uploadée(s) sur Firebase Storage`);
      } catch (error) {
        console.error("Erreur lors de l'upload des photos de travaux:", error);
        // Supprimer l'utilisateur créé si l'upload échoue
        await prisma.user.delete({ where: { id: user.id } });
        throw new Error("Échec de l'upload des photos de travaux sur Firebase Storage");
      }
    }

    // Uploader les fichiers de certificats (images ou PDFs) dans Firebase Storage si elles existent
    let certificationUrls: string[] = [];
    if (data.certificationFiles && data.certificationFiles.length > 0) {
      try {
        certificationUrls = await uploadBase64FilesToFirebase(
          data.certificationFiles,
          user.id,
          "artisans/certifications"
        );
        console.log(`${certificationUrls.length} fichier(s) de certificat(s) uploadé(s) sur Firebase Storage`);
      } catch (error) {
        console.error("Erreur lors de l'upload des fichiers de certificats:", error);
        // Supprimer l'utilisateur créé si l'upload échoue
        await prisma.user.delete({ where: { id: user.id } });
        throw new Error("Échec de l'upload des fichiers de certificats sur Firebase Storage");
      }
    }

    // Créer l'Artisan et l'Account dans une transaction (maintenant que les uploads sont terminés)
    const result = await prisma.$transaction(async (tx) => {

      // Créer l'Artisan avec les URLs des fichiers uploadés sur Firebase Storage
      // Note: Seules les URLs sont stockées en base de données, pas les données base64
      const artisan = await tx.artisan.create({
        data: {
          userId: user.id,
          phoneNumber: data.phoneNumber,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          address: data.address,
          coordinates: data.coordinates
            ? JSON.stringify(data.coordinates)
            : null,
          siret: data.siret || null,
          companyName: data.companyName || null,
          legalName: data.legalName || null,
          legalStatus: data.legalStatus || null,
          services: data.services || null,
          experienceYears: data.experienceYears || null,
          specialties: data.specialties || null,
          description: data.description || null,
          workPhotos: workPhotosUrls, // URLs des photos de travaux uploadées sur Firebase Storage (Step4 partie 2)
          professionalGuarantees: professionalGuaranteesUrls, // URLs des garanties professionnelles uploadées sur Firebase Storage (Step3)
          certifications: data.certificationNames || [], // Noms des certifications (RGE, Qualibat, etc.)
          certificationUrls: certificationUrls, // URLs des fichiers de certificats uploadés sur Firebase Storage
        } as any, // Type assertion nécessaire car Prisma génère deux types différents
      });

      // Créer l'Account pour NextAuth (provider credentials)
      // On stocke le hash du mot de passe dans access_token pour la vérification
      await tx.account.create({
        data: {
          userId: user.id,
          type: "credentials",
          provider: "credentials",
          providerAccountId: user.id,
          access_token: hashedPassword, // Stocker le hash du mot de passe
        },
      });

      return { artisan };
    });

    // Créer un client Stripe pour l'utilisateur
    try {
      await createStripeCustomer({
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        userId: user.id,
      });
    } catch (error) {
      console.error("Erreur lors de la création du client Stripe:", error);
      // On continue même si Stripe échoue
    }

    return {
      success: true,
      userId: user.id,
      artisanId: result.artisan.id,
    };
  } catch (error: any) {
    console.error("Erreur lors de la création de l'artisan:", error);
    return {
      success: false,
      error: error.message || "Erreur lors de la création de l'artisan",
    };
  }
}


