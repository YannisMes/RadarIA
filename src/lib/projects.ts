// =====================================================
// Helpers projets
// =====================================================

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ProjectRow } from "@/types/database";

export async function listUserProjects(
  userId: string,
): Promise<ProjectRow[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[listUserProjects]", error);
    return [];
  }
  return data ?? [];
}

export async function getUserProject(
  userId: string,
  projectId: string,
): Promise<ProjectRow | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .eq("id", projectId)
    .maybeSingle();

  if (error) {
    console.error("[getUserProject]", error);
    return null;
  }
  return data;
}

/**
 * Supprime un projet ET tous les fichiers Storage associés.
 * Le cascade SQL supprime déjà documents + analyses, mais Supabase
 * Storage n'est pas géré par ON DELETE CASCADE — d'où le nettoyage manuel.
 */
export async function deleteUserProject(
  userId: string,
  projectId: string,
): Promise<{ error: string | null }> {
  const supabase = createSupabaseServerClient();

  // Vérification que le projet appartient bien à l'utilisateur (RLS le ferait
  // aussi, mais on récupère les paths pour le nettoyage Storage).
  const { data: docs, error: docsError } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("user_id", userId)
    .eq("project_id", projectId);

  if (docsError) {
    return { error: "Impossible de lister les fichiers du projet." };
  }

  // Suppression des fichiers Storage (admin client : un seul appel batché).
  if (docs && docs.length > 0) {
    const admin = createSupabaseAdminClient();
    const paths = (docs as { storage_path: string }[]).map(
      (d) => d.storage_path,
    );
    const { error: storageError } = await admin.storage
      .from("documents")
      .remove(paths);
    if (storageError) {
      console.error("[deleteUserProject:storage]", storageError);
      // On continue malgré tout — un orphelin Storage n'est pas bloquant.
    }
  }

  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", userId);

  if (deleteError) {
    return { error: "La suppression du projet a échoué." };
  }
  return { error: null };
}
