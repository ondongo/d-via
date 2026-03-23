import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { prisma } from "@/configs/prisma/prisma";
import type { AnalysisGrade, EntitlementResponse } from "@/types/analysis";

const SALT =
  process.env.ANALYSIS_IP_HASH_SALT ||
  "dvia-change-ANALYSIS_IP_HASH_SALT-in-production";

export function hashClientIp(ip: string): string {
  return createHash("sha256").update(`${SALT}:${ip}`).digest("hex");
}

function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export function getIpHashFromHeaders(headers: Headers): string {
  return hashClientIp(clientIpFromHeaders(headers));
}

export function getClientIp(req: NextRequest): string {
  return clientIpFromHeaders(req.headers);
}

function reliabilityToGrade(score: number): AnalysisGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "D";
}

export async function loadAnalysisEntitlement(
  userId: string | undefined,
  ipHash: string,
): Promise<EntitlementResponse> {
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        analysisCredits: true,
        analysisHistory: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            fileName: true,
            reliability: true,
            createdAt: true,
          },
        },
      },
    });

    return {
      mode: "user",
      credits: user?.analysisCredits ?? 0,
      history: (user?.analysisHistory ?? []).map((row) => ({
        id: row.id,
        fileName: row.fileName,
        date: row.createdAt.toISOString(),
        reliability: row.reliability,
        grade: reliabilityToGrade(row.reliability),
      })),
    };
  }

  const guestUsed = !!(await prisma.guestAnalysisUsage.findUnique({
    where: { ipHash },
  }));

  return {
    mode: "guest",
    guestFreeAvailable: !guestUsed,
    history: [],
  };
}

export async function assertAnalysisAllowed(params: {
  userId: string | null;
  ipHash: string;
}): Promise<
  { ok: true } | { ok: false; message: string; status: number }
> {
  if (params.userId) {
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { analysisCredits: true },
    });
    if (!user || user.analysisCredits <= 0) {
      return {
        ok: false,
        message: "Plus de crédits d'analyse disponibles.",
        status: 402,
      };
    }
    return { ok: true };
  }

  const used = await prisma.guestAnalysisUsage.findUnique({
    where: { ipHash: params.ipHash },
  });
  if (used) {
    return {
      ok: false,
      message:
        "L'analyse gratuite a déjà été utilisée depuis cette connexion. Connectez-vous ou achetez des crédits.",
      status: 402,
    };
  }
  return { ok: true };
}

export async function commitSuccessfulAnalysis(params: {
  userId: string | null;
  ipHash: string;
  fileName: string | null;
  reliability: number;
}): Promise<void> {
  if (params.userId) {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.user.updateMany({
        where: {
          id: params.userId!,
          analysisCredits: { gt: 0 },
        },
        data: { analysisCredits: { decrement: 1 } },
      });
      if (updated.count === 0) {
        throw new Error("ANALYSIS_CREDIT_RACE");
      }
      if (params.fileName) {
        await tx.analysisHistory.create({
          data: {
            userId: params.userId!,
            fileName: params.fileName,
            reliability: params.reliability,
          },
        });
      }
    });
    return;
  }

  try {
    await prisma.guestAnalysisUsage.create({
      data: { ipHash: params.ipHash },
    });
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === "P2002") return;
    throw e;
  }
}

export async function deleteAnalysisHistoryForUser(
  id: string,
  userId: string,
): Promise<{ deleted: boolean }> {
  const row = await prisma.analysisHistory.findFirst({
    where: { id, userId },
  });
  if (!row) {
    return { deleted: false };
  }
  await prisma.analysisHistory.delete({ where: { id } });
  return { deleted: true };
}
