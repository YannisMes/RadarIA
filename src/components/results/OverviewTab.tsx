import { ArrowRight, Compass, Lightbulb, Sparkles } from "lucide-react";
import type { ExamAnalysisResult } from "@/lib/ai/types";
import { PreparationScore } from "@/components/results/PreparationScore";
import { ImportanceBadge } from "@/components/results/ImportanceBadge";
import { DisclaimerBox } from "@/components/ui/DisclaimerBox";
import { formatPercent } from "@/lib/utils";

interface OverviewTabProps {
  analysis: ExamAnalysisResult;
}

export function OverviewTab({ analysis }: OverviewTabProps) {
  const top5 = analysis.priority_chapters.slice(0, 5);
  const nextActions = analysis.next_actions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Score + résumé */}
      <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-100 shadow-soft sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-10">
          <div className="flex justify-center lg:justify-start">
            <PreparationScore
              score={analysis.preparation_score}
              confidence={analysis.confidence_level}
            />
          </div>

          <div>
            {analysis.detected_subject && (
              <p className="text-sm font-medium text-brand-600">
                {analysis.detected_subject}
              </p>
            )}
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Résumé global
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {analysis.global_summary || "Pas de résumé disponible."}
            </p>

            {analysis.missing_information.length > 0 && (
              <div className="mt-5 rounded-xl bg-urgent-50 px-4 py-3 text-sm text-urgent-700 ring-1 ring-urgent-100">
                <p className="font-semibold">À noter</p>
                <ul className="mt-1 list-disc pl-5 text-urgent-700/90">
                  {analysis.missing_information.map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stratégie */}
      {analysis.exam_strategy && (
        <Card icon={Compass} title="Stratégie de révision recommandée">
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
            {analysis.exam_strategy}
          </p>
        </Card>
      )}

      {/* Top 5 chapitres */}
      {top5.length > 0 && (
        <Card icon={Sparkles} title="Top 5 chapitres prioritaires">
          <ol className="space-y-3">
            {top5.map((chapter) => (
              <li
                key={`${chapter.rank}-${chapter.chapter_name}`}
                className="flex items-start gap-3 rounded-xl bg-slate-50 p-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-bold text-brand-700 ring-1 ring-brand-100">
                  {chapter.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">
                      {chapter.chapter_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <ImportanceBadge level={chapter.importance_level} />
                      <span className="text-sm font-bold text-brand-700">
                        {formatPercent(chapter.estimated_probability)}
                      </span>
                    </div>
                  </div>
                  {chapter.reasoning && (
                    <p className="mt-1 text-sm text-slate-600">
                      {chapter.reasoning}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      )}

      {/* Prochaines actions */}
      {nextActions.length > 0 && (
        <Card icon={Lightbulb} title="Prochaines actions concrètes">
          <ul className="space-y-2">
            {nextActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <ArrowRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                  aria-hidden="true"
                />
                <span className="text-slate-700">{action}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <DisclaimerBox>{analysis.disclaimer}</DisclaimerBox>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Compass;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-100 shadow-soft">
      <header className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </header>
      <div className="mt-4">{children}</div>
    </section>
  );
}
