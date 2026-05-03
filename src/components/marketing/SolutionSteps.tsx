import { Brain, Sparkles, Upload } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload tes documents",
    description:
      "Cours, annales, syllabus. PDF ou texte. Tu ranges chaque fichier dans sa catégorie.",
  },
  {
    number: "02",
    icon: Brain,
    title: "L'IA analyse en croisé",
    description:
      "RadarIA lit tes documents, détecte les chapitres récurrents et compare cours, annales et syllabus.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Tu reçois un plan d'attaque",
    description:
      "Chapitres prioritaires, fiches ciblées, examen blanc probable et planning jour par jour.",
  },
];

export function SolutionSteps() {
  return (
    <Section id="solution">
      <SectionHeader
        eyebrow="La solution"
        title="3 étapes pour transformer ta révision."
        description="Pas d'usine à gaz. Tu uploades, RadarIA analyse, tu révises ce qui compte."
      />

      <div className="relative mt-16">
        {/* Ligne de connexion (desktop) */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block"
        />

        <ol className="grid gap-6 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="relative">
              <div className="relative rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <span className="text-3xl font-bold text-slate-100">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
