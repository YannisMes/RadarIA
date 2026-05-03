// =====================================================
// Types abstraits pour l'analyse IA
// =====================================================
// L'app dépend uniquement de ces types ; les implémentations
// concrètes (Gemini, OpenAI, Claude…) restent interchangeables.

export interface ExamAnalysisInput {
  // Infos étudiant / examen
  studyLevel: string;
  subjectName: string;
  examType: string;
  examDate: string | null;
  targetGrade: string | null;
  availableTimePerDay: string | null;
  currentLevel: string | null;

  // Documents extraits, regroupés par catégorie
  courseDocuments: ExtractedDocument[];
  pastExamDocuments: ExtractedDocument[];
  syllabusDocuments: ExtractedDocument[];
}

export interface ExtractedDocument {
  fileName: string;
  text: string;
}

// -----------------------------------------------------
// Réponse structurée attendue de l'IA
// -----------------------------------------------------
// Schéma exact dans src/lib/ai/schema.ts (Zod) — ces types
// sont sa contrepartie statique, exportée pour usage applicatif.

export type ConfidenceLevel = "low" | "medium" | "high";
export type ImportanceLevel = "low" | "medium" | "high" | "very_high";
export type DifficultyLevel = "easy" | "medium" | "hard" | "realistic";
export type ChapterSource = "course" | "syllabus" | "both" | "inferred";
export type RevisionTaskType =
  | "read_sheet"
  | "quiz"
  | "mock_exam"
  | "correction"
  | "flashcards"
  | "review";

export interface DetectedChapter {
  chapter_name: string;
  source: ChapterSource;
  short_description: string;
}

export interface PriorityChapter {
  rank: number;
  chapter_name: string;
  importance_level: ImportanceLevel;
  importance_score: number;
  estimated_probability: number;
  frequency_in_past_exams: string;
  presence_in_syllabus: boolean;
  presence_in_course: boolean;
  reasoning: string;
  recommended_revision_time: string;
  what_to_master: string[];
  common_traps: string[];
}

export interface KeyDefinition {
  term: string;
  definition: string;
}

export interface RevisionSheet {
  chapter_name: string;
  priority: ImportanceLevel;
  summary: string;
  key_definitions: KeyDefinition[];
  key_concepts: string[];
  examples: string[];
  common_traps: string[];
  must_remember: string[];
}

export interface MockExamQuestion {
  question_number: number;
  question: string;
  related_chapter: string;
  estimated_points: number;
  why_this_question: string;
  expected_answer_plan: string[];
}

export interface GradingRubricItem {
  criterion: string;
  points: number;
  description: string;
}

export interface MockExam {
  title: string;
  estimated_duration: string;
  difficulty: DifficultyLevel;
  exam_type: string;
  instructions: string;
  questions: MockExamQuestion[];
  grading_rubric: GradingRubricItem[];
  correction: string;
}

export interface RevisionTask {
  task_type: RevisionTaskType;
  title: string;
  description: string;
  estimated_time: string;
  related_chapter: string;
}

export interface RevisionDay {
  day: string;
  date: string;
  priority: "low" | "medium" | "high" | "urgent";
  tasks: RevisionTask[];
}

export interface ExamAnalysisResult {
  global_summary: string;
  detected_subject: string;
  exam_strategy: string;
  preparation_score: number;
  confidence_level: ConfidenceLevel;
  missing_information: string[];
  disclaimer: string;
  detected_chapters: DetectedChapter[];
  priority_chapters: PriorityChapter[];
  revision_sheets: RevisionSheet[];
  mock_exam: MockExam;
  revision_plan: RevisionDay[];
  next_actions: string[];
}

// -----------------------------------------------------
// Interface pluggable
// -----------------------------------------------------
export interface AIProvider {
  /**
   * Lance une analyse complète à partir des documents extraits
   * et des informations étudiant. Doit retourner un résultat
   * validé conforme à ExamAnalysisResult.
   */
  analyzeExamProject(input: ExamAnalysisInput): Promise<ExamAnalysisResult>;
}
