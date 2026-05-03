"use server";

// =====================================================
// Server actions : upload / suppression de documents
// =====================================================

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserProject } from "@/lib/projects";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  buildStoragePath,
  DOCUMENTS_BUCKET,
  isAcceptedFile,
  removeStorageObjects,
} from "@/lib/storage";
import {
  countByCategory,
  deleteUserDocument,
  listProjectDocuments,
} from "@/lib/documents";
import { getQuotaSnapshot } from "@/lib/quota";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import { extractTextFromBuffer } from "@/lib/extract";

// -----------------------------------------------------
// Schémas
// -----------------------------------------------------
const uploadSchema = z.object({
  projectId: z.string().uuid("Identifiant de projet invalide."),
  category: z.enum(["course", "past_exam", "syllabus"], {
    errorMap: () => ({ message: "Catégorie invalide." }),
  }),
});

const deleteSchema = z.object({
  documentId: z.string().uuid("Identifiant de document invalide."),
});

// -----------------------------------------------------
// État
// -----------------------------------------------------
export type UploadState = {
  error: string | null;
  success?: string | null;
};

const initialUpload: UploadState = { error: null };
export { initialUpload as initialUploadState };

// -----------------------------------------------------
// Action upload
// -----------------------------------------------------
export async function uploadDocumentAction(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  const user = await requireUser("/dashboard");

  const parsed = uploadSchema.safeParse({
    projectId: formData.get("projectId"),
    category: formData.get("category"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const { projectId, category } = parsed.data;

  // Vérification ownership du projet (RLS le ferait aussi, mais on
  // veut un message d'erreur explicite avant l'upload Storage).
  const project = await getUserProject(user.id, projectId);
  if (!project) {
    return { error: "Ce projet est introuvable ou ne t'appartient pas." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Aucun fichier fourni." };
  }

  // Validation type / taille
  if (!isAcceptedFile(file)) {
    return {
      error: "Format non supporté. Pour le MVP, utilise un PDF ou un TXT.",
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      error: `Fichier trop lourd. La limite est de ${Math.round(
        MAX_FILE_SIZE_BYTES / (1024 * 1024),
      )} MB.`,
    };
  }

  // Quota free : check du nombre total de fichiers du projet
  const [docs, snapshot] = await Promise.all([
    listProjectDocuments(user.id, projectId),
    getQuotaSnapshot(user.id),
  ]);
  if (docs.length >= snapshot.limits.maxFilesPerProject) {
    return {
      error: snapshot.isPremium
        ? `Limite de ${snapshot.limits.maxFilesPerProject} fichiers par projet atteinte.`
        : `Limite gratuite : ${snapshot.limits.maxFilesPerProject} fichiers par projet. Passe Premium pour en ajouter plus.`,
    };
  }

  // Upload Storage
  const supabase = createSupabaseServerClient();
  const storagePath = buildStoragePath(user.id, projectId, file.name);
  const arrayBuffer = await file.arrayBuffer();
  const contentType = (ALLOWED_MIME_TYPES as readonly string[]).includes(
    file.type,
  )
    ? file.type
    : file.name.toLowerCase().endsWith(".pdf")
      ? "application/pdf"
      : "text/plain";

  const { error: uploadError } = await supabase.storage
    .from(DOCUMENTS_BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    console.error("[uploadDocumentAction:storage]", uploadError);
    return { error: "L'upload du fichier a échoué. Réessaie." };
  }

  // Extraction texte (best-effort : ne fait pas échouer l'upload)
  const extracted = await extractTextFromBuffer(
    Buffer.from(arrayBuffer),
    contentType,
    file.name,
  );

  // Insertion DB (cast as never : limitation Postgrest v17)
  const insertPayload = {
    project_id: projectId,
    user_id: user.id,
    file_name: file.name,
    file_type: contentType,
    file_size: file.size,
    document_category: category,
    storage_path: storagePath,
    extracted_text: extracted.hasContent ? extracted.text : null,
  };

  const { error: insertError } = await supabase
    .from("documents")
    .insert(insertPayload as never);

  if (insertError) {
    console.error("[uploadDocumentAction:insert]", insertError);
    // Nettoyage : on retire le fichier orphelin du Storage.
    await removeStorageObjects([storagePath]);
    return { error: "Impossible d'enregistrer le document. Réessaie." };
  }

  revalidatePath(`/dashboard/projects/${projectId}/upload`);

  // Met à jour le statut du projet à "uploading" si besoin (informatif)
  if (project.status === "draft") {
    await supabase
      .from("projects")
      .update({ status: "uploading" } as never)
      .eq("id", projectId)
      .eq("user_id", user.id);
  }

  // Calcul du nouveau résumé pour le message de succès
  const updatedDocs = await listProjectDocuments(user.id, projectId);
  const counts = countByCategory(updatedDocs);
  const label =
    DOCUMENT_CATEGORIES.find((c) => c.value === category)?.label ?? "Document";

  let suffix = "";
  if (extracted.hasContent) {
    suffix =
      extracted.pages > 0
        ? ` · ${extracted.pages} page${extracted.pages > 1 ? "s" : ""} extraites`
        : " · texte extrait";
  } else if (extracted.error) {
    suffix = " · texte non extrait (l'analyse pourra rester partielle)";
  }

  return {
    error: null,
    success: `${label} ajouté (${counts.total} fichier${counts.total > 1 ? "s" : ""} au total)${suffix}.`,
  };
}

// -----------------------------------------------------
// Action suppression
// -----------------------------------------------------
export async function deleteDocumentAction(
  projectId: string,
  documentId: string,
): Promise<{ error: string | null }> {
  const user = await requireUser("/dashboard");

  const parsed = deleteSchema.safeParse({ documentId });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ID invalide." };
  }

  const result = await deleteUserDocument(user.id, parsed.data.documentId);
  if (result.error) return result;

  revalidatePath(`/dashboard/projects/${projectId}/upload`);
  return { error: null };
}
