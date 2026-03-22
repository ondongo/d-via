import { createHash, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma/prisma";
import { sendPasswordResetEmail } from "@/services/email/serviceBrevo";

function hashResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const normalizedEmail = String(email ?? "")
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "L'adresse email est requise." },
        { status: 400 }
      );
    }
    const neutralResponse = NextResponse.json(
      { message: "Si ce compte existe, un lien de réinitialisation a été envoyé." },
      { status: 200 }
    );

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return neutralResponse;
    }

    const identifier = `password-reset:${normalizedEmail}`;

    // Supprimer les anciens tokens pour cet email
    await prisma.verificationToken.deleteMany({ where: { identifier } });

    // Générer un token sécurisé valable 1 heure
    const rawToken = randomBytes(32).toString("hex");
    const hashedToken = hashResetToken(rawToken);
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier,
        token: hashedToken,
        expires,
      },
    });

    const baseUrl = process.env.HOST_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?email=${encodeURIComponent(normalizedEmail)}&token=${rawToken}`;

    await sendPasswordResetEmail(
      normalizedEmail,
      resetUrl,
      user.name ?? undefined
    );

    return neutralResponse;
  } catch (error) {
    console.error("Erreur password-reset/request:", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer le lien de réinitialisation." },
      { status: 500 }
    );
  }
}
