import { NextRequest } from "next/server";
import { prisma } from "@/configs/prisma/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const artisan = await prisma.artisan.findUnique({
      where: { id },
    });

    if (!artisan) {
      return new Response(JSON.stringify({ error: "Artisan non trouvé" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(artisan), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
    });
  }
}
