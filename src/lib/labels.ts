// =====================================================
// Mapping value -> label (pour les selects)
// =====================================================

import {
  STUDY_LEVELS,
  EXAM_TYPES,
  CURRENT_LEVELS,
  DOCUMENT_CATEGORIES,
} from "@/lib/constants";
import type { ProjectStatus } from "@/types/database";

function buildLookup<T extends { value: string; label: string }>(
  list: readonly T[],
): Record<string, string> {
  return Object.fromEntries(list.map((item) => [item.value, item.label]));
}

const studyLevelLabels = buildLookup(STUDY_LEVELS);
const examTypeLabels = buildLookup(EXAM_TYPES);
const currentLevelLabels = buildLookup(CURRENT_LEVELS);
const documentCategoryLabels = buildLookup(DOCUMENT_CATEGORIES);

export function studyLevelLabel(value?: string | null): string {
  if (!value) return "—";
  return studyLevelLabels[value] ?? value;
}
export function examTypeLabel(value?: string | null): string {
  if (!value) return "—";
  return examTypeLabels[value] ?? value;
}
export function currentLevelLabel(value?: string | null): string {
  if (!value) return "—";
  return currentLevelLabels[value] ?? value;
}
export function documentCategoryLabel(value?: string | null): string {
  if (!value) return "—";
  return documentCategoryLabels[value] ?? value;
}

// -----------------------------------------------------
// Statut projet
// -----------------------------------------------------
export const projectStatusLabels: Record<ProjectStatus, string> = {
  draft: "Brouillon",
  uploading: "Upload en cours",
  analyzing: "Analyse en cours",
  analyzed: "Analyse prête",
  failed: "Échec",
};

export function projectStatusLabel(status: ProjectStatus): string {
  return projectStatusLabels[status] ?? status;
}
