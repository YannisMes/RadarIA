"use server";

// =====================================================
// Server actions : création de projet
// =====================================================

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canCreateProject, bumpUsageLimits } from "@/lib/quota";
import {
  STUDY_LEVELS,
  EXAM_TYPES,
  CURRENT_LEVELS,
  TARGET_GRADES,
  AVAILABLE_TIMES,
} from "@/lib/constants";

// -----------------------------------------------------
// Helpers
// -----------------------------------------------------
function pick(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function valuesOf<T extends { value: string }>(
  list: readonly T[],
): [T["value"], ...T["value"][]] {
  // Zod enum exige au moins une valeur
  return list.map((i) => i.value) as [T["value"], ...T["value"][]];
}

const createSchema = z.object({
  subject_name: z
    .string()
    .min(2, "Le nom de la matière est trop court.")
    .max(100, "Le nom de la matière est trop long."),
  study_level: z.enum(valuesOf(STUDY_LEVELS), {
    errorMap: () => ({ message: "Sélectionne un niveau d'étude." }),
  }),
  exam_type: z.enum(valuesOf(EXAM_TYPES), {
    errorMap: () => ({ message: "Sélectionne un type d'examen." }),
  }),
  exam_date: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null))
    .refine(
      (v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v),
      "Date invalide.",
    ),
  target_grade: z
    .enum(valuesOf(TARGET_GRADES))
    .optional()
    .or(z.literal("").transform(() => undefined)),
  available_time_per_day: z
    .enum(valuesOf(AVAILABLE_TIMES))
    .optional()
    .or(z.literal("").transform(() => undefined)),
  current_level: z
    .enum(valuesOf(CURRENT_LEVELS))
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type CreateProjectState = {
  error: string | null;
  fieldErrors?: Partial<Record<keyof z.infer<typeof createSchema>, string>>;
};

const initial: CreateProjectState = { error: null };
export { initial as initialCreateProjectState };

// -----------------------------------------------------
// Action
// -----------------------------------------------------
export async function createProjectAction(
  _prev: CreateProjectState,
  form: FormData,
): Promise<CreateProjectState> {
  const user = await requireUser("/dashboard/new");

  const parsed = createSchema.safeParse({
    subject_name: pick(form, "subject_name"),
    study_level: pick(form, "study_level"),
    exam_type: pick(form, "exam_type"),
    exam_date: pick(form, "exam_date"),
    target_grade: pick(form, "target_grade"),
    available_time_per_day: pick(form, "available_time_per_day"),
    current_level: pick(form, "current_level"),
  });

  if (!parsed.success) {
    const fieldErrors: CreateProjectState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof createSchema>;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      error: "Vérifie les informations saisies.",
      fieldErrors,
    };
  }

  // Quota check (côté serveur, source de vérité)
  const { allowed, snapshot } = await canCreateProject(user.id);
  if (!allowed) {
    return {
      error: snapshot.isPremium
        ? "Tu as atteint la limite de projets de ton plan."
        : "Limite gratuite atteinte (1 projet). Passe Premium pour en créer plus.",
    };
  }

  const supabase = createSupabaseServerClient();
  const insertPayload = {
    user_id: user.id,
    subject_name: parsed.data.subject_name,
    study_level: parsed.data.study_level,
    exam_type: parsed.data.exam_type,
    exam_date: parsed.data.exam_date,
    target_grade: parsed.data.target_grade ?? null,
    available_time_per_day: parsed.data.available_time_per_day ?? null,
    current_level: parsed.data.current_level ?? null,
    status: "draft" as const,
  };

  // Cast `as never` : limitation des types Insert Postgrest v17.
  const { data: rawData, error } = await supabase
    .from("projects")
    .insert(insertPayload as never)
    .select("id")
    .single();

  const data = rawData as { id: string } | null;

  if (error || !data) {
    console.error("[createProjectAction]", error);
    return {
      error: "Impossible de créer le projet pour le moment. Réessaie.",
    };
  }

  await bumpUsageLimits(user.id, { projects: 1 });
  revalidatePath("/dashboard");
  redirect(`/dashboard/projects/${data.id}/upload`);
}
