import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Lock } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { canCreateProject } from "@/lib/quota";
import { Container } from "@/components/ui/Container";
import { NewProjectForm } from "./NewProjectForm";

export const metadata: Metadata = {
  title: "Nouveau projet",
  description: "Crée un projet de révision et lance ton analyse RadarIA.",
};

export default async function NewProjectPage() {
  const user = await requireUser("/dashboard/new");
  const { allowed, snapshot } = await canCreateProject(user.id);

  return (
    <Container>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Retour au dashboard
      </Link>

      <header className="mt-4 max-w-2xl">
        <p className="text-sm font-medium text-brand-600">Nouveau projet</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Crée un projet de révision
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Donne-nous quelques informations sur ta matière et ton examen. Tu
          uploaderas tes documents juste après.
        </p>
      </header>

      <div className="mt-8 max-w-2xl">
        {!allowed ? (
          <QuotaReached
            isPremium={snapshot.isPremium}
            projectsCount={snapshot.projectsCount}
            projectsMax={snapshot.limits.maxProjects}
          />
        ) : (
          <NewProjectForm />
        )}
      </div>
    </Container>
  );
}

function QuotaReached({
  isPremium,
  projectsCount,
  projectsMax,
}: {
  isPremium: boolean;
  projectsCount: number;
  projectsMax: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-100 shadow-soft">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-urgent-50 text-urgent-600">
        <Lock className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        Limite de projets atteinte
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        Tu utilises {projectsCount} / {projectsMax} projet
        {projectsMax > 1 ? "s" : ""} de ton plan{" "}
        {isPremium ? "Premium" : "Gratuit"}.{" "}
        {!isPremium &&
          "Passe Premium pour créer plusieurs projets ou supprime un projet existant."}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
        >
          Retour au dashboard
        </Link>
        {!isPremium && (
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
          >
            Voir les plans Premium
          </Link>
        )}
      </div>
    </div>
  );
}
