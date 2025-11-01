import { NextRequest, NextResponse } from "next/server";
import { createVerificationCheck } from "@/services/twilio/2fa/checkVerification";

/**
 * Traduit les messages d'erreur Twilio en français
 */
function translateTwilioError(error: any): string {
  const errorMessage = error.message || "";
  const errorCode = error.code;

  // Erreur de limite de vérifications
  if (errorCode === 60202 || errorMessage.includes("Max check attempts reached")) {
    return "Nombre maximum de tentatives de vérification atteint. Veuillez demander un nouveau code.";
  }

  // Code invalide
  if (errorCode === 20404 || errorMessage.includes("not found")) {
    return "Code de vérification invalide ou expiré. Veuillez demander un nouveau code.";
  }

  return errorMessage || "Code invalide ou expiré. Veuillez réessayer.";
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json();

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: "Le numéro de téléphone et le code sont requis" },
        { status: 400 }
      );
    }

    const verificationCheck = await createVerificationCheck(phoneNumber, code);

    const isVerified = verificationCheck.status === "approved";

    if (isVerified) {
      return NextResponse.json(
        { message: "Code vérifié avec succès", verified: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          error: "Code invalide ou expiré", 
          verified: false 
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Erreur lors de la vérification du code:", error);
    const translatedError = translateTwilioError(error);
    return NextResponse.json(
      { 
        error: translatedError, 
        verified: false 
      },
      { status: 400 }
    );
  }
}

