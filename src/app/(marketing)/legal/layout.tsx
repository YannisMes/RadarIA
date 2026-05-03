import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <Container size="tight">
      <article className="prose prose-slate prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700 prose-a:text-brand-600 mx-auto max-w-3xl py-12 sm:py-16">
        {children}
      </article>
    </Container>
  );
}
