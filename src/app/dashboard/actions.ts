"use server";

// =====================================================
// Server actions du dashboard
// =====================================================

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { deleteUserProject } from "@/lib/projects";

const projectIdSchema = z.string().uuid("Identifiant de projet invalide.");

export async function deleteProjectAction(projectId: string) {
  const parsed = projectIdSchema.safeParse(projectId);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ID invalide." };
  }

  const user = await requireUser("/dashboard");
  const result = await deleteUserProject(user.id, parsed.data);
  if (result.error) {
    return { error: result.error };
  }

  revalidatePath("/dashboard");
  return { error: null };
}
