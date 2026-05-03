import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getUserProject } from "@/lib/projects";
import {
  countByCategory,
  isReadyForAnalysis,
  listProjectDocuments,
} from "@/lib/documents";
import { Container } from "@/components/ui/Container";
import { AnalyzeRunner } from "./AnalyzeRunner";

export const metadata: Metadata = {
  title: "Analyse en cours",
  description: "RadarIA analyse tes documents.",
};

interface PageProps {
  params: { id: string };
}

export default async function AnalyzePage({ params }: PageProps) {
  const user = await requireUser(`/dashboard/projects/${params.id}/analyze`);
  const project = await getUserProject(user.id, params.id);
  if (!project) notFound();

  // Si une analyse existe déjà, on redirige vers les résultats.
  if (project.status === "analyzed") {
    redirect(`/dashboard/projects/${params.id}/results`);
  }

  // Sécurité supplémentaire : on vérifie que les documents sont prêts.
  const documents = await listProjectDocuments(user.id, params.id);
  const counts = countByCategory(documents);
  const { ready } = isReadyForAnalysis(counts);
  if (!ready) {
    redirect(`/dashboard/projects/${params.id}/upload`);
  }

  return (
    <Container size="tight">
      <header className="mb-8 text-center">
        <p className="text-sm font-medium text-brand-600">Étape 3 / 3</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {project.subject_name}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          On lit tes {documents.length} document
          {documents.length > 1 ? "s" : ""} et on prépare ton plan d'attaque.
          Ça prend en général moins d'une minute.
        </p>
      </header>

      <AnalyzeRunner projectId={project.id} />
    </Container>
  );
}
