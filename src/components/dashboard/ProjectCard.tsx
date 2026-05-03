"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Loader2,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { ProjectRow } from "@/types/database";
import { studyLevelLabel, examTypeLabel } from "@/lib/labels";
import { formatDate, daysUntil, cn } from "@/lib/utils";
import { deleteProjectAction } from "@/app/dashboard/actions";

interface ProjectCardProps {
  project: ProjectRow;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const remaining = daysUntil(project.exam_date);
  const isAnalyzed = project.status === "analyzed";
  const continueHref =
    project.status === "draft" || project.status === "uploading"
      ? `/dashboard/projects/${project.id}/upload`
      : `/dashboard/projects/${project.id}/results`;

  const onDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteProjectAction(project.id);
      if (result?.error) {
        setError(result.error);
        setConfirming(false);
      }
    });
  };

  return (
    <article className="group flex h-full flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {project.subject_name}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Créé le {formatDate(project.created_at)}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Metric
          icon={GraduationCap}
          label="Niveau"
          value={studyLevelLabel(project.study_level)}
        />
        <Metric
          icon={Sparkles}
          label="Format"
          value={examTypeLabel(project.exam_type)}
        />
        <Metric
          icon={CalendarDays}
          label="Examen"
          value={
            project.exam_date ? formatDate(project.exam_date) : "À définir"
          }
          hint={
            remaining !== null && remaining >= 0
              ? `Dans ${remaining} j`
              : remaining !== null
                ? "Passé"
                : undefined
          }
          hintTone={
            remaining !== null && remaining <= 7 && remaining >= 0
              ? "urgent"
              : "neutral"
          }
        />
        <PreparationScore score={project.preparation_score} />
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-danger-50 px-3 py-2 text-xs text-danger-700">
          {error}
        </p>
      )}

      <footer className="mt-5 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <Link
          href={continueHref}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          {isAnalyzed ? (
            <>
              Voir les résultats
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" aria-hidden="true" />
              Continuer
            </>
          )}
        </Link>

        {confirming ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600">Supprimer ?</span>
            <button
              type="button"
              onClick={onDelete}
              disabled={pending}
              className="inline-flex items-center gap-1 rounded-md bg-danger-600 px-2 py-1 font-medium text-white transition-colors hover:bg-danger-700 disabled:opacity-60"
            >
              {pending && (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
              )}
              Oui
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="rounded-md px-2 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Non
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-danger-50 hover:text-danger-600"
            aria-label="Supprimer le projet"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </footer>
    </article>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  hintTone = "neutral",
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  hint?: string;
  hintTone?: "neutral" | "urgent";
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-medium text-slate-900">
        {value}
      </div>
      {hint && (
        <div
          className={cn(
            "mt-0.5 text-xs font-medium",
            hintTone === "urgent" ? "text-urgent-600" : "text-slate-500",
          )}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

function PreparationScore({ score }: { score: number | null }) {
  if (score === null || score === undefined) {
    return (
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Préparation
        </div>
        <div className="mt-0.5 text-sm font-medium text-slate-400">—</div>
      </div>
    );
  }

  const tone =
    score >= 70
      ? "bg-success-500"
      : score >= 40
        ? "bg-brand-500"
        : "bg-urgent-500";

  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Préparation
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn("h-full rounded-full", tone)}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-slate-900">{score}%</span>
      </div>
    </div>
  );
}
