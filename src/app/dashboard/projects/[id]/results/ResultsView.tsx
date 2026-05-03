"use client";

import { useState } from "react";
import {
  BookOpenCheck,
  Calendar,
  ClipboardCheck,
  LayoutDashboard,
  Star,
} from "lucide-react";
import type { ExamAnalysisResult } from "@/lib/ai/types";
import { OverviewTab } from "@/components/results/OverviewTab";
import { PriorityChaptersTab } from "@/components/results/PriorityChaptersTab";
import { RevisionSheetsTab } from "@/components/results/RevisionSheetsTab";
import { MockExamTab } from "@/components/results/MockExamTab";
import { RevisionPlanTab } from "@/components/results/RevisionPlanTab";
import { cn } from "@/lib/utils";

type TabId = "overview" | "chapters" | "sheets" | "mock_exam" | "plan";

const TABS: { id: TabId; label: string; icon: typeof Star }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "chapters", label: "Chapitres prioritaires", icon: Star },
  { id: "sheets", label: "Fiches de révision", icon: BookOpenCheck },
  { id: "mock_exam", label: "Examen blanc", icon: ClipboardCheck },
  { id: "plan", label: "Plan de révision", icon: Calendar },
];

interface ResultsViewProps {
  analysis: ExamAnalysisResult;
  isPremium: boolean;
}

export function ResultsView({ analysis, isPremium }: ResultsViewProps) {
  const [active, setActive] = useState<TabId>("overview");

  return (
    <div className="space-y-6">
      {/* Tabs nav */}
      <div className="overflow-x-auto">
        <nav
          role="tablist"
          aria-label="Sections des résultats"
          className="flex min-w-max gap-1 rounded-2xl bg-white p-1.5 ring-1 ring-slate-100 shadow-soft"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand-600 text-white shadow-soft"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <tab.icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div role="tabpanel">
        {active === "overview" && <OverviewTab analysis={analysis} />}
        {active === "chapters" && (
          <PriorityChaptersTab analysis={analysis} isPremium={isPremium} />
        )}
        {active === "sheets" && (
          <RevisionSheetsTab analysis={analysis} isPremium={isPremium} />
        )}
        {active === "mock_exam" && (
          <MockExamTab analysis={analysis} isPremium={isPremium} />
        )}
        {active === "plan" && (
          <RevisionPlanTab analysis={analysis} isPremium={isPremium} />
        )}
      </div>
    </div>
  );
}
