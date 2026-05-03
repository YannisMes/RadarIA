import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
  containerSize?: "tight" | "wide";
  noContainer?: boolean;
}

export function Section({
  children,
  className,
  id,
  as: Tag = "section",
  containerSize = "wide",
  noContainer = false,
}: SectionProps) {
  return (
    <Tag id={id} className={cn("py-16 sm:py-24", className)}>
      {noContainer ? children : <Container size={containerSize}>{children}</Container>}
    </Tag>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-lg leading-relaxed text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}
