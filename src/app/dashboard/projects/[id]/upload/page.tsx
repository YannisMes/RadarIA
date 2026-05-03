import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, GraduationCap } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getUserProject } from "@/lib/projects";
import {
  countByCategory,
  isReadyForAnalysis,
  listProjectDocuments,
} from "@/lib/documents";
import { getQuotaSnapshot } from "@/lib/quota";
import {
  examTypeLabel,
  studyLevelLabel,
} from "@/lib/labels";
import { Container } from "@/components/ui/Container";
import { UploadCard } from "@/components/dashboard/UploadCard";
import { DocumentList } from "@/components/dashboard/DocumentList";
import { ReadinessSummary } from "@/components/dashboard/ReadinessSummary";
import { DisclaimerBox } from "@/components/ui/DisclaimerBox";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Upload des documents",
  description: "Ajoute tes documents pour lancer l'analyse RadarIA.",
};

interface PageProps {
  params: { id: string };
}

export default async function UploadPage({ params }: PageProps) {
  const user = await requireUser(`/dashboard/projects/${params.id}/upload`);
  const project = await getUserProject(user.id, params.id);
  if (!project) notFound();

  const [documents, snapshot] = await Promise.all([
    listProjectDocuments(user.id, project.id),
    getQuotaSnapshot(user.id),
  ]);

  const counts = countByCategory(documents);
  const { ready, reasons } = isReadyForAnalysis(counts);
  const limitReached = counts.total >= snapshot.limits.maxFilesPerProject;

  return (
    <Container>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour au dashboard
      </Link>

      {/* Header projet */}
      <header className="mt-4 max-w-3xl">
        <p className="text-sm font-medium text-brand-600">Étape 2 / 3</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {project.subject_name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4 text-slate-400" aria-hidden="true" />
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
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Upload tes documents pour que RadarIA puisse les croiser. Tu peux
          supprimer un fichier à tout moment.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <UploadCard
            projectId={project.id}
            disabled={limitReached}
            disabledReason={
              snapshot.isPremium
                ? `Limite de ${snapshot.limits.maxFilesPerProject} fichiers par projet atteinte.`
                : `Limite gratuite : ${snapshot.limits.maxFilesPerProject} fichiers par projet. Passe Premium pour en ajouter plus.`
            }
          />
          <DocumentList projectId={project.id} documents={documents} />
        </div>

        <div className="space-y-4 lg:col-span-1">
          <ReadinessSummary
            projectId={project.id}
            counts={counts}
            ready={ready}
            reasons={reasons}
            filesUsed={counts.total}
            filesMax={snapshot.limits.maxFilesPerProject}
            isPremium={snapshot.isPremium}
          />
          <DisclaimerBox />
        </div>
      </div>
    </Container>
  );
}
