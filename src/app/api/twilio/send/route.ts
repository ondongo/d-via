import { NextRequest, NextResponse } from "next/server";
import { createVerification } from "@/services/twilio/2fa/createVerification";

/**
 * Traduit les messages d'erreur Twilio en français
 */
function translateTwilioError(error: any): string {
  const errorMessage = error.message || "";
  const errorCode = error.code;

  // Erreur de limite de tentatives d'envoi
  if (errorCode === 60203 || errorMessage.includes("Max send attempts reached")) {
    return "Nombre maximum de tentatives d'envoi atteint. Veuillez patienter avant de réessayer.";
  }

  // Erreur de limite de vérifications
  if (errorCode === 60202 || errorMessage.includes("Max check attempts reached")) {
    return "Nombre maximum de tentatives de vérification atteint. Veuillez demander un nouveau code.";
  }

  // Numéro invalide
  if (errorCode === 60200 || errorMessage.includes("Invalid parameter")) {
    return "Numéro de téléphone invalide. Veuillez vérifier le format.";
  }

  // Autres erreurs
  if (errorMessage.includes("Unable to create record")) {
    return "Impossible d'envoyer le code. Veuillez réessayer plus tard.";
  }

  return errorMessage || "Erreur lors de l'envoi du code. Veuillez réessayer.";
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Le numéro de téléphone est requis" },
        { status: 400 }
      );
    }

    await createVerification(phoneNumber);

    return NextResponse.json(
      { message: "Code de vérification envoyé avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur lors de l'envoi du code:", error);
    const translatedError = translateTwilioError(error);
    return NextResponse.json(
      { error: translatedError },
      { status: 500 }
    );
  }
}

