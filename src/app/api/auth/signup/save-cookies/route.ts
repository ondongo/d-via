import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SIGNUP_COOKIES } from "@/utils/cookies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { step, isSave } = body;

    if (step === undefined || isSave === undefined) {
      return NextResponse.json(
        { error: "step et isSave sont requis" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const maxAge = 7 * 24 * 60 * 60; // 7 jours en secondes
    const isProduction = process.env.NODE_ENV === "production";

    // Créer la réponse
    const response = NextResponse.json({ success: true });

    // Définir le cookie de l'étape sauvegardée
    cookieStore.set(SIGNUP_COOKIES.SAVED_STEP, step.toString(), {
      path: "/",
      maxAge: maxAge,
      sameSite: "lax",
      secure: isProduction,
      httpOnly: false,
    });

    // Définir le cookie isSave
    cookieStore.set(SIGNUP_COOKIES.IS_SAVE, isSave.toString(), {
      path: "/",
      maxAge: maxAge,
      sameSite: "lax",
      secure: isProduction,
      httpOnly: false,
    });

    // S'assurer que les cookies sont dans la réponse
    // Les cookies définis via cookieStore.set() sont automatiquement ajoutés à la réponse
    return response;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des cookies:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde des cookies" },
      { status: 500 }
    );
  }
}

