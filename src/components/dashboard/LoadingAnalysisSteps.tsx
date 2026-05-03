"use client";

import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  GitCompare,
  Loader2,
  ScrollText,
  Sparkles,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: FileSearch, label: "Lecture des fichiers" },
  { icon: ScrollText, label: "Analyse du syllabus" },
  { icon: GitCompare, label: "Analyse des annales" },
  { icon: Target, label: "Détection des chapitres récurrents" },
  { icon: Sparkles, label: "Calcul des priorités" },
  { icon: BookOpenCheck, label: "Génération des fiches" },
  { icon: ClipboardCheck, label: "Création de l'examen blanc" },
  { icon: Calendar, label: "Construction du planning" },
] as const;

const REASSURING_MESSAGES = [
  "On analyse tes documents…",
  "On repère les chapitres qui reviennent souvent…",
  "On compare tes annales avec ton syllabus…",
  "On prépare ton examen blanc probable…",
  "On finalise ton plan de révision…",
  "Ces résultats sont des estimations basées sur tes documents.",
] as const;

interface LoadingAnalysisStepsProps {
  finished?: boolean;
  errorMessage?: string;
}

export function LoadingAnalysisSteps({
  finished = false,
  errorMessage,
}: LoadingAnalysisStepsProps) {
  // L'index "active" avance toutes les ~4-6 secondes. Si finished=true,
  // on saute directement à la fin pour montrer toutes les étapes complètes.
  const [activeIndex, setActiveIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (finished || errorMessage) return;
    const stepInterval = window.setInterval(() => {
      setActiveIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 5500);
    const msgInterval = window.setInterval(() => {
      setMessageIndex((i) => (i + 1) % REASSURING_MESSAGES.length);
    }, 4000);
    return () => {
      window.clearInterval(stepInterval);
      window.clearInterval(msgInterval);
    };
  }, [finished, errorMessage]);

  const effectiveActive = finished ? STEPS.length : activeIndex;

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-100 shadow-soft sm:p-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
          {finished ? (
            <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
          ) : errorMessage ? (
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            {errorMessage
              ? "Analyse interrompue"
              : finished
                ? "Analyse terminée"
                : "Analyse en cours"}
          </h2>
          <p
            key={messageIndex}
            className="mt-1 animate-fade-in text-sm text-slate-600"
          >
            {errorMessage ?? REASSURING_MESSAGES[messageIndex]}
          </p>
        </div>
      </div>

      {/* Étapes */}
      <ul className="mt-6 space-y-2">
        {STEPS.map((step, idx) => {
          const isDone = idx < effectiveActive;
          const isActive = !errorMessage && idx === effectiveActive && !finished;
          return (
            <li
              key={step.label}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                isActive && "bg-brand-50",
                isDone && "text-slate-700",
                !isActive && !isDone && "text-slate-400",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg ring-1 transition-colors",
                  isDone && "bg-success-50 text-success-600 ring-success-100",
                  isActive && "bg-brand-100 text-brand-700 ring-brand-200",
                  !isActive &&
                    !isDone &&
                    "bg-slate-50 text-slate-300 ring-slate-100",
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <step.icon className="h-4 w-4" aria-hidden="true" />
                )}
              </div>
              <span
                className={cn(
                  "font-medium",
                  isActive && "text-brand-900",
                  isDone && "text-slate-900",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Note finale */}
      <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
        Ces estimations sont basées uniquement sur les documents fournis et ne
        garantissent pas les sujets réels de l'examen.
      </p>
    </div>
  );
}
