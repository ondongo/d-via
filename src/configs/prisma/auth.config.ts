import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { prisma } from "./prisma";
import { createStripeCustomer } from "@/utils/stripe-customer";

interface Token {
  role?: string;
  userId?: string;
}

interface Session {
  user: {
    role?: string;
    id?: string;
  };
}

export default {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Vérifier si l'utilisateur existe déjà dans la base de données
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        // Si l'utilisateur n'existe pas encore, créer un client Stripe
        if (!existingUser) {
          console.log("Nouvel utilisateur détecté, création du client Stripe...");
          // L'utilisateur sera créé par l'adaptateur Prisma après ce callback
          // On créera le client Stripe dans le callback jwt après la création de l'utilisateur
        } else if (!existingUser.stripeCustomerId) {
          // Si l'utilisateur existe mais n'a pas de stripeCustomerId, le créer
          console.log("Utilisateur existant sans client Stripe, création en cours...");
          await createStripeCustomer({
            email: user.email!,
            name: user.name || undefined,
            userId: existingUser.id,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la création du client Stripe:", error);
        // Ne pas bloquer la connexion en cas d'erreur Stripe
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("User data:", user);
        (token as Token).userId = user.id;

        // Définir le rôle de l'utilisateur
        if (user.email === "gloireondongo1205@gmail.com") {
          (token as Token).role = "admin";
        } else if (user.email === "prince.ondongo@ism.edu.sn") {
          (token as Token).role = "admin";
        } else {
          (token as Token).role = "user";
        }

        // Créer un client Stripe pour les nouveaux utilisateurs
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
          });

          if (dbUser && !dbUser.stripeCustomerId) {
            console.log("Création du client Stripe pour le nouvel utilisateur...");
            await createStripeCustomer({
              email: user.email!,
              name: user.name || undefined,
              userId: user.id,
            });
          }
        } catch (error) {
          console.error("Erreur lors de la création du client Stripe dans jwt:", error);
          // Ne pas bloquer la connexion en cas d'erreur Stripe
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Exposer le userId et le role dans la session
      (session as Session).user.role = (token as Token).role;
      (session as Session).user.id = (token as Token).userId;
      return session;
    },
  },
} satisfies NextAuthConfig;
