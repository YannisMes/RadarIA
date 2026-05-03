// =====================================================
// POST /api/projects/[id]/analyze
// =====================================================
// Lance l'analyse IA d'un projet de l'utilisateur.

import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getUserProject } from "@/lib/projects";
import {
  countByCategory,
  isReadyForAnalysis,
  listProjectDocuments,
} from "@/lib/documents";
import { canRunAnalysis, bumpUsageLimits } from "@/lib/quota";
import { analyzeProject } from "@/lib/ai/analyze-project";

// L'analyse Gemini peut prendre 30-60s ; on autorise jusqu'à 5 min.
export const maxDuration = 300;
// On veut s'assurer du runtime Node.js (pdf-parse / Gemini SDK).
export const runtime = "nodejs";

const idSchema = z.string().uuid("Identifiant de projet invalide.");

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  void request;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentification requise." },
      { status: 401 },
    );
  }

  const idCheck = idSchema.safeParse(params.id);
  if (!idCheck.success) {
    return NextResponse.json(
      { error: idCheck.error.issues[0]?.message ?? "ID invalide." },
      { status: 400 },
    );
  }
  const projectId = idCheck.data;

  // Ownership
  const project = await getUserProject(user.id, projectId);
  if (!project) {
    return NextResponse.json(
      { error: "Projet introuvable." },
      { status: 404 },
    );
  }

  // Documents prêts ?
  const documents = await listProjectDocuments(user.id, projectId);
  const counts = countByCategory(documents);
  const readiness = isReadyForAnalysis(counts);
  if (!readiness.ready) {
    return NextResponse.json(
      {
        error:
          "Documents insuffisants pour lancer l'analyse. " +
          readiness.reasons.join(" "),
      },
      { status: 400 },
    );
  }

  // Quota analyse
  const { allowed, snapshot } = await canRunAnalysis(user.id);
  if (!allowed) {
    return NextResponse.json(
      {
        error: snapshot.isPremium
          ? "Tu as atteint la limite d'analyses de ton plan."
          : "Limite gratuite atteinte (1 analyse). Passe Premium pour en lancer plus.",
      },
      { status: 402 },
    );
  }

  const result = await analyzeProject(user.id, projectId);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await bumpUsageLimits(user.id, { analyses: 1 });
  revalidatePath(`/dashboard`);
  revalidatePath(`/dashboard/projects/${projectId}/results`);

  return NextResponse.json({
    analysisId: result.analysisId,
    preparationScore: result.preparationScore,
  });
}
