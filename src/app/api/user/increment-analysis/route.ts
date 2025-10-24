import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        analysisCount: {
          increment: 1,
        },
      },
      select: { analysisCount: true },
    });

    return NextResponse.json({ count: user.analysisCount });
  } catch (error) {
    console.error("Erreur lors de l'incrémentation du compteur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
