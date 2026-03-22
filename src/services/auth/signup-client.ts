"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/configs/prisma/prisma";
import { signupClientSchema } from "@/schemas/auth";
import { sendWelcomeEmail } from "@/services/email/serviceBrevo";
import { Role } from "@prisma/client";

type SignupClientActionResult =
  | { success: true; userId: string }
  | { success: false; error: string };

export async function signupClientAction(
  payload: unknown
): Promise<SignupClientActionResult> {
  const parsed = signupClientSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  const { firstName, lastName, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { artisan: true },
    });

    if (existingUser?.artisan) {
      return {
        success: false,
        error:
          "Cet email est déjà lié à un compte artisan. Utilisez le parcours artisan.",
      };
    }

    if (existingUser) {
      return {
        success: false,
        error: "Un utilisateur avec cet email existe déjà.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: `${firstName} ${lastName}`,
        role: Role.CLIENT,
      },
    });

    await prisma.account.create({
      data: {
        userId: user.id,
        type: "credentials",
        provider: "credentials",
        providerAccountId: user.id,
        access_token: hashedPassword,
      },
    });

    sendWelcomeEmail(normalizedEmail, `${firstName} ${lastName}`).catch((err) =>
      console.error("Erreur envoi email bienvenue:", err)
    );

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Erreur signup client action:", error);
    return {
      success: false,
      error: "Erreur lors de la création du compte client.",
    };
  }
}
