import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/configs/prisma/auth";
import {
  assertAnalysisAllowed,
  getClientIp,
  hashClientIp,
} from "@/data/analysis";

export async function POST(request: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const ipHash = hashClientIp(getClientIp(request));
  const gate = await assertAnalysisAllowed({ userId, ipHash });
  if (gate.ok === false) {
    return NextResponse.json(
      { status: gate.status, message: gate.message },
      { status: gate.status },
    );
  }

  const pk = process.env.PRIVATE_KEY;
  if (
    !pk ||
    !process.env.PROJECT_ID ||
    !process.env.REGION_ID ||
    !process.env.PROCESSOR_ID ||
    !process.env.CLIENT_EMAIL
  ) {
    return NextResponse.json(
      {
        status: 503,
        message:
          "Document AI n'est pas configuré en local (variables PROJECT_ID, PRIVATE_KEY, REGION_ID, PROCESSOR_ID, CLIENT_EMAIL). Sur Vercel, vérifiez que ces variables sont définies.",
      },
      { status: 503 },
    );
  }

  const documentclient = new DocumentProcessorServiceClient({
    credentials: {
      type: process.env.TYPE,
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: pk.replace(/\\n/g, "\n"),
      client_email: process.env.CLIENT_EMAIL,
      client_id: process.env.CLIENT_ID,
      universe_domain: process.env.UNIVERSE_DOMAIN,
    },
    apiEndpoint: `${process.env.REGION_ID}-documentai.googleapis.com`,
  });

  const files = await request.json();

  const fileData = files?.files?.[0]?.file ?? "aucun";
  const mimeType = files?.files?.[0]?.mimetype;

  console.log("MimeType reçu :", mimeType);

  if (!fileData || fileData === "aucun") {
    return NextResponse.json({
      status: 400,
      message: "Aucun fichier fourni",
    });
  }

  const supportedMimeTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  if (mimeType && !supportedMimeTypes.includes(mimeType)) {
    return NextResponse.json({
      status: 400,
      message: `Format de fichier non supporté : ${mimeType}. Formats acceptés : PDF, PNG, JPEG ou JPG`,
    });
  }

  const projectId = process.env.PROJECT_ID;
  const location = process.env.REGION_ID;
  const processorId = process.env.PROCESSOR_ID;
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  let cleanedFileData = fileData;
  if (typeof fileData === "string" && fileData.includes(",")) {
    cleanedFileData = fileData.split(",")[1];
  }

  const req = {
    name: name,
    rawDocument: {
      content: cleanedFileData,
      mimeType: mimeType ?? "application/pdf",
    },
  };

  try {
    const [response] = await documentclient.processDocument(req);
    const document: any = response.document;

    const { text } = document;

    const getText = (textAnchor: any) => {
      if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
        return "";
      }
      const startIndex = textAnchor.textSegments[0].startIndex || 0;
      const endIndex = textAnchor.textSegments[0].endIndex;
      return text.substring(startIndex, endIndex);
    };

    let extractedText = "";

    const [page1] = document.pages ?? [];
    if (!page1?.paragraphs?.length) {
      return NextResponse.json({
        status: 200,
        message: text || "",
      });
    }

    const { paragraphs } = page1;

    for (const paragraph of paragraphs) {
      const paragraphText = getText(paragraph.layout.textAnchor);
      extractedText += `\n${paragraphText}\n\n`;
    }

    console.log("********* extractedText *********", extractedText);

    return NextResponse.json({ status: 200, message: extractedText });
  } catch (error: any) {
    console.error("Erreur DocumentAI :", error);

    let errorMessage = "Erreur lors du traitement du document";
    if (error.message) {
      if (error.message.includes("DECODER")) {
        errorMessage =
          "Le fichier ne peut pas être décodé. Veuillez vérifier que le fichier n'est pas corrompu et qu'il est dans un format supporté (PDF, PNG, JPEG).";
      } else if (error.message.includes("INVALID_ARGUMENT")) {
        errorMessage =
          "Le format du fichier n'est pas valide ou n'est pas supporté.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({
      status: 500,
      message: errorMessage,
      error: error.message || error.toString(),
    });
  }
}
