// =====================================================
// Helpers documents
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DocumentRow, DocumentCategory } from "@/types/database";
import { removeStorageObjects } from "@/lib/storage";

export interface DocumentCounts {
  course: number;
  past_exam: number;
  syllabus: number;
  total: number;
}

/**
 * Liste les documents d'un projet de l'utilisateur courant.
 * Trie par catégorie puis date pour stabilité d'affichage.
 */
export async function listProjectDocuments(
  userId: string,
  projectId: string,
): Promise<DocumentRow[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .order("document_category", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[listProjectDocuments]", error);
    return [];
  }
  return (data ?? []) as DocumentRow[];
}

export function countByCategory(docs: DocumentRow[]): DocumentCounts {
  const counts: DocumentCounts = {
    course: 0,
    past_exam: 0,
    syllabus: 0,
    total: docs.length,
  };
  for (const d of docs) {
    counts[d.document_category] += 1;
  }
  return counts;
}

/**
 * Vérifie si un projet a assez de documents pour lancer l'analyse :
 * - au moins 1 document de type "course"
 * - au moins 1 document de type "past_exam" OU "syllabus"
 */
export function isReadyForAnalysis(counts: DocumentCounts): {
  ready: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  if (counts.course < 1) {
    reasons.push("Ajoute au moins un document de type Cours.");
  }
  if (counts.past_exam < 1 && counts.syllabus < 1) {
    reasons.push("Ajoute au moins une Annale ou un Syllabus.");
  }
  return { ready: reasons.length === 0, reasons };
}

/**
 * Supprime un document (ligne + fichier Storage).
 */
export async function deleteUserDocument(
  userId: string,
  documentId: string,
): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();

  const { data: rawDoc, error: fetchError } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("user_id", userId)
    .eq("id", documentId)
    .maybeSingle();

  if (fetchError) {
    return { error: "Document introuvable." };
  }

  const doc = rawDoc as { storage_path: string } | null;

  if (doc?.storage_path) {
    await removeStorageObjects([doc.storage_path]);
  }

  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .eq("user_id", userId);

  if (deleteError) {
    return { error: "La suppression du document a échoué." };
  }
  return { error: null };
}

export type { DocumentCategory };
