import {
  CheckCircle2,
  Clock,
  Cog,
  FileEdit,
  TriangleAlert,
} from "lucide-react";
import type { ProjectStatus } from "@/types/database";
import { projectStatusLabel } from "@/lib/labels";
import { cn } from "@/lib/utils";

const styles: Record<ProjectStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  uploading: "bg-brand-100 text-brand-700",
  analyzing: "bg-accent-100 text-accent-700",
  analyzed: "bg-success-100 text-success-700",
  failed: "bg-danger-50 text-danger-700",
};

const icons: Record<ProjectStatus, typeof Clock> = {
  draft: FileEdit,
  uploading: Clock,
  analyzing: Cog,
  analyzed: CheckCircle2,
  failed: TriangleAlert,
};

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const Icon = icons[status];
  return (
    <span
      className={cn(
        "badge inline-flex items-center gap-1.5",
        styles[status],
        className,
      )}
    >
      <Icon
        className={cn(
          "h-3 w-3",
          status === "analyzing" && "animate-spin",
        )}
        aria-hidden="true"
      />
      {projectStatusLabel(status)}
    </span>
  );
}
