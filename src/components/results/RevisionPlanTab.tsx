import {
  BookOpen,
  Clock,
  FileText,
  GraduationCap,
  ListChecks,
  ScrollText,
  Sparkles,
} from "lucide-react";
import type { ExamAnalysisResult, RevisionTask } from "@/lib/ai/types";
import { PaywallNotice } from "@/components/results/PaywallNotice";
import { cn } from "@/lib/utils";

interface RevisionPlanTabProps {
  analysis: ExamAnalysisResult;
  isPremium: boolean;
}

const FREE_DAYS_VISIBLE = 2;

const TASK_ICON: Record<string, typeof BookOpen> = {
  read_sheet: BookOpen,
  quiz: Sparkles,
  mock_exam: ScrollText,
  correction: FileText,
  flashcards: GraduationCap,
  review: ListChecks,
};

const PRIORITY_STYLE: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-brand-100 text-brand-700",
  high: "bg-accent-100 text-accent-700",
  urgent: "bg-urgent-100 text-urgent-700",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "Faible",
  medium: "Moyenne",
  high: "Haute",
  urgent: "Urgente",
};

export function RevisionPlanTab({
  analysis,
  isPremium,
}: RevisionPlanTabProps) {
  const days = analysis.revision_plan;
  if (days.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-100">
        <p className="text-sm text-slate-600">
          Aucun planning généré. Relance l'analyse si besoin.
        </p>
      </div>
    );
  }

  const visibleDays = isPremium ? days : days.slice(0, FREE_DAYS_VISIBLE);
  const hidden = isPremium ? 0 : Math.max(0, days.length - FREE_DAYS_VISIBLE);

  return (
    <div className="space-y-6">
      <ol className="space-y-4">
        {visibleDays.map((d, idx) => {
          const totalTasks = d.tasks.length;
          return (
            <li
              key={`${d.day}-${idx}`}
              className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-soft"
            >
              <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                    {d.day || `Jour ${idx + 1}`}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-slate-900">
                    {d.date || "Date à définir"}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">
                    {totalTasks} tâche{totalTasks > 1 ? "s" : ""}
                  </span>
                  <span
                    className={cn(
                      "badge",
                      PRIORITY_STYLE[d.priority] ?? PRIORITY_STYLE.medium,
                    )}
                  >
                    {PRIORITY_LABEL[d.priority] ?? "Moyenne"}
                  </span>
                </div>
              </header>

              {d.tasks.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {d.tasks.map((task, tidx) => (
                    <TaskRow key={tidx} task={task} />
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">Pause / révision libre.</p>
              )}
            </li>
          );
        })}
      </ol>

      {hidden > 0 && (
        <PaywallNotice
          title={`${hidden} jour${hidden > 1 ? "s" : ""} de planning verrouillé${hidden > 1 ? "s" : ""}`}
          description={`Le plan jour-par-jour complet est disponible en Premium ou avec le Pack Examen.`}
        />
      )}
    </div>
  );
}

function TaskRow({ task }: { task: RevisionTask }) {
  const Icon = TASK_ICON[task.task_type] ?? ListChecks;
  return (
    <li className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 ring-1 ring-brand-100">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-slate-900">
            {task.title || labelForType(task.task_type)}
          </p>
          {task.estimated_time && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {task.estimated_time}
            </span>
          )}
        </div>
        {task.description && (
          <p className="mt-0.5 text-sm text-slate-600">{task.description}</p>
        )}
        {task.related_chapter && (
          <p className="mt-1 text-xs font-medium text-brand-700">
            Lié à : {task.related_chapter}
          </p>
        )}
      </div>
    </li>
  );
}

function labelForType(type: string): string {
  switch (type) {
    case "read_sheet":
      return "Lecture de fiche";
    case "quiz":
      return "Quiz";
    case "mock_exam":
      return "Examen blanc";
    case "correction":
      return "Correction";
    case "flashcards":
      return "Flashcards";
    case "review":
      return "Révision";
    default:
      return "Tâche";
  }
}
