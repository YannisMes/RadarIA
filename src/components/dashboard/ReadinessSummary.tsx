import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Lock,
  ScrollText,
  Sparkles,
} from "lucide-react";
import type { DocumentCounts } from "@/lib/documents";
import { cn } from "@/lib/utils";

interface ReadinessSummaryProps {
  projectId: string;
  counts: DocumentCounts;
  ready: boolean;
  reasons: string[];
  filesUsed: number;
  filesMax: number;
  isPremium: boolean;
}

export function ReadinessSummary({
  projectId,
  counts,
  ready,
  reasons,
  filesUsed,
  filesMax,
  isPremium,
}: ReadinessSummaryProps) {
  const limitReached = filesUsed >= filesMax;

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-soft sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h2 className="text-base font-semibold text-slate-900">
            Résumé de tes documents
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {filesUsed} / {filesMax} fichier{filesMax > 1 ? "s" : ""} ·{" "}
            {isPremium ? "Plan Premium" : "Plan Gratuit"}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <CountTile
              icon={FileText}
              label="Cours"
              count={counts.course}
              color="brand"
            />
            <CountTile
              icon={ScrollText}
              label="Annales"
              count={counts.past_exam}
              color="accent"
            />
            <CountTile
              icon={Sparkles}
              label="Syllabus"
              count={counts.syllabus}
              color="success"
            />
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:min-w-[220px]">
          <ReadinessBadge ready={ready} />
          <Link
            href={
              ready ? `/dashboard/projects/${projectId}/analyze` : "#"
            }
            aria-disabled={!ready}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors",
              ready
                ? "bg-brand-600 text-white shadow-soft hover:bg-brand-700"
                : "pointer-events-none bg-slate-100 text-slate-400",
            )}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Lancer l'analyse
          </Link>
          {limitReached && !isPremium && (
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
            >
              <Lock className="h-3 w-3" aria-hidden="true" />
              Quota atteint — voir Premium
            </Link>
          )}
        </div>
      </div>

      {!ready && reasons.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4">
          {reasons.map((reason) => (
            <li
              key={reason}
              className="flex items-start gap-2 text-sm text-slate-600"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-urgent-500"
                aria-hidden="true"
              />
              {reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CountTile({
  icon: Icon,
  label,
  count,
  color,
}: {
  icon: typeof FileText;
  label: string;
  count: number;
  color: "brand" | "accent" | "success";
}) {
  const colors: Record<typeof color, string> = {
    brand: "bg-brand-50 text-brand-700",
    accent: "bg-accent-50 text-accent-700",
    success: "bg-success-50 text-success-700",
  };

  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-lg",
          colors[color],
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-xl font-bold text-slate-900">{count}</span>
        <span className="text-xs text-slate-500">{label}</span>
      </div>
    </div>
  );
}

function ReadinessBadge({ ready }: { ready: boolean }) {
  if (ready) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-success-50 px-3 py-2 text-sm font-medium text-success-700 ring-1 ring-success-100">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Prêt pour l'analyse
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-xl bg-urgent-50 px-3 py-2 text-sm font-medium text-urgent-700 ring-1 ring-urgent-100">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      Documents incomplets
    </div>
  );
}
