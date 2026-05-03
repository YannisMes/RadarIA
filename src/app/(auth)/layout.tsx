import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Glow décoratif en fond */}
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
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-slate-100 py-5">
        <p className="mx-auto max-w-2xl px-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} RadarIA — Analyse indicative basée sur
          tes documents. Ne garantit pas les sujets réels d'examen.
        </p>
      </footer>
    </div>
  );
}
