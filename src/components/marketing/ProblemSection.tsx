import { AlertCircle, Clock, FileX, Frown, Target } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const painPoints = [
  {
    icon: Target,
    title: "Je ne sais pas quoi réviser.",
    description:
      "200 pages de cours, plusieurs annales, et zéro idée d'où commencer.",
  },
  {
    icon: Clock,
    title: "Je perds du temps à faire des fiches.",
    description: "Des heures sur la mise en forme, peu sur la compréhension.",
  },
  {
    icon: FileX,
    title: "Je révise des chapitres peu importants.",
    description: "Je passe du temps sur des sujets qui ne tombent jamais.",
  },
  {
    icon: AlertCircle,
    title: "Je ne m'entraîne pas sur le bon format.",
    description: "Je connais le cours mais pas la mécanique de l'examen.",
  },
  {
    icon: Frown,
    title: "Je stresse avant le partiel.",
    description: "L'angoisse monte à mesure que la date approche.",
  },
];

export function ProblemSection() {
  return (
    <Section id="probleme" className="bg-background">
      <SectionHeader
        eyebrow="Le problème"
        title="Tu as 200 pages de cours et aucune idée de ce qui va tomber ?"
        description="RadarIA t'aide à prioriser. Plus de devine, plus de zones d'ombre — un radar sur ce qui compte vraiment."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {painPoints.map((point) => (
          <div
            key={point.title}
            className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 transition-all hover:shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-urgent-50 text-urgent-600">
                <point.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {point.title}
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
