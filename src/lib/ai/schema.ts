// =====================================================
// Schémas Zod pour valider la réponse de l'IA
// =====================================================
// On reste relativement permissif sur les longueurs (les
// LLMs varient) mais strict sur la structure et les enums.

import { z } from "zod";

const importanceLevel = z.enum(["low", "medium", "high", "very_high"]);
const difficultyLevel = z.enum(["easy", "medium", "hard", "realistic"]);
const confidenceLevel = z.enum(["low", "medium", "high"]);
const chapterSource = z.enum(["course", "syllabus", "both", "inferred"]);
const taskType = z.enum([
  "read_sheet",
  "quiz",
  "mock_exam",
  "correction",
  "flashcards",
  "review",
]);
const dayPriority = z.enum(["low", "medium", "high", "urgent"]);

// -----------------------------------------------------
// Coercions tolérantes
// -----------------------------------------------------
// Certaines réponses Gemini peuvent renvoyer des nombres en string
// ou des tableaux manquants. On les normalise plutôt que de rejeter.

const tolerantNumber = z.preprocess((v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace("%", "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}, z.number().min(0).max(100));

const tolerantInt = z.preprocess((v) => {
  if (typeof v === "number") return Math.round(v);
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? Math.round(n) : 0;
  }
  return 0;
}, z.number().int());

const tolerantStringArray = z.preprocess((v) => {
  if (Array.isArray(v)) return v.map((x) => String(x ?? "")).filter(Boolean);
  if (typeof v === "string" && v.trim() !== "") return [v];
  return [];
}, z.array(z.string()));

const tolerantBool = z.preprocess((v) => {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const lower = v.toLowerCase();
    if (["oui", "yes", "true", "1"].includes(lower)) return true;
    if (["non", "no", "false", "0"].includes(lower)) return false;
  }
  return false;
}, z.boolean());

// -----------------------------------------------------
// Sous-schémas
// -----------------------------------------------------
const detectedChapter = z.object({
  chapter_name: z.string().min(1),
  source: chapterSource.catch("inferred"),
  short_description: z.string().default(""),
});

const priorityChapter = z.object({
  rank: tolerantInt.default(0),
  chapter_name: z.string().min(1),
  importance_level: importanceLevel.catch("medium"),
  importance_score: tolerantNumber.default(0),
  estimated_probability: tolerantNumber.default(0),
  frequency_in_past_exams: z.string().default(""),
  presence_in_syllabus: tolerantBool.default(false),
  presence_in_course: tolerantBool.default(false),
  reasoning: z.string().default(""),
  recommended_revision_time: z.string().default(""),
  what_to_master: tolerantStringArray.default([]),
  common_traps: tolerantStringArray.default([]),
});

const keyDefinition = z.object({
  term: z.string().default(""),
  definition: z.string().default(""),
});

const revisionSheet = z.object({
  chapter_name: z.string().min(1),
  priority: importanceLevel.catch("medium"),
  summary: z.string().default(""),
  key_definitions: z.array(keyDefinition).default([]),
  key_concepts: tolerantStringArray.default([]),
  examples: tolerantStringArray.default([]),
  common_traps: tolerantStringArray.default([]),
  must_remember: tolerantStringArray.default([]),
});

const mockExamQuestion = z.object({
  question_number: tolerantInt.default(1),
  question: z.string().min(1),
  related_chapter: z.string().default(""),
  estimated_points: tolerantNumber.default(0),
  why_this_question: z.string().default(""),
  expected_answer_plan: tolerantStringArray.default([]),
});

const gradingRubricItem = z.object({
  criterion: z.string().default(""),
  points: tolerantNumber.default(0),
  description: z.string().default(""),
});

const mockExam = z.object({
  title: z.string().default("Examen blanc"),
  estimated_duration: z.string().default(""),
  difficulty: difficultyLevel.catch("realistic"),
  exam_type: z.string().default(""),
  instructions: z.string().default(""),
  questions: z.array(mockExamQuestion).default([]),
  grading_rubric: z.array(gradingRubricItem).default([]),
  correction: z.string().default(""),
});

const revisionTask = z.object({
  task_type: taskType.catch("review"),
  title: z.string().default(""),
  description: z.string().default(""),
  estimated_time: z.string().default(""),
  related_chapter: z.string().default(""),
});

const revisionDay = z.object({
  day: z.string().default(""),
  date: z.string().default(""),
  priority: dayPriority.catch("medium"),
  tasks: z.array(revisionTask).default([]),
});

// -----------------------------------------------------
// Schéma racine
// -----------------------------------------------------
export const examAnalysisSchema = z.object({
  global_summary: z.string().default(""),
  detected_subject: z.string().default(""),
  exam_strategy: z.string().default(""),
  preparation_score: tolerantNumber.default(0),
  confidence_level: confidenceLevel.catch("medium"),
  missing_information: tolerantStringArray.default([]),
  disclaimer: z
    .string()
    .default(
      "Ces estimations sont basées uniquement sur les documents fournis et ne garantissent pas les sujets réels de l'examen.",
    ),
  detected_chapters: z.array(detectedChapter).default([]),
  priority_chapters: z.array(priorityChapter).default([]),
  revision_sheets: z.array(revisionSheet).default([]),
  mock_exam: mockExam.default({
    title: "Examen blanc",
    estimated_duration: "",
    difficulty: "realistic",
    exam_type: "",
    instructions: "",
    questions: [],
    grading_rubric: [],
    correction: "",
  }),
  revision_plan: z.array(revisionDay).default([]),
  next_actions: tolerantStringArray.default([]),
});

export type ExamAnalysisParsed = z.infer<typeof examAnalysisSchema>;
