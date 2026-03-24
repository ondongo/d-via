import { auth } from "@/configs/prisma/auth";
import { prisma } from "@/configs/prisma/prisma"; // Adjust import
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const session = await auth();
        const { conversationId } = await params;

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
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
                        createdAt: "asc",
                    },
                }
            }
        });

        if (!conversation) {
            return new NextResponse("Conversation not found", { status: 404 });
        }

        if (conversation.clientId !== session.user.id && conversation.artisanId !== session.user.id) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        return NextResponse.json(conversation);

    } catch (error) {
        console.log("[CONVERSATION_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

