import { ArrowRight, FileText, ScrollText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-16">
      {/* Glow décoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex h-[600px] justify-center"
      >
        <div className="absolute -top-32 h-[500px] w-[700px] rounded-full bg-gradient-to-br from-brand-200/60 via-accent-200/50 to-transparent blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-700 shadow-soft ring-1 ring-brand-100">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Analyse IA spécialisée pour les étudiants</span>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Révise les{" "}
              <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                bons chapitres
              </span>
              , pas tout le cours.
            </h1>

            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-600">
              Upload ton cours, tes annales et ton syllabus. RadarIA analyse les
              sujets qui reviennent, identifie les chapitres prioritaires et te
              génère un examen blanc réaliste.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" size="lg" variant="primary">
                Analyser mes documents
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href="#exemple" size="lg" variant="secondary">
                Voir un exemple
              </Button>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Gratuit pour démarrer · Pas de carte bancaire requise
            </p>
          </div>

          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative animate-fade-in lg:pl-8">
      <div className="relative rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-100">
        <div className="mb-4 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="ml-3 text-xs font-medium text-slate-500">
            Analyse · Droit civil — Licence 2
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                <FileText className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Cours</p>
                <p className="text-xs text-slate-500">3 fichiers · 287 p.</p>
              </div>
            </div>
            <span className="badge bg-success-100 text-success-700">Indexé</span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-100 text-accent-700">
                <ScrollText className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Annales</p>
                <p className="text-xs text-slate-500">5 sessions · 2019-2024</p>
              </div>
            </div>
            <span className="badge bg-success-100 text-success-700">Croisé</span>
          </div>

          <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              Top chapitre détecté
            </p>
            <p className="mt-1.5 text-sm font-semibold text-slate-900">
              Responsabilité civile
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white ring-1 ring-brand-100">
                <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
              </div>
              <span className="text-xs font-bold text-brand-700">82 %</span>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              Présent dans 4/5 annales · Couvert dans le syllabus
            </p>
          </div>
        </div>
      </div>

      {/* Carte flottante */}
      <div className="absolute -bottom-6 -left-4 hidden rounded-xl bg-white p-3 shadow-card ring-1 ring-slate-100 sm:block sm:-left-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-100 text-success-700">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">
              Examen blanc prêt
            </p>
            <p className="text-xs text-slate-500">12 questions générées</p>
          </div>
        </div>
      </div>
    </div>
  );
}
