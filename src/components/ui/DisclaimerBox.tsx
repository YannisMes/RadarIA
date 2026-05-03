import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DEFAULT_DISCLAIMER } from "@/lib/constants";

interface DisclaimerBoxProps {
  children?: ReactNode;
  className?: string;
  variant?: "info" | "subtle";
}

export function DisclaimerBox({
  children,
  className,
  variant = "info",
}: DisclaimerBoxProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl px-4 py-3 text-sm",
        variant === "info"
          ? "bg-brand-50 text-brand-900 ring-1 ring-brand-100"
          : "bg-slate-50 text-slate-600 ring-1 ring-slate-100",
        className,
      )}
      role="note"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="leading-relaxed">{children ?? DEFAULT_DISCLAIMER}</p>
    </div>
  );
}
