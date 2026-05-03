import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-brand-700">
        <Sparkles className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-slate-900">
        Aucun projet pour le moment
      </h2>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
        Démarre ta première analyse en quelques minutes. Upload tes documents,
        RadarIA s'occupe du reste.
      </p>
      <Link
        href="/dashboard/new"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Nouvelle analyse
      </Link>
    </div>
  );
}
