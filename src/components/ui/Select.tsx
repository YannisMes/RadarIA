import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, invalid, children, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "block w-full appearance-none rounded-xl border-0 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 shadow-soft",
            "ring-1 ring-inset ring-slate-200",
            "focus:ring-2 focus:ring-inset focus:ring-brand-500",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            invalid && "ring-danger-500 focus:ring-danger-500",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    );
  },
);
