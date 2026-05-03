// =====================================================
// Helpers de quota (freemium)
// =====================================================
// Seul source de vérité côté serveur. La table usage_limits
// sert de cache rapide ; on recompte depuis les tables réelles
// pour décider si l'utilisateur peut créer un projet, uploader
// un fichier ou lancer une analyse.

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { FREE_LIMITS, PREMIUM_LIMITS } from "@/lib/constants";
import { getUserContext } from "@/lib/profile";
import type { UsageLimitsRow } from "@/types/database";

export interface PlanLimits {
  maxProjects: number;
  maxFilesPerProject: number;
  maxAnalyses: number;
}

export interface QuotaSnapshot {
  isPremium: boolean;
  limits: PlanLimits;
  projectsCount: number;
  analysesCount: number;
}

export async function getQuotaSnapshot(
  userId: string,
): Promise<QuotaSnapshot> {
  const supabase = createSupabaseServerClient();
  const ctx = await getUserContext(userId);

  const [{ count: projectsCount }, { count: analysesCount }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("analyses")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

  return {
    isPremium: ctx.isPremium,
    limits: ctx.isPremium ? PREMIUM_LIMITS : FREE_LIMITS,
    projectsCount: projectsCount ?? 0,
    analysesCount: analysesCount ?? 0,
  };
}

export async function canCreateProject(userId: string): Promise<{
  allowed: boolean;
  snapshot: QuotaSnapshot;
}> {
  const snapshot = await getQuotaSnapshot(userId);
  return {
    allowed: snapshot.projectsCount < snapshot.limits.maxProjects,
    snapshot,
  };
}

export async function canRunAnalysis(userId: string): Promise<{
  allowed: boolean;
  snapshot: QuotaSnapshot;
}> {
  const snapshot = await getQuotaSnapshot(userId);
  return {
    allowed: snapshot.analysesCount < snapshot.limits.maxAnalyses,
    snapshot,
  };
}

/**
 * Met à jour la table usage_limits (admin) pour un utilisateur.
 * Le compteur réel reste calculé via getQuotaSnapshot(), mais on
 * garde usage_limits à jour pour des affichages/analytics rapides.
 */
export async function bumpUsageLimits(
  userId: string,
  delta: Partial<{
    projects: number;
    analyses: number;
    files: number;
  }>,
): Promise<void> {
  const admin = createSupabaseAdminClient();
  const { data: rawCurrent } = await admin
    .from("usage_limits")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const current = rawCurrent as UsageLimitsRow | null;

  const next = {
    user_id: userId,
    projects_count: (current?.projects_count ?? 0) + (delta.projects ?? 0),
    analyses_count: (current?.analyses_count ?? 0) + (delta.analyses ?? 0),
    files_uploaded_count:
      (current?.files_uploaded_count ?? 0) + (delta.files ?? 0),
  };

  // Cast `as never` requis : les types Insert générés par Postgrest v17
  // pour notre Database custom narrowent à `never` malgré la forme correcte
  // de l'objet. La validation runtime reste assurée par les contraintes SQL.
  await admin
    .from("usage_limits")
    .upsert(next as never, { onConflict: "user_id" });
}
