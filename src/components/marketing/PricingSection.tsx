import { Check, Sparkles } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CheckoutButton } from "@/components/marketing/CheckoutButton";
import { cn } from "@/lib/utils";

type PaidPlanId = "pack" | "premium";

interface Plan {
  id: "free" | PaidPlanId;
  name: string;
  price: string;
  period?: string;
  description: string;
  cta: string;
  /** Soit un href (plan gratuit / fallback), soit déclenche Stripe via plan id. */
  ctaHref?: string;
  ctaVariant: "primary" | "secondary" | "outline";
  features: string[];
  notIncluded?: string[];
  highlighted?: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuit",
    price: "0 €",
    description: "Pour tester RadarIA sur un examen.",
    cta: "Commencer gratuitement",
    ctaHref: "/signup",
    ctaVariant: "secondary",
    features: [
      "1 projet de révision",
      "3 fichiers maximum",
      "1 analyse IA",
      "Aperçu des chapitres prioritaires",
    ],
    notIncluded: [
      "Examen blanc complet",
      "Plan de révision détaillé",
      "Fiches complètes",
    ],
  },
  {
    id: "pack",
    name: "Pack Examen",
    price: "6,99 €",
    period: "paiement unique",
    description: "Pour préparer un examen précis sans abonnement.",
    cta: "Choisir le pack",
    ctaVariant: "outline",
    badge: "À l'unité",
    features: [
      "1 analyse complète",
      "Jusqu'à 10 fichiers",
      "Tous les chapitres prioritaires",
      "Examen blanc complet",
      "Plan de révision jour par jour",
      "Fiches complètes par chapitre",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "9,99 €",
    period: "/ mois",
    description: "Pour réviser plusieurs matières toute l'année.",
    cta: "Passer Premium",
    ctaVariant: "primary",
    highlighted: true,
    badge: "Le plus populaire",
    features: [
      "Projets illimités",
      "Fichiers étendus par projet",
      "Analyses complètes illimitées",
      "Examens blancs illimités",
      "Plans de révision adaptés",
      "Mode urgence (bientôt)",
      "Correction de copies (bientôt)",
    ],
  },
];

export function PricingSection() {
  return (
    <Section id="pricing" className="bg-background">
      <SectionHeader
        eyebrow="Tarifs"
        title="Un plan pour chaque besoin."
        description="Démarre gratuitement. Passe à un pack ou un abonnement quand tu veux aller plus loin."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-2xl bg-white p-6 ring-1 transition-all sm:p-8",
              plan.highlighted
                ? "ring-2 ring-brand-500 shadow-card lg:scale-[1.02]"
                : "ring-slate-100 shadow-soft",
            )}
          >
            {plan.badge && (
              <span
                className={cn(
                  "absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold",
                  plan.highlighted
                    ? "bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-soft"
                    : "bg-accent-100 text-accent-700",
                )}
              >
                {plan.highlighted && (
                  <Sparkles
                    className="mr-1 inline h-3 w-3"
                    aria-hidden="true"
                  />
                )}
                {plan.badge}
              </span>
            )}

            <div>
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-1.5 text-sm text-slate-600">
                {plan.description}
              </p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-slate-500">{plan.period}</span>
                )}
              </div>
            </div>

            <div className="mt-6">
              {plan.id === "free" ? (
                <Button
                  href={plan.ctaHref ?? "/signup"}
                  variant={plan.ctaVariant}
                  size="md"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              ) : (
                <CheckoutButton
                  plan={plan.id}
                  variant={plan.ctaVariant === "secondary" ? "secondary" : plan.ctaVariant}
                >
                  {plan.cta}
                </CheckoutButton>
              )}
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-700">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
              {plan.notIncluded?.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-slate-400"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <span className="h-1 w-2.5 rounded-full bg-slate-300" />
                  </span>
                  <span className="line-through">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-500">
        Tous les tarifs sont en euros TTC. Tu peux annuler ton abonnement à tout
        moment. Le paiement Stripe sera activé pour la mise en production.
      </p>
    </Section>
  );
}
