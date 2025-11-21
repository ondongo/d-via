import Cookies from "js-cookie";

export const SIGNUP_COOKIES = {
  SAVED_STEP: "signup-saved-step",
  IS_SAVE: "signup-is-save",
} as const;

/**
 * Convertit maxAge (en secondes) en nombre de jours pour expires
 */
const getExpiresDays = (maxAge: number): number => {
  return maxAge / (24 * 60 * 60); // Convertir secondes en jours
};

/**
 * Gestion des cookies pour le processus de signup
 */
export const signupCookies = {
  /**
   * Sauvegarder l'étape actuelle dans un cookie
   */
  setSavedStep: (step: number, maxAge: number = 7 * 24 * 60 * 60) => {
    try {
      Cookies.set(SIGNUP_COOKIES.SAVED_STEP, step.toString(), {
        path: "/",
        sameSite: "lax" as const,
        expires: getExpiresDays(maxAge),
        secure: process.env.NODE_ENV === "production",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du cookie:", error);
    }
  },

  /**
   * Récupérer l'étape sauvegardée depuis le cookie
   */
  getSavedStep: (): number | null => {
    const step = Cookies.get(SIGNUP_COOKIES.SAVED_STEP);
    return step ? parseInt(step, 10) : null;
  },

  /**
   * Marquer que le formulaire est sauvegardé
   */
  setIsSave: (isSave: boolean, maxAge: number = 7 * 24 * 60 * 60) => {
    try {
      Cookies.set(SIGNUP_COOKIES.IS_SAVE, isSave.toString(), {
        path: "/",
        sameSite: "lax" as const,
        expires: getExpiresDays(maxAge),
        secure: process.env.NODE_ENV === "production",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du cookie:", error);
    }
  },

  /**
   * Vérifier si le formulaire est sauvegardé
   */
  getIsSave: (): boolean => {
    return Cookies.get(SIGNUP_COOKIES.IS_SAVE) === "true";
  },

  /**
   * Nettoyer tous les cookies de signup
   */
  clear: () => {
    try {
      Cookies.remove(SIGNUP_COOKIES.SAVED_STEP, { path: "/" });
      Cookies.remove(SIGNUP_COOKIES.IS_SAVE, { path: "/" });
    } catch (error) {
      console.error("Erreur lors du nettoyage des cookies:", error);
    }
  },
};

