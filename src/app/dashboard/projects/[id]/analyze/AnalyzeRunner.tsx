"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import { LoadingAnalysisSteps } from "@/components/dashboard/LoadingAnalysisSteps";

interface AnalyzeRunnerProps {
  projectId: string;
}

type RunState =
  | { status: "idle" }
  | { status: "running" }
  | { status: "done" }
  | { status: "error"; message: string };

export function AnalyzeRunner({ projectId }: AnalyzeRunnerProps) {
  const router = useRouter();
  const [state, setState] = useState<RunState>({ status: "idle" });
  const startedRef = useRef(false);

  const start = async () => {
    setState({ status: "running" });
    try {
      const response = await fetch(
        `/api/projects/${projectId}/analyze`,
        { method: "POST" },
      );
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setState({
          status: "error",
          message: data.error ?? "L'analyse a échoué.",
        });
        return;
      }

      setState({ status: "done" });
      // Petite pause pour laisser le check final apparaître.
      window.setTimeout(() => {
        router.replace(`/dashboard/projects/${projectId}/results`);
      }, 800);
    } catch (e) {
      console.error(e);
      setState({
        status: "error",
        message: "Connexion impossible. Vérifie ton réseau et réessaie.",
      });
    }
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.status === "error") {
    return (
      <div className="space-y-4">
        <LoadingAnalysisSteps errorMessage={state.message} />
        <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/dashboard/projects/${projectId}/upload`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Revenir aux documents
          </Link>
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
          >
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            Réessayer l'analyse
          </button>
        </div>
      </div>
    );
  }

  return <LoadingAnalysisSteps finished={state.status === "done"} />;
}
