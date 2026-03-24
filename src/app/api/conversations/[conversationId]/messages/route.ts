import { auth } from "@/configs/prisma/auth";
import { prisma } from "@/configs/prisma/prisma"; // Adjust import
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await auth();
    const { conversationId } = await params;

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { text, type, payload } = body;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        client: true,
        artisan: true,
      }
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const isClient = conversation.clientId === user.id;
    const isArtisan = conversation.artisanId === user.id;

    if (!isClient && !isArtisan) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const fromRole = isClient ? "CLIENT" : "ARTISAN";

    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversationId,
        from: fromRole,
        contentType: type || "TEXT",
        text: text,
        payload: payload,
      },
    });

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
        // Update unread status based on who sent the message
        isUnreadByClient: isArtisan ? true : undefined,
        isUnreadByArtisan: isClient ? true : undefined,
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const session = await auth();
        const { conversationId } = await params;

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email,
            },
        });

        if (!user) {
             return new NextResponse("Unauthorized", { status: 401 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
        });

        if (!conversation) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        if (conversation.clientId !== user.id && conversation.artisanId !== user.id) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return NextResponse.json(messages);

    } catch (error) {
        console.log("[MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
