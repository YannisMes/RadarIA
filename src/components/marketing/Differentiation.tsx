import { Check, X } from "lucide-react";
import { Container } from "@/components/ui/Container";

const comparison = [
  {
    feature: "Génération de fiches à partir d'un cours",
    others: true,
    radaria: true,
  },
  {
    feature: "Analyse des annales pour repérer les sujets récurrents",
    others: false,
    radaria: true,
  },
  {
    feature: "Croisement avec le syllabus officiel",
    others: false,
    radaria: true,
  },
  {
    feature: "Score d'importance et probabilité estimée par chapitre",
    others: false,
    radaria: true,
  },
  {
    feature: "Examen blanc calé sur le format de tes annales",
    others: false,
    radaria: true,
  },
  {
    feature: "Plan de révision personnalisé jusqu'au jour J",
    others: false,
    radaria: true,
  },
];

export function Differentiation() {
  return (
    <section
      id="differenciation"
      className="relative overflow-hidden py-16 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-brand-50/40 to-background"
      />
      <Container size="tight">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-600">
            Différenciation
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Plus qu'un générateur de fiches.
          </h2>
          <p className="mt-4 text-balance text-lg leading-relaxed text-slate-600">
            Les outils classiques transforment ton cours en fiches. RadarIA va
            plus loin : il analyse tes annales et ton syllabus pour t'aider à
            savoir <span className="font-semibold text-slate-900">quoi réviser en priorité</span>.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100">
          <div className="grid grid-cols-12 border-b border-slate-100 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <div className="col-span-6 sm:col-span-7">Fonctionnalité</div>
            <div className="col-span-3 sm:col-span-2 text-center">
              Outils classiques
            </div>
            <div className="col-span-3 text-center">
              <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                RadarIA
              </span>
            </div>
          </div>

          <ul>
            {comparison.map((row) => (
              <li
                key={row.feature}
                className="grid grid-cols-12 items-center border-b border-slate-100 px-6 py-4 last:border-b-0"
              >
                <div className="col-span-6 sm:col-span-7 pr-2 text-sm text-slate-800">
                  {row.feature}
                </div>
                <div className="col-span-3 sm:col-span-2 flex justify-center">
                  {row.others ? (
                    <Check className="h-5 w-5 text-slate-400" aria-label="Oui" />
                  ) : (
                    <X
                      className="h-5 w-5 text-slate-300"
                      aria-label="Non"
                    />
                  )}
                </div>
                <div className="col-span-3 flex justify-center">
                  {row.radaria ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success-100 text-success-700">
                      <Check className="h-4 w-4" aria-label="Oui" />
                    </span>
                  ) : (
                    <X className="h-5 w-5 text-slate-300" aria-label="Non" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
