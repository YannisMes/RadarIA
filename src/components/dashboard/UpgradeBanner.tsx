import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface UpgradeBannerProps {
  projectsUsed: number;
  projectsMax: number;
}

export function UpgradeBanner({
  projectsUsed,
  projectsMax,
}: UpgradeBannerProps) {
  const isLimitReached = projectsUsed >= projectsMax;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-700 p-5 text-white shadow-soft sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18) 0, transparent 50%)",
        }}
      />
      <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold">
              {isLimitReached
                ? "Tu as atteint la limite du plan Gratuit"
                : "Passe Premium pour aller plus loin"}
            </p>
            <p className="mt-1 text-sm text-brand-100">
              {projectsUsed} / {projectsMax} projet{projectsMax > 1 ? "s" : ""}{" "}
              utilisé{projectsUsed > 1 ? "s" : ""} · Examens blancs complets et
              fiches détaillées en Premium.
            </p>
          </div>
        </div>
        <Link
          href="/pricing"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          Voir les plans
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
