// =====================================================
// Helpers Supabase Storage
// =====================================================

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const DOCUMENTS_BUCKET = "documents";
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
export const ALLOWED_MIME_TYPES = ["application/pdf", "text/plain"] as const;
export const ALLOWED_EXTENSIONS = [".pdf", ".txt"] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

/**
 * Vérifie qu'un MIME type est accepté pour le MVP.
 * On accepte aussi un fallback par extension pour les cas où
 * le navigateur ne fournit pas le bon Content-Type.
 */
export function isAcceptedFile(file: { type: string; name: string }): boolean {
  if ((ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
    return true;
  }
  const lower = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

/**
 * Slugifie un nom de fichier pour éviter les caractères problématiques
 * dans Storage. Conserve la casse de base et l'extension.
 */
export function sanitizeFileName(name: string): string {
  // Retire les diacritiques.
  const noDiacritics = name.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  // Remplace les caractères non sûrs par "-", garde lettres / chiffres / . _ -
  const safe = noDiacritics.replace(/[^a-zA-Z0-9._-]+/g, "-");
  // Trim des "-" en début/fin.
  return safe.replace(/^-+|-+$/g, "").slice(0, 120) || "fichier";
}

/**
 * Construit le chemin Storage normalisé pour un fichier.
 * Conforme aux RLS policies : premier segment = user_id.
 */
export function buildStoragePath(
  userId: string,
  projectId: string,
  fileName: string,
): string {
  const safeName = sanitizeFileName(fileName);
  const stamp = Date.now();
  return `${userId}/${projectId}/${stamp}-${safeName}`;
}

/**
 * Supprime un ou plusieurs objets Storage côté admin.
 * Tolère les erreurs silencieusement (cleanup best-effort).
 */
export async function removeStorageObjects(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const admin = createSupabaseAdminClient();
  const { error } = await admin.storage.from(DOCUMENTS_BUCKET).remove(paths);
  if (error) {
    console.error("[removeStorageObjects]", error);
  }
}
