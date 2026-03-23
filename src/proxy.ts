/**
 * Couche « middleware » de l’app (Next.js 16+).
 * Ce fichier joue le rôle de `middleware.ts` : ne pas dupliquer avec un second middleware.
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { SIGNUP_COOKIES } from "@/utils/cookies";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // ============================================
  // PHASE DE TEST - Vérification en premier
  // ============================================
  const isTestPhaseAccepted = request.cookies.get("dvia_test_phase_accepted")?.value === "true";

  // Liste des chemins publics qui ne nécessitent pas d'acceptation de la phase de test
  const publicPaths = [
    "/_next",
    "/api",
    "/favicon.ico",
    "/icons",
    "/illustrations",
    "/logos",
    "/emojis",
    "/phasetest",
    "/non-authorized",
  ];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Si pas de phase de test acceptée et pas sur une page publique, rediriger vers /phasetest
  if (!isTestPhaseAccepted && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/phasetest";
    return NextResponse.redirect(url);
  }

  // ============================================
  // ESPACE CONNECTÉ — /dashboard (JWT session)
  // ============================================
  if (pathname.startsWith("/dashboard")) {
    const secret =
      process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "";
    if (!secret) {
      console.warn(
        "[proxy] NEXTAUTH_SECRET (ou AUTH_SECRET) manquant — accès /dashboard non protégé.",
      );
    } else {
      const token = await getToken({
        req: request,
        secret,
      });
      if (!token) {
        return NextResponse.redirect(
          new URL("/non-authorized", request.nextUrl.origin),
        );
      }
    }
  }

  // ============================================
  // LOGIQUE SIGNUP - Après vérification phase test
  // ============================================
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

    // Pages autorisées où l'utilisateur peut rester même avec un formulaire sauvegardé
    // Ces pages permettent à l'utilisateur de quitter le processus de signup
    const allowedPaths = [
      "/artisans",
      "/",
      "/blog",
      "/dashboard",
    ];
    
    // Vérifier si la page actuelle est une page autorisée
    const isAllowedPath = allowedPaths.some(path => 
      pathname === path || pathname.startsWith(path + "/")
    );

    // Si on est sur une page autorisée, laisser passer (l'utilisateur peut quitter)
    if (isAllowedPath) {
      return NextResponse.next();
    }

    // Si on n'est pas sur une page de signup ni sur une page autorisée, rediriger vers la bonne page
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

// Matcher des requêtes traitées par ce proxy (équivalent `middleware.config`)
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
