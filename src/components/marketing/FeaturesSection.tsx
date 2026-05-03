import {
  AlarmClock,
  BarChart3,
  BookOpenCheck,
  CalendarRange,
  ClipboardCheck,
  GitCompare,
  Percent,
  TrendingUp,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

type Feature = {
  icon: typeof BarChart3;
  title: string;
  description: string;
  badge?: "soon";
};

const features: Feature[] = [
  {
    icon: GitCompare,
    title: "Analyse croisée cours + annales + syllabus",
    description:
      "RadarIA confronte les trois sources pour repérer ce qui revient vraiment.",
  },
  {
    icon: BarChart3,
    title: "Score d'importance par chapitre",
    description:
      "Chaque chapitre reçoit un score basé sur sa fréquence et son poids dans le programme.",
  },
  {
    icon: Percent,
    title: "Probabilité estimée à l'examen",
    description:
      "Une estimation indicative pour t'aider à prioriser, jamais une promesse.",
  },
  {
    icon: BookOpenCheck,
    title: "Fiches ciblées par chapitre",
    description:
      "Définitions, concepts clés, exemples, pièges et points à retenir.",
  },
  {
    icon: ClipboardCheck,
    title: "Examen blanc probable",
    description:
      "Un sujet réaliste avec barème et correction, calé sur le format de tes annales.",
  },
  {
    icon: CalendarRange,
    title: "Plan de révision efficace",
    description:
      "Un planning jour par jour adapté à ta date d'examen et ton temps disponible.",
  },
  {
    icon: AlarmClock,
    title: "Mode urgence",
    description: "Concentré 24h, 3 jours ou 7 jours pour réviser à l'arrache.",
    badge: "soon",
  },
  {
    icon: TrendingUp,
    title: "Correction de copies",
    description:
      "Soumets ta copie pour obtenir un retour structuré et personnalisé.",
    badge: "soon",
  },
];

export function FeaturesSection() {
  return (
    <Section id="fonctionnalites" className="bg-background">
      <SectionHeader
        eyebrow="Fonctionnalités"
        title="Tout ce qu'il faut pour préparer un examen efficacement."
        description="RadarIA ne se contente pas de générer des fiches. Il t'oriente vers ce qui mérite vraiment ton temps."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </Section>
  );
}

function FeatureCard({ icon: Icon, title, description, badge }: Feature) {
  return (
    <div className="group relative flex h-full flex-col rounded-2xl bg-white p-5 ring-1 ring-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-card">
      {badge === "soon" && (
        <span className="badge absolute right-4 top-4 bg-accent-100 text-accent-700">
          Bientôt
        </span>
      )}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
        {description}
      </p>
    </div>
  );
}
