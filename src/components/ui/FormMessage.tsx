import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormMessageProps {
  variant: "error" | "success" | "info";
  children: ReactNode;
  className?: string;
}

export function FormMessage({
  variant,
  children,
  className,
}: FormMessageProps) {
  const Icon = variant === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-xl px-4 py-3 text-sm ring-1",
        variant === "error" && "bg-danger-50 text-danger-700 ring-danger-100",
        variant === "success" &&
          "bg-success-50 text-success-700 ring-success-100",
        variant === "info" && "bg-brand-50 text-brand-700 ring-brand-100",
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}
