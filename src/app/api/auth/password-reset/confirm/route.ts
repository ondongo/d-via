import bcrypt from "bcryptjs";
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma/prisma";

function hashResetToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = await request.json();

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const rawToken = String(token || "").trim();
    const newPassword = String(password || "");

    if (!normalizedEmail || !rawToken || !newPassword) {
      return NextResponse.json(
        { error: "Email, token et mot de passe sont requis." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const identifier = `password-reset:${normalizedEmail}`;
    const hashedToken = hashResetToken(rawToken);

    const resetToken = await prisma.verificationToken.findFirst({
      where: {
        identifier,
        token: hashedToken,
        expires: { gt: new Date() },
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Lien de réinitialisation invalide ou expiré." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        accounts: {
          where: { provider: "credentials" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction(async (tx) => {
      if (user.accounts.length > 0) {
        await tx.account.update({
          where: {
            provider_providerAccountId: {
              provider: "credentials",
              providerAccountId: user.accounts[0].providerAccountId,
            },
          },
          data: {
            access_token: hashedPassword,
          },
        });
      } else {
        await tx.account.create({
          data: {
            userId: user.id,
            type: "credentials",
            provider: "credentials",
            providerAccountId: user.id,
            access_token: hashedPassword,
          },
        });
      }

      await tx.verificationToken.deleteMany({
        where: { identifier },
      });
    });

    return NextResponse.json(
      { message: "Mot de passe réinitialisé avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur password-reset/confirm:", error);
    return NextResponse.json(
      { error: "Impossible de réinitialiser le mot de passe." },
      { status: 500 }
    );
  }
}
