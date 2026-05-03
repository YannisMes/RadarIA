import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubscriptionStatus } from "@/types/database";

interface PlanBadgeProps {
  status: SubscriptionStatus;
  size?: "sm" | "md";
  className?: string;
}

const LABEL: Record<SubscriptionStatus, string> = {
  free: "Gratuit",
  pack: "Pack Examen",
  premium: "Premium",
};

export function PlanBadge({
  status,
  size = "sm",
  className,
}: PlanBadgeProps) {
  const isPaid = status === "premium" || status === "pack";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold ring-1",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        isPaid
          ? "bg-gradient-to-r from-brand-600 to-accent-600 text-white ring-transparent"
          : "bg-slate-100 text-slate-600 ring-slate-200",
        className,
      )}
    >
      {isPaid && (
        <Sparkles
          className={cn(size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3")}
          aria-hidden="true"
        />
      )}
      {LABEL[status]}
    </span>
  );
}
