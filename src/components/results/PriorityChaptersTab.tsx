import type { ExamAnalysisResult, PriorityChapter } from "@/lib/ai/types";
import { ImportanceBadge } from "@/components/results/ImportanceBadge";
import { PaywallNotice } from "@/components/results/PaywallNotice";
import { DisclaimerBox } from "@/components/ui/DisclaimerBox";
import { cn } from "@/lib/utils";

interface PriorityChaptersTabProps {
  analysis: ExamAnalysisResult;
  isPremium: boolean;
}

const FREE_VISIBLE = 3;

export function PriorityChaptersTab({
  analysis,
  isPremium,
}: PriorityChaptersTabProps) {
  const all = analysis.priority_chapters;
  if (all.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-100">
        <p className="text-sm text-slate-600">
          Aucun chapitre prioritaire détecté pour le moment.
        </p>
      </div>
    );
  }

  const visible = isPremium ? all : all.slice(0, FREE_VISIBLE);
  const hidden = isPremium ? 0 : Math.max(0, all.length - FREE_VISIBLE);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {visible.map((chapter) => (
          <ChapterRow key={`${chapter.rank}-${chapter.chapter_name}`} chapter={chapter} />
        ))}
      </div>

      {hidden > 0 && (
        <PaywallNotice
          title={`${hidden} chapitre${hidden > 1 ? "s" : ""} prioritaire${hidden > 1 ? "s" : ""} masqué${hidden > 1 ? "s" : ""}`}
          description={`Passe Premium pour voir l'intégralité du classement, les justifications complètes et le temps de révision conseillé pour chaque chapitre.`}
        />
      )}

      <DisclaimerBox>{analysis.disclaimer}</DisclaimerBox>
    </div>
  );
}

function ChapterRow({ chapter }: { chapter: PriorityChapter }) {
  const probability = Math.round(chapter.estimated_probability);
  const probTone =
    probability >= 70
      ? "success"
      : probability >= 50
        ? "brand"
        : probability >= 30
          ? "accent"
          : "slate";
  const probColors = {
    success: "from-success-500 to-success-600",
    brand: "from-brand-500 to-accent-500",
    accent: "from-accent-400 to-accent-500",
    slate: "from-slate-300 to-slate-400",
  } as const;

  return (
    <article className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-soft">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-sm font-bold text-slate-700 ring-1 ring-slate-100">
            {chapter.rank}
          </span>
          <div>
            <h3 className="font-semibold text-slate-900">
              {chapter.chapter_name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              {chapter.frequency_in_past_exams && (
                <span>
                  Fréquence annales :{" "}
                  <span className="font-medium text-slate-800">
                    {chapter.frequency_in_past_exams}
                  </span>
                </span>
              )}
              <span>
                Syllabus :{" "}
                <span className="font-medium text-slate-800">
                  {chapter.presence_in_syllabus ? "oui" : "non"}
                </span>
              </span>
              <span>
                Cours :{" "}
                <span className="font-medium text-slate-800">
                  {chapter.presence_in_course ? "oui" : "non"}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ImportanceBadge level={chapter.importance_level} />
        </div>
      </header>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">
              Probabilité estimée
            </span>
            <span className="font-bold text-slate-900">{probability} %</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r",
                probColors[probTone],
              )}
              style={{ width: `${probability}%` }}
            />
          </div>
        </div>
        {chapter.recommended_revision_time && (
          <div className="rounded-xl bg-brand-50 px-3 py-2 text-xs ring-1 ring-brand-100">
            <p className="text-brand-600">Temps conseillé</p>
            <p className="mt-0.5 font-semibold text-brand-900">
              {chapter.recommended_revision_time}
            </p>
          </div>
        )}
      </div>

      {chapter.reasoning && (
        <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Pourquoi : </span>
          {chapter.reasoning}
        </p>
      )}

      {(chapter.what_to_master.length > 0 ||
        chapter.common_traps.length > 0) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {chapter.what_to_master.length > 0 && (
            <ListBlock
              title="À maîtriser"
              items={chapter.what_to_master}
              tone="brand"
            />
          )}
          {chapter.common_traps.length > 0 && (
            <ListBlock
              title="Pièges fréquents"
              items={chapter.common_traps}
              tone="urgent"
            />
          )}
        </div>
      )}
    </article>
  );
}

function ListBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "brand" | "urgent";
}) {
  return (
    <div
      className={cn(
        "rounded-xl px-3 py-2.5 text-sm ring-1",
        tone === "brand"
          ? "bg-brand-50 text-brand-900 ring-brand-100"
          : "bg-urgent-50 text-urgent-900 ring-urgent-100",
      )}
    >
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-wider",
          tone === "brand" ? "text-brand-700" : "text-urgent-700",
        )}
      >
        {title}
      </p>
      <ul className="mt-1.5 space-y-1">
        {items.map((it, idx) => (
          <li key={idx} className="flex items-start gap-1.5">
            <span aria-hidden="true">·</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
