// =====================================================
// Helpers d'accès aux analyses
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { examAnalysisSchema } from "@/lib/ai/schema";
import type { AnalysisRow } from "@/types/database";
import type { ExamAnalysisResult } from "@/lib/ai/types";
import { DEFAULT_DISCLAIMER } from "@/lib/constants";

export interface ProjectAnalysis {
  id: string;
  createdAt: string;
  result: ExamAnalysisResult;
}

/**
 * Récupère la dernière analyse d'un projet et la valide via Zod.
 * Les colonnes JSONB stockées sont reparsées au passage pour
 * obtenir des types stricts côté UI.
 */
export async function getLatestProjectAnalysis(
  userId: string,
  projectId: string,
): Promise<ProjectAnalysis | null> {
  const supabase = createSupabaseServerClient();
  const { data: rawData, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[getLatestProjectAnalysis]", error);
    return null;
  }

  const row = rawData as AnalysisRow | null;
  if (!row) return null;

  // Reconstitue l'objet ExamAnalysisResult à partir des colonnes
  // dénormalisées et le revalide pour garantir la forme côté UI.
  const candidate = {
    global_summary: row.global_summary ?? "",
    detected_subject: row.detected_subject ?? "",
    exam_strategy: row.exam_strategy ?? "",
    preparation_score: row.preparation_score ?? 0,
    confidence_level: row.confidence_level ?? "medium",
    missing_information: row.missing_information,
    disclaimer: row.disclaimer || DEFAULT_DISCLAIMER,
    detected_chapters: row.detected_chapters,
    priority_chapters: row.priority_chapters,
    revision_sheets: row.revision_sheets,
    mock_exam: row.mock_exam,
    revision_plan: row.revision_plan,
    next_actions: row.next_actions,
  };

  const parsed = examAnalysisSchema.safeParse(candidate);
  if (!parsed.success) {
    console.error(
      "[getLatestProjectAnalysis] schéma invalide :",
      parsed.error.issues.slice(0, 5),
    );
    return null;
  }

  return {
    id: row.id,
    createdAt: row.created_at,
    result: parsed.data as ExamAnalysisResult,
  };
}
