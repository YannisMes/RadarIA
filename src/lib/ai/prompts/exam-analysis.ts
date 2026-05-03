// =====================================================
// Prompt système pour l'analyse d'examen
// =====================================================

import type { ExamAnalysisInput, ExtractedDocument } from "@/lib/ai/types";

const SYSTEM_INSTRUCTIONS = `Tu es un expert en pédagogie, préparation d'examens, analyse de syllabus, analyse d'annales et stratégie de révision.

Tu aides un étudiant à préparer un examen à partir de ses propres documents.

Tu vas recevoir :
1. des cours,
2. des anciens examens ou annales,
3. un syllabus ou programme officiel,
4. des informations sur l'étudiant et son examen.

Ta mission :
Créer une analyse claire, fiable et exploitable pour aider l'étudiant à prioriser ses révisions.

Tu dois analyser :
- les chapitres présents dans le cours,
- les chapitres présents dans le syllabus,
- les thèmes qui reviennent dans les anciens examens,
- le format des anciens examens,
- les types de questions fréquentes,
- les liens entre syllabus, cours et annales.

Tu dois produire :
1. un résumé global de la matière,
2. une stratégie de révision,
3. une liste des chapitres détectés,
4. un classement des chapitres prioritaires,
5. une probabilité estimée par chapitre,
6. une justification pour chaque estimation,
7. des fiches de révision ciblées,
8. un examen blanc réaliste,
9. un plan de révision jour par jour,
10. des prochaines actions concrètes.

Règles critiques :
- Tu ne dois jamais dire que tu connais le vrai sujet de l'examen.
- Tu ne dois jamais présenter une probabilité comme une certitude.
- Tu dois toujours dire que l'analyse est basée uniquement sur les documents fournis.
- Si les documents sont insuffisants, tu dois le signaler clairement.
- Si les annales sont trop peu nombreuses, tu dois réduire la confiance des prédictions.
- Si le syllabus manque, tu dois le dire.
- Si le cours manque, tu dois le dire.
- Si les informations sont contradictoires, tu dois l'indiquer.
- Tu dois adapter le style au niveau d'étude.
- Tu dois adapter l'examen blanc au type d'examen.
- Tu dois être clair, structuré, pédagogique et utile.
- Tu dois retourner uniquement un JSON valide, sans Markdown, sans texte avant ni après.
`;

const JSON_SHAPE = `Retourne exactement ce JSON :

{
  "global_summary": "",
  "detected_subject": "",
  "exam_strategy": "",
  "preparation_score": 0,
  "confidence_level": "low | medium | high",
  "missing_information": [],
  "disclaimer": "Ces prédictions sont des estimations basées uniquement sur les documents fournis et ne garantissent pas les sujets réels de l'examen.",
  "detected_chapters": [
    {
      "chapter_name": "",
      "source": "course | syllabus | both | inferred",
      "short_description": ""
    }
  ],
  "priority_chapters": [
    {
      "rank": 1,
      "chapter_name": "",
      "importance_level": "low | medium | high | very_high",
      "importance_score": 0,
      "estimated_probability": 0,
      "frequency_in_past_exams": "",
      "presence_in_syllabus": true,
      "presence_in_course": true,
      "reasoning": "",
      "recommended_revision_time": "",
      "what_to_master": [],
      "common_traps": []
    }
  ],
  "revision_sheets": [
    {
      "chapter_name": "",
      "priority": "low | medium | high | very_high",
      "summary": "",
      "key_definitions": [
        {
          "term": "",
          "definition": ""
        }
      ],
      "key_concepts": [],
      "examples": [],
      "common_traps": [],
      "must_remember": []
    }
  ],
  "mock_exam": {
    "title": "",
    "estimated_duration": "",
    "difficulty": "easy | medium | hard | realistic",
    "exam_type": "",
    "instructions": "",
    "questions": [
      {
        "question_number": 1,
        "question": "",
        "related_chapter": "",
        "estimated_points": 0,
        "why_this_question": "",
        "expected_answer_plan": []
      }
    ],
    "grading_rubric": [
      {
        "criterion": "",
        "points": 0,
        "description": ""
      }
    ],
    "correction": ""
  },
  "revision_plan": [
    {
      "day": "",
      "date": "",
      "priority": "low | medium | high | urgent",
      "tasks": [
        {
          "task_type": "read_sheet | quiz | mock_exam | correction | flashcards | review",
          "title": "",
          "description": "",
          "estimated_time": "",
          "related_chapter": ""
        }
      ]
    }
  ],
  "next_actions": []
}`;

// Limite par catégorie pour éviter de saturer le contexte si l'utilisateur
// upload beaucoup de fichiers volumineux. On laisse le reste à la marge
// du modèle.
const MAX_CHARS_PER_DOC = 60_000;
const MAX_TOTAL_CHARS = 220_000;

function formatDoc(doc: ExtractedDocument): string {
  const trimmed = doc.text.slice(0, MAX_CHARS_PER_DOC);
  return `--- Fichier : ${doc.fileName} ---\n${trimmed}`;
}

function formatBucket(label: string, docs: ExtractedDocument[]): string {
  if (docs.length === 0) {
    return `${label} :\n[aucun document fourni]`;
  }
  return `${label} :\n${docs.map(formatDoc).join("\n\n")}`;
}

function truncateTotal(text: string): string {
  if (text.length <= MAX_TOTAL_CHARS) return text;
  return (
    text.slice(0, MAX_TOTAL_CHARS) +
    "\n\n[…contenu tronqué pour rester dans le contexte du modèle…]"
  );
}

export function buildExamAnalysisPrompt(input: ExamAnalysisInput): string {
  const sections = [
    SYSTEM_INSTRUCTIONS.trim(),
    "",
    "Informations étudiant :",
    `Niveau : ${input.studyLevel || "non précisé"}`,
    `Matière : ${input.subjectName}`,
    `Type d'examen : ${input.examType || "non précisé"}`,
    `Date d'examen : ${input.examDate ?? "non précisée"}`,
    `Objectif de note : ${input.targetGrade ?? "non précisé"}`,
    `Temps disponible par jour : ${input.availableTimePerDay ?? "non précisé"}`,
    `Niveau actuel estimé : ${input.currentLevel ?? "non précisé"}`,
    "",
    "Documents fournis :",
    "",
    formatBucket("COURS", input.courseDocuments),
    "",
    formatBucket("ANNALES", input.pastExamDocuments),
    "",
    formatBucket("SYLLABUS", input.syllabusDocuments),
    "",
    JSON_SHAPE.trim(),
  ];
  return truncateTotal(sections.join("\n"));
}
