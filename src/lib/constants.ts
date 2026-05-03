// =====================================================
// Constantes globales RadarIA
// =====================================================

export const APP_NAME = "RadarIA";
export const APP_TAGLINE = "Révise les bons chapitres, pas tout le cours.";

export const STUDY_LEVELS = [
  { value: "lycee", label: "Lycée" },
  { value: "bts", label: "BTS" },
  { value: "but", label: "BUT" },
  { value: "licence", label: "Licence" },
  { value: "master", label: "Master" },
  { value: "droit", label: "Droit" },
  { value: "medecine", label: "Médecine" },
  { value: "ecole_ingenieur", label: "École d'ingénieur" },
  { value: "ecole_commerce", label: "École de commerce" },
  { value: "autre", label: "Autre" },
] as const;

export const EXAM_TYPES = [
  { value: "qcm", label: "QCM" },
  { value: "dissertation", label: "Dissertation" },
  { value: "cas_pratique", label: "Cas pratique" },
  { value: "questions_cours", label: "Questions de cours" },
  { value: "oral", label: "Oral" },
  { value: "mixte", label: "Mixte" },
] as const;

export const CURRENT_LEVELS = [
  { value: "faible", label: "Faible" },
  { value: "moyen", label: "Moyen" },
  { value: "bon", label: "Bon" },
  { value: "tres_bon", label: "Très bon" },
] as const;

export const DOCUMENT_CATEGORIES = [
  { value: "course", label: "Cours" },
  { value: "past_exam", label: "Annales" },
  { value: "syllabus", label: "Syllabus" },
] as const;

export const TARGET_GRADES = [
  { value: "passer", label: "Passer (≥ 10/20)" },
  { value: "bien", label: "Bien (12-13/20)" },
  { value: "tres_bien", label: "Très bien (14-15/20)" },
  { value: "mention", label: "Mention (16+/20)" },
] as const;

export const AVAILABLE_TIMES = [
  { value: "30min", label: "Moins de 1 h" },
  { value: "1h", label: "Environ 1 h" },
  { value: "2h", label: "Environ 2 h" },
  { value: "3h", label: "Environ 3 h" },
  { value: "4h_plus", label: "4 h ou plus" },
] as const;

export type StudyLevel = (typeof STUDY_LEVELS)[number]["value"];
export type ExamType = (typeof EXAM_TYPES)[number]["value"];
export type CurrentLevel = (typeof CURRENT_LEVELS)[number]["value"];
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]["value"];
export type TargetGrade = (typeof TARGET_GRADES)[number]["value"];
export type AvailableTime = (typeof AVAILABLE_TIMES)[number]["value"];

// -----------------------------------------------------
// Limites freemium
// -----------------------------------------------------
export const FREE_LIMITS = {
  maxProjects: 1,
  maxFilesPerProject: 3,
  maxAnalyses: 1,
} as const;

export const PREMIUM_LIMITS = {
  maxProjects: 50,
  maxFilesPerProject: 25,
  maxAnalyses: 100,
} as const;

// -----------------------------------------------------
// Disclaimer juridique réutilisable
// -----------------------------------------------------
export const DEFAULT_DISCLAIMER =
  "Ces estimations sont basées uniquement sur les documents fournis et ne garantissent pas les sujets réels de l'examen.";
