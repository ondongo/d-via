import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SIGNUP_COOKIES } from "@/utils/cookies";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lire les cookies pour vérifier si l'utilisateur a sauvegardé son formulaire
  const isSave = request.cookies.get(SIGNUP_COOKIES.IS_SAVE)?.value === "true";
  const savedStep = request.cookies.get(SIGNUP_COOKIES.SAVED_STEP)?.value;

  // Si isSave est true et qu'on a un step sauvegardé
  if (isSave && savedStep) {
    const step = parseInt(savedStep, 10);
    
    // Déterminer la page de destination selon le step
    let targetPath = "";
    if (step === 1) {
      targetPath = "/signup/step1";
    } else if (step === 2) {
      targetPath = "/signup/step2";
    } else if (step === 3) {
      targetPath = "/signup/step3";
    } else if (step === 4) {
      targetPath = "/signup/step4";
    }

    // Si on est déjà sur une page de signup, vérifier si on est sur la bonne page
    if (pathname.startsWith("/signup")) {
      // Si on est sur la page d'onboarding, rediriger vers le step sauvegardé
      if (pathname === "/signup" || pathname === "/signup/") {
        if (targetPath) {
          const url = request.nextUrl.clone();
          url.pathname = targetPath;
          return NextResponse.redirect(url);
        }
      }
      // Si on est déjà sur la bonne page, laisser passer
      // (les stepParts seront restaurés par FooterAuth depuis localStorage)
      return NextResponse.next();
    }

    // Si on n'est pas sur une page de signup, rediriger vers la bonne page
    if (targetPath) {
      const url = request.nextUrl.clone();
      url.pathname = targetPath;
      return NextResponse.redirect(url);
    }
  }

  // Si on est sur une page de signup mais sans cookie de sauvegarde, laisser passer
  if (pathname.startsWith("/signup")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware s'exécute
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
