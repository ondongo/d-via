import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/configs/prisma/prisma";

export async function POST(request: NextRequest) {
  try {
    const { contentId, type, sessionId } = await request.json();

    if (!contentId || !type || !sessionId) {
      return NextResponse.json(
        { error: "contentId, type et sessionId sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'article existe
    const blog = await prisma.blog.findUnique({
      where: { id: contentId },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a déjà réagi avec cette session
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        contentId,
        sessionId,
        type: type as any,
      },
    });

    if (existingReaction) {
      // Supprimer la réaction existante
      await prisma.reaction.delete({
        where: { id: existingReaction.id },
      });
    } else {
      // Créer une nouvelle réaction
      await prisma.reaction.create({
        data: {
          contentId,
          sessionId,
          type: type as any,
          count: 1,
        },
      });
    }

    // Récupérer toutes les réactions pour cet article
    const reactions = await prisma.reaction.findMany({
      where: { contentId },
      select: {
        id: true,
        type: true,
        count: true,
      },
    });

    return NextResponse.json({ reactions });
  } catch (error) {
    console.error("Erreur lors de la gestion des réactions:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
