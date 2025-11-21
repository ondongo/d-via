import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SIGNUP_COOKIES } from "@/utils/cookies";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SIGNUP_COOKIES.SAVED_STEP);
    cookieStore.delete(SIGNUP_COOKIES.IS_SAVE);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors du nettoyage des cookies:", error);
    return NextResponse.json(
      { error: "Erreur lors du nettoyage des cookies" },
      { status: 500 }
    );
  }
}
