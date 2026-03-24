import { auth } from "@/configs/prisma/auth";
import { prisma } from "@/configs/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { artisanId } = body; // This expects the User ID of the artisan

    if (!artisanId) {
      return new NextResponse("Artisan User ID required", { status: 400 });
    }

    // Check if conversation exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        clientId: session.user.id,
        artisanId: artisanId,
      },
    });

    if (conversation) {
      return NextResponse.json(conversation);
    }

    // Create new conversation
    // ALERT message as intro
    const alertText = "Vous échangez avec un artisan vérifié par D•VIA. Ne partagez pas vos coordonnées bancaires directement via la messagerie.";

    conversation = await prisma.conversation.create({
      data: {
        clientId: session.user.id,
        artisanId: artisanId,
        status: "PENDING",
        messages: {
          create: {
            from: "ARTISAN", // Display as coming from Artisan side (or logic handles ALERT types specially)
            contentType: "ALERT",
            text: alertText,
          },
        },
      },
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("[CONVERSATIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const userId = session.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { clientId: userId },
          { artisanId: userId }
        ]
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        artisan: {
          select: {
            id: true,
            name: true,
            image: true,
            artisan: {
              select: {
                companyName: true,
                verified: true,
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        }
      },
      orderBy: {
        updatedAt: 'desc',
      }
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("[CONVERSATIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

