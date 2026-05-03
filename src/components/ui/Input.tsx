import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "block w-full rounded-xl border-0 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-soft",
        "ring-1 ring-inset ring-slate-200 placeholder:text-slate-400",
        "focus:ring-2 focus:ring-inset focus:ring-brand-500",
        "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
        invalid && "ring-danger-500 focus:ring-danger-500",
        className,
      )}
      {...props}
    />
  );
});
