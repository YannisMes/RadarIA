import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-card ring-1 ring-slate-100">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          )}
        </div>
        {children}
      </div>
      {footer && (
        <div className="mt-5 text-center text-sm text-slate-600">{footer}</div>
      )}
    </div>
  );
}
