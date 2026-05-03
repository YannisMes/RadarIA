// =====================================================
// Orchestrateur d'analyse d'un projet
// =====================================================
// Charge les documents extraits, construit l'input,
// délègue au provider, persiste la réponse.

import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { listProjectDocuments } from "@/lib/documents";
import { getUserProject } from "@/lib/projects";
import { GeminiProvider } from "@/lib/ai/providers/gemini";
import {
  studyLevelLabel,
  examTypeLabel,
  currentLevelLabel,
  targetGradeLabel,
  availableTimeLabel,
} from "@/lib/labels";
import type {
  AIProvider,
  ExamAnalysisInput,
  ExamAnalysisResult,
  ExtractedDocument,
} from "@/lib/ai/types";
import type { DocumentRow } from "@/types/database";

let cachedProvider: AIProvider | null = null;

/**
 * Singleton du provider IA principal. Utilisé par défaut quand
 * analyzeProject() n'en reçoit pas explicitement un (utile pour
 * brancher OpenAI/Claude plus tard ou injecter un mock en test).
 */
export function getDefaultProvider(): AIProvider {
  if (!cachedProvider) {
    cachedProvider = new GeminiProvider();
  }
  return cachedProvider;
}

export interface AnalyzeProjectOk {
  ok: true;
  analysisId: string;
  preparationScore: number;
}

export interface AnalyzeProjectErr {
  ok: false;
  error: string;
}

export type AnalyzeProjectResult = AnalyzeProjectOk | AnalyzeProjectErr;

/**
 * Lance une analyse complète pour un projet de l'utilisateur.
 * - Vérifie l'ownership du projet.
 * - Vérifie qu'il y a assez de documents textes utilisables.
 * - Marque le projet "analyzing" pendant l'appel.
 * - En cas de succès, sauvegarde l'analyse et passe le projet
 *   à "analyzed" avec son preparation_score.
 * - En cas d'échec, repasse le projet à "failed".
 */
export async function analyzeProject(
  userId: string,
  projectId: string,
  provider: AIProvider = getDefaultProvider(),
): Promise<AnalyzeProjectResult> {
  const project = await getUserProject(userId, projectId);
  if (!project) return { ok: false, error: "Projet introuvable." };

  const documents = await listProjectDocuments(userId, projectId);
  if (documents.length === 0) {
    return {
      ok: false,
      error: "Aucun document à analyser. Ajoute au moins un cours.",
    };
  }

  const input = buildInput(project, documents);

  // Vérification basique : il faut au moins du texte exploitable
  const totalChars = countChars(input);
  if (totalChars < 200) {
    return {
      ok: false,
      error:
        "Tes documents ne contiennent pas assez de texte exploitable. Vérifie qu'ils ne sont pas des scans.",
    };
  }

  // Marque le projet en "analyzing" (best effort)
  await updateProjectStatus(userId, projectId, "analyzing");

  let result: ExamAnalysisResult;
  try {
    result = await provider.analyzeExamProject(input);
  } catch (e) {
    console.error("[analyzeProject:provider]", e);
    await updateProjectStatus(userId, projectId, "failed");
    return {
      ok: false,
      error:
        e instanceof Error ? e.message : "L'analyse IA a échoué. Réessaie.",
    };
  }

  // Persistance
  const supabase = createSupabaseServerClient();
  const insertPayload = {
    project_id: projectId,
    user_id: userId,
    global_summary: result.global_summary,
    detected_subject: result.detected_subject,
    exam_strategy: result.exam_strategy,
    preparation_score: result.preparation_score,
    confidence_level: result.confidence_level,
    missing_information: result.missing_information,
    detected_chapters: result.detected_chapters,
    priority_chapters: result.priority_chapters,
    revision_sheets: result.revision_sheets,
    mock_exam: result.mock_exam,
    revision_plan: result.revision_plan,
    next_actions: result.next_actions,
    disclaimer: result.disclaimer,
    raw_ai_response: result as unknown as Record<string, unknown>,
  };

  const { data: rawInsert, error: insertError } = await supabase
    .from("analyses")
    .insert(insertPayload as never)
    .select("id")
    .single();

  if (insertError || !rawInsert) {
    console.error("[analyzeProject:insert]", insertError);
    await updateProjectStatus(userId, projectId, "failed");
    return {
      ok: false,
      error: "Impossible de sauvegarder l'analyse. Réessaie.",
    };
  }
  const analysisId = (rawInsert as { id: string }).id;

  // Update final du projet
  await supabase
    .from("projects")
    .update({
      status: "analyzed",
      preparation_score: result.preparation_score,
    } as never)
    .eq("id", projectId)
    .eq("user_id", userId);

  return {
    ok: true,
    analysisId,
    preparationScore: result.preparation_score,
  };
}

// -----------------------------------------------------
// Helpers internes
// -----------------------------------------------------
function buildInput(
  project: NonNullable<Awaited<ReturnType<typeof getUserProject>>>,
  documents: DocumentRow[],
): ExamAnalysisInput {
  const courseDocuments: ExtractedDocument[] = [];
  const pastExamDocuments: ExtractedDocument[] = [];
  const syllabusDocuments: ExtractedDocument[] = [];

  for (const doc of documents) {
    if (!doc.extracted_text || doc.extracted_text.length < 30) continue;
    const item: ExtractedDocument = {
      fileName: doc.file_name,
      text: doc.extracted_text,
    };
    if (doc.document_category === "course") courseDocuments.push(item);
    else if (doc.document_category === "past_exam")
      pastExamDocuments.push(item);
    else if (doc.document_category === "syllabus")
      syllabusDocuments.push(item);
  }

  return {
    studyLevel: studyLevelLabel(project.study_level),
    subjectName: project.subject_name,
    examType: examTypeLabel(project.exam_type),
    examDate: project.exam_date,
    targetGrade: project.target_grade
      ? targetGradeLabel(project.target_grade)
      : null,
    availableTimePerDay: project.available_time_per_day
      ? availableTimeLabel(project.available_time_per_day)
      : null,
    currentLevel: project.current_level
      ? currentLevelLabel(project.current_level)
      : null,
    courseDocuments,
    pastExamDocuments,
    syllabusDocuments,
  };
}

function countChars(input: ExamAnalysisInput): number {
  return [
    ...input.courseDocuments,
    ...input.pastExamDocuments,
    ...input.syllabusDocuments,
  ].reduce((acc, doc) => acc + doc.text.length, 0);
}

async function updateProjectStatus(
  userId: string,
  projectId: string,
  status: "analyzing" | "analyzed" | "failed",
): Promise<void> {
  const admin = createSupabaseAdminClient();
  await admin
    .from("projects")
    .update({ status } as never)
    .eq("id", projectId)
    .eq("user_id", userId);
}
