/*****************************************************************************************************************
 * ROUTE : /api/rag/ask
 * 
 * Recherche RAG dans Pinecone : convertit la question en embedding et retourne les chunks pertinents
 * S'utilise AVEC /api/rag/analyze : ask → récupère contextes, analyze → analyse avec contextes
 * 
 * PARAMÈTRES :
 * - question (string, requis) : Question pour la recherche
 * - namespace (string, optionnel) : Namespace Pinecone (défaut: "default")
 * - topK (number, optionnel) : Nombre de chunks à retourner (défaut: 5)
 * 
 * RETOUR :
 * { status: 200, contexts: string } // Format: "[CONTEXT 1] (score=0.923)\nTexte..."
 * ou { status: 400|500, error: string }
 *****************************************************************************************************************/
import { NextRequest, NextResponse } from "next/server";
import { embedTexts } from "@/services/rag/vector";
import { pineconeIndex } from "@/services/rag/pinecone";

type RagAskBody = {
  question: string;
  namespace?: string;
  topK?: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RagAskBody;
    const { question, namespace, topK = 5 } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { error: "question est requise" },
        { status: 400 }
      );
    }

    /*****************************************************************************************************************
     * 1. Embedding de la question
     *****************************************************************************************************************/
    const [queryEmbedding] = await embedTexts([question]);

    /*****************************************************************************************************************
     * 2. Recherche des chunks les plus pertinents
     *****************************************************************************************************************/
    const queryResponse = await pineconeIndex.query({
      // @ts-ignore
      namespace: namespace ?? "default",
      topK,
      includeMetadata: true,
      includeValues: false,
      vector: queryEmbedding,
    });

    console.log("RAG ask - queryResponse>>>>>:", queryResponse);


    /*****************************************************************************************************************
     * 3. Analyse des chunks les plus pertinents et retourner le contexte
     *****************************************************************************************************************/
    const matches = queryResponse.matches ?? [];

    const contexts = matches
      .map((m, idx) => {
        const metadata = (m.metadata || {}) as Record<string, unknown>;
        const text = (metadata.text as string) ?? "";
        return text
          ? `[CONTEXT ${idx + 1}] (score=${m.score?.toFixed(3)})\n${text}`
          : "";
      })
      .filter(Boolean)
      .join("\n\n");

    return NextResponse.json({ status: 200, contexts }, { status: 200 });
  } catch (error) {
    console.error("RAG ask error:", error);
    return NextResponse.json(
      { status: 500, error: "Erreur serveur lors de la génération RAG" },
      { status: 500 }
    );
  }
}
