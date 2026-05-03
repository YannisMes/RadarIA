import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  RotateCw,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getUserProject } from "@/lib/projects";
import { getLatestProjectAnalysis } from "@/lib/analyses";
import { getUserContext } from "@/lib/profile";
import { Container } from "@/components/ui/Container";
import { ResultsView } from "./ResultsView";
import { examTypeLabel, studyLevelLabel } from "@/lib/labels";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Résultats de l'analyse",
  description: "Découvre tes chapitres prioritaires et ton examen blanc.",
};

interface PageProps {
  params: { id: string };
}

export default async function ResultsPage({ params }: PageProps) {
  const user = await requireUser(`/dashboard/projects/${params.id}/results`);
  const project = await getUserProject(user.id, params.id);
  if (!project) notFound();

  // Si pas encore analysé, on aiguille vers la bonne étape.
  if (project.status !== "analyzed") {
    if (project.status === "failed" || project.status === "draft") {
      redirect(`/dashboard/projects/${params.id}/upload`);
    }
    redirect(`/dashboard/projects/${params.id}/analyze`);
  }

  const [analysis, ctx] = await Promise.all([
    getLatestProjectAnalysis(user.id, project.id),
    getUserContext(user.id),
  ]);
  if (!analysis) {
    redirect(`/dashboard/projects/${params.id}/analyze`);
  }

  return (
    <Container>
      {/* Top nav */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour au dashboard
        </Link>
        {ctx.isPremium && (
          <Link
            href={`/dashboard/projects/${project.id}/analyze`}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
            Relancer une analyse
          </Link>
        )}
      </div>

      {/* Header projet */}
      <header className="mt-4 max-w-3xl">
        <p className="text-sm font-medium text-brand-600">Résultats</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {project.subject_name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap
              className="h-4 w-4 text-slate-400"
              aria-hidden="true"
            />
            {studyLevelLabel(project.study_level)}
            <span aria-hidden="true">·</span>
            {examTypeLabel(project.exam_type)}
          </span>
          {project.exam_date && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                className="h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              Examen le {formatDate(project.exam_date)}
            </span>
          )}
          <span className="text-slate-400">
            Analysé le {formatDate(analysis.createdAt)}
          </span>
        </div>
      </header>

      <div className="mt-8">
        <ResultsView analysis={analysis.result} isPremium={ctx.isPremium} />
      </div>
    </Container>
  );
}
