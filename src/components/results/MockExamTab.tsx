"use client";

import { useState } from "react";
import {
  ChevronDown,
  ClipboardCheck,
  FileText,
  Sparkles,
  Timer,
} from "lucide-react";
import type { ExamAnalysisResult } from "@/lib/ai/types";
import { PaywallNotice } from "@/components/results/PaywallNotice";
import { DisclaimerBox } from "@/components/ui/DisclaimerBox";
import { cn } from "@/lib/utils";

interface MockExamTabProps {
  analysis: ExamAnalysisResult;
  isPremium: boolean;
}

const DIFFICULTY_LABELS = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
  realistic: "Réaliste",
} as const;

const FREE_QUESTIONS_VISIBLE = 1;

export function MockExamTab({ analysis, isPremium }: MockExamTabProps) {
  const exam = analysis.mock_exam;
  if (!exam || exam.questions.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-100">
        <p className="text-sm text-slate-600">
          Aucun examen blanc disponible. Relance l'analyse si besoin.
        </p>
      </div>
    );
  }

  const totalPoints = exam.questions.reduce(
    (acc, q) => acc + (q.estimated_points ?? 0),
    0,
  );
  const visibleQuestions = isPremium
    ? exam.questions
    : exam.questions.slice(0, FREE_QUESTIONS_VISIBLE);
  const hiddenCount = isPremium
    ? 0
    : Math.max(0, exam.questions.length - FREE_QUESTIONS_VISIBLE);

  return (
    <div className="space-y-6">
      {/* En-tête examen */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-6 ring-1 ring-brand-100 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-brand-700">
              Examen blanc probable
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {exam.title || "Examen blanc"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {exam.estimated_duration && (
              <Pill icon={Timer}>{exam.estimated_duration}</Pill>
            )}
            <Pill icon={Sparkles}>{DIFFICULTY_LABELS[exam.difficulty]}</Pill>
            {totalPoints > 0 && (
              <Pill icon={ClipboardCheck}>{totalPoints} points</Pill>
            )}
          </div>
        </div>

        {exam.instructions && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {exam.instructions}
          </p>
        )}
      </div>

      {/* Questions */}
      <ol className="space-y-4">
        {visibleQuestions.map((q) => (
          <li
            key={q.question_number}
            className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  Question {q.question_number}
                  {q.related_chapter && (
                    <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-brand-700">
                      {q.related_chapter}
                    </span>
                  )}
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-900">
                  {q.question}
                </p>
              </div>
              {q.estimated_points > 0 && (
                <span className="shrink-0 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {q.estimated_points} pts
                </span>
              )}
            </div>

            {q.why_this_question && (
              <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">
                  Pourquoi :
                </span>{" "}
                {q.why_this_question}
              </p>
            )}

            {q.expected_answer_plan.length > 0 && (
              <details className="mt-3 group">
                <summary className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800">
                  <ChevronDown
                    className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                  Plan de réponse attendu
                </summary>
                <ul className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
                  {q.expected_answer_plan.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </details>
            )}
          </li>
        ))}
      </ol>

      {hiddenCount > 0 && (
        <PaywallNotice
          title={`${hiddenCount} question${hiddenCount > 1 ? "s" : ""} verrouillée${hiddenCount > 1 ? "s" : ""}`}
          description="L'examen blanc complet, le barème détaillé et la correction sont disponibles avec le Pack Examen ou Premium."
        />
      )}

      {/* Barème + correction (Premium) */}
      {isPremium && exam.grading_rubric.length > 0 && (
        <CollapsibleCard
          icon={ClipboardCheck}
          title="Barème"
          defaultOpen={false}
        >
          <ul className="divide-y divide-slate-100">
            {exam.grading_rubric.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between gap-3 py-2 text-sm"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.criterion}
                  </p>
                  {item.description && (
                    <p className="text-slate-600">{item.description}</p>
                  )}
                </div>
                <span className="shrink-0 rounded-lg bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                  {item.points} pts
                </span>
              </li>
            ))}
          </ul>
        </CollapsibleCard>
      )}

      {isPremium && exam.correction && (
        <CollapsibleCard
          icon={FileText}
          title="Correction proposée"
          defaultOpen={false}
        >
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {exam.correction}
          </p>
        </CollapsibleCard>
      )}

      <DisclaimerBox>{analysis.disclaimer}</DisclaimerBox>
    </div>
  );
}

function Pill({
  icon: Icon,
  children,
}: {
  icon: typeof Timer;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {children}
    </span>
  );
}

function CollapsibleCard({
  icon: Icon,
  title,
  children,
  defaultOpen,
}: {
  icon: typeof Timer;
  title: string;
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-2xl bg-white ring-1 ring-slate-100 shadow-soft">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold text-slate-900">
            {title}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-slate-400 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open && <div className="border-t border-slate-100 p-5">{children}</div>}
    </section>
  );
}
