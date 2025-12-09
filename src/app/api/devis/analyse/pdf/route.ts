import { NextRequest, NextResponse } from 'next/server';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

export const dynamic = 'force-dynamic';

function createDocAiClient(): DocumentProcessorServiceClient {
  const { PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY } = process.env as Record<string, string>;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new DocumentProcessorServiceClient({});
  }
  if (!PROJECT_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Document AI credentials manquants (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY)');
  }
  const normalizedKey = PRIVATE_KEY.replace(/\\n/g, '\n');
  return new DocumentProcessorServiceClient({
    projectId: PROJECT_ID,
    credentials: { client_email: CLIENT_EMAIL, private_key: normalizedKey },
  } as any);
}

// Reprend utilitaires depuis analyse route (doublon minimal pour être autonome)
const euroToNumber = (s: string): number | undefined => {
  const cleaned = s.replace(/[€\s]/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? undefined : n;
};
const extractCompanyName = (text: string): string | undefined => {
  const m = text.match(/\b(SASU|SAS|SARL|EURL)\s+([^\n]+)/i);
  if (m) {
    const cleaned = m[2].replace(/\b(SIRET|TVA|SIREN|RCS|NUMÉRO)\b.*$/i, '').trim();
    return `${m[1].toUpperCase()} ${cleaned}`.trim();
  }
  const m2 = text.match(/\b(Entreprise|Société)\s*:\s*([^\n]+)/i);
  if (m2) {
    const cleaned = m2[2].replace(/\b(SIRET|TVA|SIREN|RCS|NUMÉRO)\b.*$/i, '').trim();
    return cleaned;
  }
  return undefined;
};
const extractSiret = (text: string): string | undefined => {
  const m = text.match(/SIRET\s*:?\s*(\d{14})/i);
  return m ? m[1] : undefined;
};
const extractAddress = (text: string): string | undefined => {
  const m = text.match(/Adresse\s*:?\s*([^\n]+)/i);
  return m ? m[1].trim() : undefined;
};
const extractTaxes = (text: string) => {
  const taxes: { rate: number }[] = [];
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
const extractLineItems = (text: string) => {
  const lines: Array<{ description: string; quantity?: number; unitPrice?: number }> = [];
  const candidateLines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  for (const l of candidateLines) {
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

async function extractTextWithDocumentAI(base64Pdf: string): Promise<string> {
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

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file || !(file as any).arrayBuffer) {
      return NextResponse.json({ error: "Champ 'file' manquant" }, { status: 400 });
    }
    const buf = Buffer.from(await (file as File).arrayBuffer());
    const base64 = buf.toString('base64');

    let text: string;
    try {
      text = await extractTextWithDocumentAI(base64);
    } catch (e: any) {
      return NextResponse.json(
        { error: 'Erreur Document AI', message: e?.message },
        { status: 500 }
      );
    }

    const normalized = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\t/g, ' ');

    const analysis = {
      companyName: extractCompanyName(normalized),
      siret: extractSiret(normalized),
      siren: undefined as string | undefined,
      creationDate: undefined as string | undefined,
      address: extractAddress(normalized),
      lineItems: extractLineItems(normalized),
      taxes: extractTaxes(normalized),
      totals: extractTotals(normalized),
      redFlags: [] as string[],
      normalizedText: normalized,
    };

    if (!analysis.siret) analysis.redFlags.push('SIRET manquant');
    if (analysis.taxes.length === 0) analysis.redFlags.push('TVA non précisée');
    if (!analysis.totals.grandTotal) analysis.redFlags.push('Total TTC manquant');
    if (analysis.siret && analysis.siret.length === 14) analysis.siren = analysis.siret.slice(0, 9);

    return NextResponse.json(analysis);
  } catch (err: any) {
    console.error('Error in /api/devis/analyse/pdf:', err);
    return NextResponse.json(
      { error: 'Erreur interne', message: err?.message },
      { status: 500 }
    );
  }
}
