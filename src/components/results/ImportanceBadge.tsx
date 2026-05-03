import { cn } from "@/lib/utils";
import type { ImportanceLevel } from "@/lib/ai/types";

const STYLES: Record<ImportanceLevel, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-accent-100 text-accent-700",
  high: "bg-brand-100 text-brand-700",
  very_high: "bg-brand-600 text-white",
};

const LABEL: Record<ImportanceLevel, string> = {
  low: "Faible",
  medium: "Moyenne",
  high: "Élevée",
  very_high: "Très élevée",
};

export function ImportanceBadge({
  level,
  className,
}: {
  level: ImportanceLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "badge inline-flex items-center",
        STYLES[level],
        className,
      )}
    >
      {LABEL[level]}
    </span>
  );
}
