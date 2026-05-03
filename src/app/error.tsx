"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RotateCw } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[app:error]", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b border-transparent">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Retour à l'accueil">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-urgent-50 text-urgent-600 ring-1 ring-urgent-100">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-urgent-600">
            Oups
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Une erreur s'est produite.
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Quelque chose a cassé de notre côté. Tu peux réessayer, et si le
            problème persiste, reviens dans quelques minutes.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-slate-400">
              Référence : <code>{error.digest}</code>
            </p>
          )}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              Réessayer
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
