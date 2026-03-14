import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const documentclient = new DocumentProcessorServiceClient({

    credentials: {
      type: process.env.TYPE,
      project_id: process.env.PROJECT_ID,
      private_key_id: process.env.PRIVATE_KEY_ID,
      private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
      //private_key: process.env.PRIVATE_KEY,
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

    // Fonction pour récupérer des segments de texte
    const getText = (textAnchor: any) => {
      if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
        return "";
      }
      const startIndex = textAnchor.textSegments[0].startIndex || 0;
      const endIndex = textAnchor.textSegments[0].endIndex;
      return text.substring(startIndex, endIndex);
    };

    // Collecter tous les paragraphes du document
    let extractedText = ""; // Variable pour collecter le texte

    // Supposons que "document.pages" contient les pages du document
    const [page1] = document.pages;
    const { paragraphs } = page1;

    // Parcours de tous les paragraphes et collecte du texte
    for (const paragraph of paragraphs) {
      const paragraphText = getText(paragraph.layout.textAnchor);
      extractedText += `\n${paragraphText}\n\n`;
    }

    console.log("********* extractedText *********", extractedText);

    /* 
    Retourne la réponse avec tout le texte extrait dans la variable extractedText
    */
    return NextResponse.json({ status: 200, message: extractedText });
  } catch (error: any) {
    console.error("Erreur DocumentAI :", error);
    
    let errorMessage = "Erreur lors du traitement du document";
    if (error.message) {
      if (error.message.includes("DECODER")) {
        errorMessage = "Le fichier ne peut pas être décodé. Veuillez vérifier que le fichier n'est pas corrompu et qu'il est dans un format supporté (PDF, PNG, JPEG).";
      } else if (error.message.includes("INVALID_ARGUMENT")) {
        errorMessage = "Le format du fichier n'est pas valide ou n'est pas supporté.";
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
