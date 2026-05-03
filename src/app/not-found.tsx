import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex h-[400px] justify-center"
      >
        <div className="absolute -top-32 h-[400px] w-[600px] rounded-full bg-gradient-to-br from-brand-200/50 via-accent-200/40 to-transparent blur-3xl" />
      </div>

      <header className="border-b border-transparent">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Retour à l'accueil">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
            <Compass className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-brand-600">
            Erreur 404
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Cette page n'existe plus.
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Le lien est peut-être cassé ou la page a été déplacée.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Retour à l'accueil
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
            >
              Aller au dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
