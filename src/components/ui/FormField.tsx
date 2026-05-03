import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  hint,
  required,
  optional,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-2 text-sm font-medium leading-6 text-slate-900"
      >
        {label}
        {required && (
          <span className="text-xs font-normal text-danger-500">*</span>
        )}
        {optional && (
          <span className="text-xs font-normal text-slate-400">(optionnel)</span>
        )}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
