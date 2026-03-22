import {
  DVIA_PRIMARY_COLOR,
  DVIA_PRIMARY_DARK,
  DVIA_BG_PAGE,
  DVIA_BG_HEADER,
  DVIA_TEXT_MAIN,
  DVIA_TEXT_MUTED,
  DVIA_BORDER,
  DVIA_FONT,
  DVIA_LOGO_URL,
} from "./index";

// ─── Base HTML wrapper ──────────────────────────────────────────────────────

export function wrapEmailHtml(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background-color:${DVIA_BG_PAGE};font-family:${DVIA_FONT};">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${DVIA_BG_PAGE};padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${DVIA_BORDER};box-shadow:0 2px 12px rgba(61,53,45,0.08);">

            <!-- Header -->
            <tr>
              <td style="background-color:${DVIA_BG_HEADER};padding:28px 32px;text-align:center;border-bottom:2px solid ${DVIA_BORDER};">
                <img src="${DVIA_LOGO_URL}" alt="D-via" style="max-width:120px;height:auto;" />
              </td>
            </tr>

            <!-- Bande orange decorative -->
            <tr>
              <td style="background-color:${DVIA_PRIMARY_COLOR};height:4px;font-size:0;line-height:0;">&nbsp;</td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 36px 28px;color:${DVIA_TEXT_MAIN};font-size:15px;line-height:1.75;font-family:${DVIA_FONT};">
                ${bodyContent}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:${DVIA_BG_HEADER};border-top:1px solid ${DVIA_BORDER};padding:20px 32px;text-align:center;">
                <p style="margin:0;font-size:12px;color:${DVIA_TEXT_MUTED};font-family:${DVIA_FONT};">
                  © ${new Date().getFullYear()} D-via — Tous droits réservés
                </p>
                <p style="margin:6px 0 0;font-size:12px;color:${DVIA_TEXT_MUTED};font-family:${DVIA_FONT};">
                  Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ─── Template : réinitialisation de mot de passe ────────────────────────────

export function passwordResetTemplate(resetUrl: string, userName?: string): string {
  const greeting = userName ? `Bonjour ${userName},` : "Bonjour,";

  const body = `
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:${DVIA_PRIMARY_COLOR};font-family:${DVIA_FONT};">
      Réinitialisation de votre mot de passe
    </h2>
    <p style="margin:0 0 12px;font-size:15px;color:${DVIA_TEXT_MAIN};">${greeting}</p>
    <p style="margin:0 0 24px;font-size:15px;color:${DVIA_TEXT_MAIN};">
      Vous avez demandé la réinitialisation de votre mot de passe sur <strong style="color:${DVIA_PRIMARY_COLOR};">D-via</strong>.
      Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:4px 0 32px;">
          <a href="${resetUrl}"
            style="display:inline-block;background-color:${DVIA_PRIMARY_COLOR};color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 40px;border-radius:8px;font-family:${DVIA_FONT};letter-spacing:0.3px;">
            Réinitialiser mon mot de passe
          </a>
        </td>
      </tr>
    </table>

    <div style="background-color:${DVIA_BG_PAGE};border:1px solid ${DVIA_BORDER};border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:13px;color:${DVIA_TEXT_MUTED};">
        Ce lien est valable <strong>1 heure</strong>. Passé ce délai, vous devrez faire une nouvelle demande.
      </p>
      <p style="margin:0;font-size:13px;color:${DVIA_TEXT_MUTED};">
        Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Votre mot de passe restera inchangé.
      </p>
    </div>

    <hr style="border:none;border-top:1px solid ${DVIA_BORDER};margin:24px 0;" />
    <p style="margin:0 0 6px;font-size:12px;color:${DVIA_TEXT_MUTED};">
      Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :
    </p>
    <p style="margin:0;font-size:12px;word-break:break-all;">
      <a href="${resetUrl}" style="color:${DVIA_PRIMARY_DARK};">${resetUrl}</a>
    </p>
  `;

  return wrapEmailHtml("Réinitialisation de votre mot de passe — D-via", body);
}

// ─── Template : bienvenue client ─────────────────────────────────────────────

export function welcomeTemplate(userName: string): string {
  const dashboardUrl = `${process.env.HOST_URL ?? "https://d-via.fr"}/dashboard/clients`;

  const body = `
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:${DVIA_PRIMARY_COLOR};font-family:${DVIA_FONT};">
      Bienvenue sur D-via !
    </h2>
    <p style="margin:0 0 12px;font-size:15px;color:${DVIA_TEXT_MAIN};">Bonjour ${userName},</p>
    <p style="margin:0 0 12px;font-size:15px;color:${DVIA_TEXT_MAIN};">
      Nous sommes ravis de vous compter parmi nous.
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:${DVIA_TEXT_MAIN};">
      Votre compte est désormais actif. Accédez à votre espace personnel pour suivre
      vos demandes et profiter de tous nos services.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:4px 0 36px;">
          <a href="${dashboardUrl}"
            style="display:inline-block;background-color:${DVIA_PRIMARY_COLOR};color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 40px;border-radius:8px;font-family:${DVIA_FONT};letter-spacing:0.3px;">
            Accéder à mon espace
          </a>
        </td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid ${DVIA_BORDER};margin:4px 0 24px;" />

    <p style="margin:0 0 4px;font-size:14px;color:${DVIA_TEXT_MAIN};">Cordialement,</p>
    <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:${DVIA_PRIMARY_COLOR};">L'équipe D-via</p>

    <p style="margin:0;font-size:12px;color:${DVIA_TEXT_MUTED};">
      Une question ? Écrivez-nous à
      <a href="mailto:support@d-via.fr" style="color:${DVIA_PRIMARY_DARK};text-decoration:none;font-weight:600;">support@d-via.fr</a>.
    </p>
  `;

  return wrapEmailHtml("Bienvenue sur D-via !", body);
}

// ─── Template : bienvenue artisan ────────────────────────────────────────────

export function welcomeArtisanTemplate(userName: string): string {
  const dashboardUrl = `${process.env.HOST_URL ?? "https://d-via.fr"}/dashboard`;

  const bulletStyle = `display:inline-block;width:8px;height:8px;background-color:${DVIA_PRIMARY_COLOR};border-radius:50%;margin-right:10px;vertical-align:middle;flex-shrink:0;`;

  const body = `
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:700;color:${DVIA_PRIMARY_COLOR};font-family:${DVIA_FONT};">
      Bienvenue sur D-via !
    </h2>
    <p style="margin:0 0 12px;font-size:15px;color:${DVIA_TEXT_MAIN};">Bonjour ${userName},</p>
    <p style="margin:0 0 12px;font-size:15px;color:${DVIA_TEXT_MAIN};">
      Nous sommes ravis de vous compter parmi nous.
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:${DVIA_TEXT_MAIN};">
      Votre espace artisan est maintenant actif. En rejoignant D-via, vous gagnez en
      <strong style="color:${DVIA_PRIMARY_COLOR};">visibilité</strong> auprès de milliers
      de clients à la recherche de professionnels qualifiés comme vous.
    </p>

    <div style="background-color:${DVIA_BG_PAGE};border:1px solid ${DVIA_BORDER};border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0 0 12px;font-size:14px;color:${DVIA_TEXT_MAIN};">
        <span style="${bulletStyle}"></span>
        Profil visible par les clients sur toute la plateforme
      </p>
      <p style="margin:0 0 12px;font-size:14px;color:${DVIA_TEXT_MAIN};">
        <span style="${bulletStyle}"></span>
        Recevez des demandes directement dans votre tableau de bord
      </p>
      <p style="margin:0;font-size:14px;color:${DVIA_TEXT_MAIN};">
        <span style="${bulletStyle}"></span>
        Gérez vos missions et développez votre activité sereinement
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:4px 0 36px;">
          <a href="${dashboardUrl}"
            style="display:inline-block;background-color:${DVIA_PRIMARY_COLOR};color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;padding:14px 40px;border-radius:8px;font-family:${DVIA_FONT};letter-spacing:0.3px;">
            Accéder à mon espace artisan
          </a>
        </td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid ${DVIA_BORDER};margin:4px 0 24px;" />

    <p style="margin:0 0 4px;font-size:14px;color:${DVIA_TEXT_MAIN};">Cordialement,</p>
    <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:${DVIA_PRIMARY_COLOR};">L'équipe D-via</p>

    <p style="margin:0;font-size:12px;color:${DVIA_TEXT_MUTED};">
      Une question ? Écrivez-nous à
      <a href="mailto:support@d-via.fr" style="color:${DVIA_PRIMARY_DARK};text-decoration:none;font-weight:600;">support@d-via.fr</a>.
    </p>
  `;

  return wrapEmailHtml("Bienvenue sur D-via !", body);
}
