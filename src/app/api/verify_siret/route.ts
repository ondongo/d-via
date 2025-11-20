// typescript
import { NextRequest, NextResponse } from "next/server";

// Formes juridiques
const LEGAL_FORMS = [
    "SARL",
    "EURL",
    "SAS",
    "SASU",
    "SA",
    "SCI",
    "SNC",
    "SCP",
    "SCOP",
    "EARL",
    "SCEA",
    "SELARL",
    "SELAS",
];

function normalizeCompanyName(raw: string | null | undefined): string {
    if (!raw) return "";

    // Majuscules
    let name = raw.toUpperCase();

    name = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    // Remplacer tout ce qui n'est pas lettre ou chiffre par des espaces
    name = name.replace(/[^A-Z0-9]/g, " ");

    // Split en mots, retirer les formes juridiques et mots vides
    const parts = name
        .split(/\s+/)
        .filter(
            (p) =>
                p.length > 0 &&
                !LEGAL_FORMS.includes(p) &&
                !["SARL.", "SAS.", "SA."].includes(p)
        );

    return parts.join(" ");
}

async function fetchSireneBySiret(siret: string) {
    const token = process.env.INSEE_API_TOKEN;
    if (!token) {
        throw new Error("Missing INSEE_API_TOKEN in environment");
    }

    // Utilisation du endpoint comme dans Postman
    const url = `https://api.insee.fr/api-sirene/3.11/siret?q=siret:${siret}&nombre=1`;

    const res = await fetch(url, {
        headers: {
            "X-INSEE-Api-Key-Integration": token,
            Accept: "application/json",
        },
    });

    if (res.status === 404) {
        return null; // SIRET inconnu
    }

    if (!res.ok) {
        throw new Error(`Sirene API error: ${res.status}`);
    }

    return res.json();
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const siret = body?.siret?.toString().trim();
        if (!siret) {
            return NextResponse.json(
                { error: "siret est obligatoire" },
                { status: 400 }
            );
        }

        if (!/^\d{14}$/.test(siret)) {
            return NextResponse.json(
                { error: "SIRET invalide (doit contenir 14 chiffres)" },
                { status: 400 }
            );
        }

        const sireneData = await fetchSireneBySiret(siret);

        if (!sireneData) {
            return NextResponse.json(
                {
                    validSiret: false,
                    siret,
                    reason: "SIRET introuvable dans le répertoire Sirene",
                },
                { status: 200 }
            );
        }

        // Mappage
        const etab = Array.isArray((sireneData as any).etablissements)
            ? (sireneData as any).etablissements[0]
            : sireneData;

        const uniteLegale = etab?.uniteLegale ?? {};

        const nomEntreprise: string | null =
            uniteLegale.denominationUniteLegale ||
            uniteLegale.nomUniteLegale ||
            null;

        const dateCreation: string | null =
            uniteLegale.dateCreationUniteLegale ||
            etab?.dateCreationEtablissement ||
            null;

        const adresseObj = etab?.adresseEtablissement ?? {};
        const adresse = [
            adresseObj.numeroVoieEtablissement,
            adresseObj.typeVoieEtablissement,
            adresseObj.libelleVoieEtablissement,
            adresseObj.codePostalEtablissement,
            adresseObj.libelleCommuneEtablissement,
        ]
            .filter(Boolean)
            .join(" ");

        return NextResponse.json(
            {
                nomEntreprise,
                dateCreation,
                adresse,
                siret,
                siren: etab?.siren ?? null,
            },
            { status: 200 }
        );

    } catch (err: any) {
        console.error("Error in /api/verify_siret:", err);
        return NextResponse.json(
            { error: "Erreur interne lors de la vérification du SIRET" },
            { status: 500 }
        );
    }
}
