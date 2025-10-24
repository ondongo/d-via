import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { prisma } from "./prisma";

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
      // L'adaptateur Prisma gère automatiquement la création des utilisateurs
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("User data:", user);
        (token as Token).userId = user.id;

        if (user.email === "gloireondongo1205@gmail.com") {
          (token as Token).role = "admin";
        } else if (user.email === "prince.ondongo@ism.edu.sn") {
          (token as Token).role = "admin";
        } else {
          (token as Token).role = "user";
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
