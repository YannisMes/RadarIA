// =====================================================
// Implémentation Gemini de l'AIProvider
// =====================================================

import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { serverEnv } from "@/lib/env";
import { buildExamAnalysisPrompt } from "@/lib/ai/prompts/exam-analysis";
import { examAnalysisSchema } from "@/lib/ai/schema";
import { DEFAULT_DISCLAIMER } from "@/lib/constants";
import type {
  AIProvider,
  ExamAnalysisInput,
  ExamAnalysisResult,
} from "@/lib/ai/types";

const DEFAULT_MODEL = "gemini-2.5-flash";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  private modelName: string;

  constructor(opts?: { apiKey?: string; model?: string }) {
    const apiKey = opts?.apiKey ?? serverEnv.geminiApiKey;
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName =
      opts?.model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  }

  async analyzeExamProject(
    input: ExamAnalysisInput,
  ): Promise<ExamAnalysisResult> {
    const prompt = buildExamAnalysisPrompt(input);

    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        // Force la sortie en JSON pour faciliter le parsing.
        responseMimeType: "application/json",
        temperature: 0.4,
        maxOutputTokens: 8192,
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = safeParseJson(text);
    if (!parsed) {
      throw new Error(
        "Réponse Gemini illisible : impossible de parser le JSON.",
      );
    }

    const validation = examAnalysisSchema.safeParse(parsed);
    if (!validation.success) {
      console.error(
        "[GeminiProvider] schéma invalide :",
        validation.error.issues.slice(0, 5),
      );
      throw new Error(
        "Réponse Gemini ne respecte pas le schéma attendu. Réessaie.",
      );
    }

    // Garde-fous post-validation : disclaimer + clamps
    const data = validation.data;
    return {
      ...data,
      disclaimer: data.disclaimer?.trim() || DEFAULT_DISCLAIMER,
      preparation_score: clamp(Math.round(data.preparation_score), 0, 100),
      priority_chapters: data.priority_chapters
        .map((c, idx) => ({
          ...c,
          rank: c.rank > 0 ? c.rank : idx + 1,
          importance_score: clamp(Math.round(c.importance_score), 0, 100),
          estimated_probability: clamp(
            Math.round(c.estimated_probability),
            0,
            100,
          ),
        }))
        .sort((a, b) => a.rank - b.rank),
    };
  }
}

function safeParseJson(text: string): unknown {
  if (!text) return null;
  // Tentative directe.
  try {
    return JSON.parse(text);
  } catch {
    // Si Gemini a malgré tout entouré le JSON de Markdown ```json … ```,
    // on extrait le bloc.
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenceMatch?.[1]) {
      try {
        return JSON.parse(fenceMatch[1]);
      } catch {
        /* fall through */
      }
    }
    // Dernier essai : attraper le premier "{ … }" de premier niveau.
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        /* */
      }
    }
    return null;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
