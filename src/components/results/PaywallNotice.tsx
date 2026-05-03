import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

interface PaywallNoticeProps {
  title?: string;
  description?: string;
  cta?: string;
  href?: string;
}

export function PaywallNotice({
  title = "Contenu Premium",
  description = "Passe Premium ou prends le Pack Examen pour débloquer l'intégralité de l'analyse.",
  cta = "Voir les plans",
  href = "/#pricing",
}: PaywallNoticeProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-brand-200 bg-gradient-to-br from-brand-50/60 to-accent-50/60 p-6 text-center sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.18) 0, transparent 60%)",
        }}
      />
      <div className="relative">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-soft ring-1 ring-brand-100">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          {description}
        </p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {cta}
        </Link>
      </div>
    </div>
  );
}
