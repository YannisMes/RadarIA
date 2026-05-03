import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PricingSection } from "@/components/marketing/PricingSection";
import { BillingComparison } from "@/components/marketing/BillingComparison";
import { FAQ } from "@/components/marketing/FAQ";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Choisis le plan RadarIA qui te correspond. Gratuit pour démarrer, Pack Examen pour préparer un examen, Premium pour les révisions au long cours.",
};

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 sm:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex h-[400px] justify-center"
        >
          <div className="absolute -top-32 h-[400px] w-[600px] rounded-full bg-gradient-to-br from-brand-200/50 via-accent-200/40 to-transparent blur-3xl" />
        </div>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Tarifs
            </p>
            <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Trouve le plan qui colle à ta saison de partiels.
            </h1>
            <p className="mt-4 text-balance text-lg leading-relaxed text-slate-600">
              Tu peux tester gratuitement, payer un pack à l'unité pour un
              examen précis, ou prendre Premium pour réviser plusieurs matières
              dans l'année.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-soft ring-1 ring-slate-100">
              <ShieldCheck
                className="h-3.5 w-3.5 text-success-600"
                aria-hidden="true"
              />
              Annulation possible à tout moment · Pas de carte bancaire pour
              tester
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing cards (réutilise la section landing) */}
      <PricingSection />

      {/* Comparatif détaillé */}
      <section className="py-16 sm:py-24">
        <Container size="tight">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
              Comparatif détaillé
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ce que tu obtiens dans chaque plan.
            </h2>
            <p className="mt-4 text-balance text-base text-slate-600">
              Pas de petits caractères. Tu peux upgrade ou annuler à tout
              moment.
            </p>
          </div>

          <div className="mt-12">
            <BillingComparison />
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/#exemple"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
            >
              Voir un exemple d'analyse
            </Link>
          </div>
        </Container>
      </section>

      <FAQ />
    </>
  );
}
