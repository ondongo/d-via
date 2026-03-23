"use server";

import { auth } from "@/configs/prisma/auth";
import { headers } from "next/headers";
import {
  deleteAnalysisHistoryForUser,
  loadAnalysisEntitlement,
  getIpHashFromHeaders,
} from "@/data/analysis";
import type { EntitlementResponse } from "@/types/analysis";

export type AnalysisEntitlementResult =
  | { ok: true; data: EntitlementResponse }
  | { ok: false; error: string };

export async function getAnalysisEntitlement(): Promise<AnalysisEntitlementResult> {
  try {
    const session = await auth();
    const h = await headers();
    const ipHash = getIpHashFromHeaders(h);
    const data = await loadAnalysisEntitlement(
      session?.user?.id ?? undefined,
      ipHash,
    );
    return { ok: true, data };
  } catch (e) {
    console.error("getAnalysisEntitlement", e);
    return { ok: false, error: "Erreur serveur" };
  }
}

export type DeleteAnalysisHistoryResult =
  | { ok: true }
  | { ok: false; error: string };

export async function deleteAnalysisHistory(
  id: string,
): Promise<DeleteAnalysisHistoryResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { ok: false, error: "Non autorisé" };
    }
    const { deleted } = await deleteAnalysisHistoryForUser(
      id,
      session.user.id,
    );
    if (!deleted) {
      return { ok: false, error: "Introuvable" };
    }
    return { ok: true };
  } catch (e) {
    console.error("deleteAnalysisHistory", e);
    return { ok: false, error: "Erreur serveur" };
  }
}
