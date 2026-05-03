import { AlertTriangle, BookOpen, Lightbulb, Star } from "lucide-react";
import type {
  ExamAnalysisResult,
  RevisionSheet,
} from "@/lib/ai/types";
import { ImportanceBadge } from "@/components/results/ImportanceBadge";
import { PaywallNotice } from "@/components/results/PaywallNotice";

interface RevisionSheetsTabProps {
  analysis: ExamAnalysisResult;
  isPremium: boolean;
}

const FREE_VISIBLE = 1;

export function RevisionSheetsTab({
  analysis,
  isPremium,
}: RevisionSheetsTabProps) {
  const all = analysis.revision_sheets;
  if (all.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-100">
        <p className="text-sm text-slate-600">
          Pas encore de fiche générée. Relance l'analyse si besoin.
        </p>
      </div>
    );
  }

  const visible = isPremium ? all : all.slice(0, FREE_VISIBLE);
  const hidden = isPremium ? 0 : Math.max(0, all.length - FREE_VISIBLE);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        {visible.map((sheet) => (
          <RevisionSheetCard key={sheet.chapter_name} sheet={sheet} />
        ))}
      </div>

      {hidden > 0 && (
        <PaywallNotice
          title={`${hidden} fiche${hidden > 1 ? "s" : ""} de révision verrouillée${hidden > 1 ? "s" : ""}`}
          description="Les fiches complètes (définitions, concepts clés, pièges, exemples) sont disponibles avec le Pack Examen ou Premium."
        />
      )}
    </div>
  );
}

function RevisionSheetCard({ sheet }: { sheet: RevisionSheet }) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-soft">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {sheet.chapter_name}
          </h3>
        </div>
        <ImportanceBadge level={sheet.priority} />
      </header>

      {sheet.summary && (
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          {sheet.summary}
        </p>
      )}

      {sheet.key_definitions.length > 0 && (
        <Block icon={BookOpen} title="Définitions clés">
          <dl className="space-y-2">
            {sheet.key_definitions.map((def, idx) => (
              <div key={idx}>
                <dt className="text-sm font-semibold text-slate-900">
                  {def.term}
                </dt>
                <dd className="text-sm text-slate-600">{def.definition}</dd>
              </div>
            ))}
          </dl>
        </Block>
      )}

      {sheet.key_concepts.length > 0 && (
        <Block icon={Lightbulb} title="Concepts clés">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {sheet.key_concepts.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </Block>
      )}

      {sheet.examples.length > 0 && (
        <Block icon={Star} title="Exemples">
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {sheet.examples.map((ex, idx) => (
              <li key={idx}>{ex}</li>
            ))}
          </ul>
        </Block>
      )}

      {sheet.common_traps.length > 0 && (
        <Block icon={AlertTriangle} title="Pièges fréquents" tone="urgent">
          <ul className="list-disc space-y-1 pl-5 text-sm text-urgent-800">
            {sheet.common_traps.map((trap, idx) => (
              <li key={idx}>{trap}</li>
            ))}
          </ul>
        </Block>
      )}

      {sheet.must_remember.length > 0 && (
        <Block icon={Star} title="À retenir absolument" tone="success">
          <ul className="list-disc space-y-1 pl-5 text-sm text-success-800">
            {sheet.must_remember.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        </Block>
      )}
    </article>
  );
}

function Block({
  icon: Icon,
  title,
  children,
  tone = "brand",
}: {
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
  tone?: "brand" | "urgent" | "success";
}) {
  const tones = {
    brand: "text-brand-700",
    urgent: "text-urgent-700",
    success: "text-success-700",
  } as const;

  return (
    <section className="mt-4 border-t border-slate-100 pt-4">
      <h4
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${tones[tone]}`}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {title}
      </h4>
      <div className="mt-2">{children}</div>
    </section>
  );
}
