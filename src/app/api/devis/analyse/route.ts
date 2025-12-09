import { NextRequest, NextResponse } from 'next/server';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

function createDocAiClient(): DocumentProcessorServiceClient {
  const {
    PROJECT_ID,
    CLIENT_EMAIL,
    PRIVATE_KEY,
  } = process.env as Record<string, string>;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new DocumentProcessorServiceClient({});
  }
  if (!PROJECT_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Document AI credentials manquants (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY)');
  }
  const normalizedKey = PRIVATE_KEY.replace(/\\n/g, '\n');
  return new DocumentProcessorServiceClient({
    projectId: PROJECT_ID,
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: normalizedKey,
    },
  } as any);
}

export const dynamic = 'force-dynamic';

// Types de sortie
type LineItem = {
  description: string;
  quantity?: number;
  unitPrice?: number;
  total?: number;
};

type Tax = {
  rate: number; // en %
  base?: number;
  amount?: number;
};

type Analysis = {
  companyName?: string;
  siret?: string;
  siren?: string;
  creationDate?: string;
  address?: string;
  lineItems: LineItem[];
  taxes: Tax[];
  totals: {
    subtotal?: number;
    taxTotal?: number;
    grandTotal?: number;
  };
  redFlags: string[];
  normalizedText: string;
};

// Utilitaires
const euroToNumber = (s: string): number | undefined => {
  const cleaned = s.replace(/[€\s]/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? undefined : n;
};

const extractCompanyName = (text: string): string | undefined => {
  const m = text.match(/(SASU|SAS|SARL|EURL)\s+([A-ZÀÂÄÇÉÈÊËÎÏÔÖÙÛÜŸ0-9\-\s]+)/i);
  if (m) return m[0].trim();
  const m2 = text.match(/(Entreprise|Société)\s*:\s*([^\n]+)/i);
  return m2 ? m2[2].trim() : undefined;
};

const extractSiret = (text: string): string | undefined => {
  const m = text.match(/SIRET\s*:?\s*(\d{14})/i);
  return m ? m[1] : undefined;
};

const extractAddress = (text: string): string | undefined => {
  const m = text.match(/Adresse\s*:?\s*([^\n]+)/i);
  return m ? m[1].trim() : undefined;
};

const extractTaxes = (text: string): Tax[] => {
  const taxes: Tax[] = [];
  const re = /TVA\s*(?:à\s*)?(\d{1,2}(?:[\.,]\d{1,2})?)\s*%/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const rate = parseFloat(match[1].replace(',', '.'));
    taxes.push({ rate });
  }
  return taxes;
};

const extractTotals = (text: string) => {
  const totalTTCMatch = text.match(/Total\s*TTC\s*:?\s*([0-9\s.,]+)\s*€?/i);
  const totalHTMatch = text.match(/Total\s*HT\s*:?\s*([0-9\s.,]+)\s*€?/i);
  const tvaAmountMatch = text.match(/TVA\s*\(.*?\)\s*:?\s*([0-9\s.,]+)\s*€?/i);
  return {
    grandTotal: totalTTCMatch ? euroToNumber(totalTTCMatch[1]) : undefined,
    subtotal: totalHTMatch ? euroToNumber(totalHTMatch[1]) : undefined,
    taxTotal: tvaAmountMatch ? euroToNumber(tvaAmountMatch[1]) : undefined,
  };
};

const extractLineItems = (text: string): LineItem[] => {
  const lines: LineItem[] = [];
  const candidateLines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  for (const l of candidateLines) {
    // Cherche un prix et/ou un total
    const priceMatch = l.match(/(\d{1,3}(?:\s\d{3})*(?:[\.,]\d{2})?|\d+(?:[\.,]\d{2})?)\s*€(?!\w)/);
    const qtyMatch = l.match(/(\d+(?:[\.,]\d+)?)\s*(?:u|unité|unités|pcs|pièces)/i);
    if (priceMatch || qtyMatch) {
      const unitPrice = priceMatch ? euroToNumber(priceMatch[1]) : undefined;
      const qty = qtyMatch ? parseFloat(qtyMatch[1].replace(',', '.')) : undefined;
      lines.push({ description: l.replace(/\s*€.*$/, ''), quantity: qty, unitPrice });
    }
  }
  return lines;
};

async function callDocumentAIWithRaw(base64Pdf: string): Promise<string> {
  const { PROJECT_ID, REGION_ID, PROCESSOR_ID } = process.env as Record<string, string>;
  if (!PROJECT_ID || !REGION_ID || !PROCESSOR_ID) {
    throw new Error('Document AI config manquante (PROJECT_ID, REGION_ID, PROCESSOR_ID)');
  }
  const client = createDocAiClient();
  const name = `projects/${PROJECT_ID}/locations/${REGION_ID}/processors/${PROCESSOR_ID}`;
  const resp = await client.processDocument({
    name,
    rawDocument: { content: base64Pdf, mimeType: 'application/pdf' },
  } as any);
  const result = Array.isArray(resp) ? resp[0] : resp;
  const text = result.document?.text ?? '';
  if (!text) throw new Error('Aucun texte extrait par Document AI');
  return text;
}

async function callDocumentAIWithGcs(gcsUri: string): Promise<string> {
  const { PROJECT_ID, REGION_ID, PROCESSOR_ID } = process.env as Record<string, string>;
  if (!PROJECT_ID || !REGION_ID || !PROCESSOR_ID) {
    throw new Error('Document AI config manquante (PROJECT_ID, REGION_ID, PROCESSOR_ID)');
  }
  const client = createDocAiClient();
  const name = `projects/${PROJECT_ID}/locations/${REGION_ID}/processors/${PROCESSOR_ID}`;
  const resp = await client.processDocument({
    name,
    document: { uri: gcsUri, mimeType: 'application/pdf' },
  } as any);
  const result = Array.isArray(resp) ? resp[0] : resp;
  const text = result.document?.text ?? '';
  if (!text) throw new Error('Aucun texte extrait par Document AI');
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let text: string | undefined = body?.text;

    // Si pas de texte fourni, tenter Document AI via pdfBase64 ou gcsUri
    if ((!text || typeof text !== 'string') && (body?.pdfBase64 || body?.gcsUri)) {
      try {
        if (body?.pdfBase64) {
          text = await callDocumentAIWithRaw(body.pdfBase64);
        } else if (body?.gcsUri) {
          text = await callDocumentAIWithGcs(body.gcsUri);
        }
      } catch (docErr: any) {
        return NextResponse.json(
          { error: 'Erreur Document AI', message: docErr?.message },
          { status: 500 },
        );
      }
    }

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Le champ 'text' est requis" }, { status: 400 });
    }

    const normalized = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\t/g, ' ');

    const analysis: Analysis = {
      companyName: extractCompanyName(normalized),
      siret: extractSiret(normalized),
      siren: undefined,
      creationDate: undefined,
      address: extractAddress(normalized),
      lineItems: extractLineItems(normalized),
      taxes: extractTaxes(normalized),
      totals: extractTotals(normalized),
      redFlags: [],
      normalizedText: normalized,
    };

    if (!analysis.siret) analysis.redFlags.push('SIRET manquant');
    if (analysis.taxes.length === 0) analysis.redFlags.push('TVA non précisée');
    if (!analysis.totals.grandTotal) analysis.redFlags.push('Total TTC manquant');

    if (analysis.siret && analysis.siret.length === 14) {
      analysis.siren = analysis.siret.slice(0, 9);
    }

    return NextResponse.json(analysis);
  } catch (err: any) {
    console.error('Error in /api/devis/analyse:', err);
    return NextResponse.json(
      { error: 'Erreur interne', message: err?.message },
      { status: 500 }
    );
  }
}
