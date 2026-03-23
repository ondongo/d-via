/*******************************************************
 * Envoi générique via Brevo 
 *******************************************************/
import { BREVO_API_URL, DVIA_SENDER } from "@/constants";
import {
  passwordResetTemplate,
  welcomeTemplate,
  welcomeArtisanTemplate,
} from "@/constants/emailTemplate";

interface BrevoRecipient {
  email: string;
  name?: string;
}

interface SendEmailOptions {
  to: BrevoRecipient[];
  subject: string;
  htmlContent: string;
  replyTo?: BrevoRecipient;
}

async function sendEmail(options: SendEmailOptions): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY manquante dans les variables d'environnement.");
  }

  const payload = {
    sender: {
      name: DVIA_SENDER.name,
      email: DVIA_SENDER.email,
    },
    replyTo: {
      name: "D-via",
      email: "noreply@d-via.fr",
    },
    to: options.to,
    subject: options.subject,
    htmlContent: options.htmlContent,
    ...(options.replyTo ? { replyTo: options.replyTo } : {}),
  };

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorText}`);
  }
}

/*******************************************************
 * Fonctions d'envoi métier Brevo
 *******************************************************/
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  userName?: string
): Promise<void> {
  await sendEmail({
    to: [{ email: to }],
    subject: "Réinitialisation de votre mot de passe — D-via",
    htmlContent: passwordResetTemplate(resetUrl, userName),
  });
}

export async function sendWelcomeEmail(
  to: string,
  userName: string
): Promise<void> {
  await sendEmail({
    to: [{ email: to, name: userName }],
    subject: `Bienvenue sur D-via, ${userName} !`,
    htmlContent: welcomeTemplate(userName),
  });
}

export async function sendWelcomeArtisanEmail(
  to: string,
  userName: string
): Promise<void> {
  await sendEmail({
    to: [{ email: to, name: userName }],
    subject: `Bienvenue sur D-via, ${userName} !`,
    htmlContent: welcomeArtisanTemplate(userName),
  });
}
