"use client";

import { useRouter } from "next/navigation";

// ─── Données mockées ───────────────────────────────────────────────
const MOCK_MATERIAUX = [
  {
    designation: "Carrelage Grès Cérame",
    votrePrix: "65€/m²",
    moyenneMarche: "45€/m²",
    statut: "ÉLEVÉ" as const,
  },
  {
    designation: "Colle et joints",
    votrePrix: "12€/m²",
    moyenneMarche: "10€/m²",
    statut: "OK" as const,
  },
];

const MOCK_MAIN_OEUVRE = [
  {
    designation: "Pose carrelage",
    votrePrix: "45€/h",
    moyenneMarche: "40–55€/h",
    statut: "OK" as const,
  },
  {
    designation: "Colle et joints",
    votrePrix: "35€/h",
    moyenneMarche: "35–45€/h",
    statut: "OK" as const,
  },
];

const MOCK_VERDICT = {
  competitivite: { label: "Compétitivité", niveau: "Très Bonne", score: 88 },
  precisionTechnique: { label: "Précision technique", niveau: "Excellent", score: 95 },
};

const NOTE_IA =
  "Le prix du carrelage (+25%) s'explique par la référence « Grès Cérame » haut de gamme. Ce n'est pas une anomalie tarifaire mais un choix de qualité.";

// ─── Sous-composants ───────────────────────────────────────────────
type Statut = "OK" | "ÉLEVÉ" | "BAS";

function StatutBadge({ statut }: { statut: Statut }) {
  const styles: Record<Statut, string> = {
    OK: "border border-[#00B983] text-[#00B983]",
    ÉLEVÉ: "border border-[#E3A23E] text-[#E3A23E]",
    BAS: "border border-[#D55350] text-[#D55350]",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[statut]}`}
    >
      {statut}
    </span>
  );
}

type LigneComparative = {
  designation: string;
  votrePrix: string;
  moyenneMarche: string;
  statut: Statut;
};

function TableauComparatif({
  titre,
  lignes,
}: {
  titre: string;
  lignes: LigneComparative[];
}) {
  return (
    <div className="bg-white rounded-2xl border border-dvianeutral-50 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-dvianeutral-50">
        <h3 className="text-title-large font-semibold text-dvianeutral-10">
          {titre}
        </h3>
        <span className="text-xs text-dvianeutralvariant-60">Benchmark marché</span>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-dvianeutral-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-dvianeutralvariant-60">
              Désignation
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-dvianeutralvariant-60">
              Votre Prix
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-dvianeutralvariant-60">
              Moyenne Marché
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-dvianeutralvariant-60">
              Statut
            </th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne, i) => (
            <tr
              key={i}
              className={`${i < lignes.length - 1 ? "border-b border-dvianeutral-50" : ""}`}
            >
              <td className="px-6 py-4 text-sm text-dvianeutral-10">
                {ligne.designation}
              </td>
              <td className="px-6 py-4 text-sm text-right text-dvianeutral-10 font-medium">
                {ligne.votrePrix}
              </td>
              <td className="px-6 py-4 text-sm text-right text-dvianeutralvariant-60">
                {ligne.moyenneMarche}
              </td>
              <td className="px-6 py-4 text-right">
                <StatutBadge statut={ligne.statut} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JaugeScore({ score }: { score: number }) {
  return (
    <div className="relative w-full h-2 bg-white/30 rounded-full overflow-hidden">
      <div
        className="h-full bg-white rounded-full transition-all duration-700"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────
export default function AnalyseComparativePage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-[1100px] px-4 md:px-8 pb-10">
      {/* Retour */}
      <button
        onClick={() => router.back()}
        className="text-label-large leading-label-large tracking-label-large h-[40px] cursor-pointer rounded-8px border border-dvianeutral-50 bg-transparent px-4 py-1 text-sm font-medium text-dviaprimary-40 transition-shadow duration-300 hover:shadow-sm flex items-center gap-2 mb-6"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Retour au résumé
      </button>

      <h1 className="text-headline-large leading-headline-large font-semibold text-dvianeutral-10 mb-8">
        Analyse Comparative
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Colonne principale — tableaux */}
        <div className="flex-1 flex flex-col gap-6">
          <TableauComparatif titre="Prix des matériaux" lignes={MOCK_MATERIAUX} />
          <TableauComparatif titre="Main d'œuvre" lignes={MOCK_MAIN_OEUVRE} />

          {/* Note IA */}
          <div className="bg-white rounded-2xl border border-dvianeutral-50 px-6 py-5">
            <p className="text-xs font-semibold text-dvianeutralvariant-60 uppercase tracking-widest mb-2">
              Note sur le carrelage
            </p>
            <p className="text-sm text-dvianeutralvariant-40 leading-relaxed">
              {NOTE_IA}
            </p>
          </div>
        </div>

        {/* Colonne droite — Verdict Global */}
        <div className="lg:w-[280px] shrink-0">
          <div className="bg-dviaprimary-40 rounded-2xl p-6 text-white sticky top-6">
            <h3 className="text-title-large font-semibold mb-4">
              Verdict Global
            </h3>

            <p className="text-sm text-white/90 leading-relaxed mb-6">
              {NOTE_IA}
            </p>

            <div className="flex flex-col gap-4">
              {Object.values(MOCK_VERDICT).map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-white">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {item.niveau}
                    </span>
                  </div>
                  <JaugeScore score={item.score} />
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/dashboard/clients/artisans-recommandes")}
              className="mt-8 w-full bg-white text-dviaprimary-40 text-sm font-semibold py-2.5 rounded-8px hover:bg-dvianeutral-96 transition-colors cursor-pointer"
            >
              Voir les artisans alternatifs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
