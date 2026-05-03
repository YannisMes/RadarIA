import Link from "next/link";
import type { Metadata } from "next";
import { Lock, Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { displayName } from "@/lib/profile";
import { listUserProjects } from "@/lib/projects";
import { getQuotaSnapshot } from "@/lib/quota";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Tes projets de révision RadarIA.",
};

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const [projects, snapshot] = await Promise.all([
    listUserProjects(user.id),
    getQuotaSnapshot(user.id),
  ]);

  const firstName = displayName(null, user.email);
  const quotaReached = snapshot.projectsCount >= snapshot.limits.maxProjects;

  return (
    <Container>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-600">Dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Salut {firstName} 👋
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Reprends une révision en cours ou démarre une nouvelle analyse.
          </p>
        </div>
        <NewProjectButton disabled={quotaReached} />
      </div>

      {/* Bandeau upgrade pour les utilisateurs gratuits avec au moins 1 projet */}
      {!snapshot.isPremium && projects.length > 0 && (
        <div className="mt-6">
          <UpgradeBanner
            projectsUsed={snapshot.projectsCount}
            projectsMax={snapshot.limits.maxProjects}
          />
        </div>
      )}

      {/* Liste / état vide */}
      <section className="mt-8">
        <h2 className="text-base font-semibold text-slate-900">
          Mes projets
          <span className="ml-2 text-sm font-normal text-slate-500">
            ({projects.length})
          </span>
        </h2>

        {projects.length === 0 ? (
          <div className="mt-4">
            <EmptyState />
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}

function NewProjectButton({ disabled }: { disabled: boolean }) {
  if (disabled) {
    return (
      <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-500">
        <Lock className="h-4 w-4" aria-hidden="true" />
        Limite atteinte
      </div>
    );
  }
  return (
    <Link
      href="/dashboard/new"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-soft transition-colors",
        "bg-brand-600 text-white hover:bg-brand-700",
      )}
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
      Nouvelle analyse
    </Link>
  );
}
