import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Cell = boolean | string;

interface Row {
  feature: string;
  free: Cell;
  pack: Cell;
  premium: Cell;
}

const SECTIONS: { title: string; rows: Row[] }[] = [
  {
    title: "Projets et fichiers",
    rows: [
      { feature: "Projets de révision", free: "1", pack: "1", premium: "Illimités" },
      {
        feature: "Fichiers par projet",
        free: "3",
        pack: "10",
        premium: "25",
      },
      {
        feature: "Formats supportés",
        free: "PDF, TXT",
        pack: "PDF, TXT",
        premium: "PDF, TXT",
      },
    ],
  },
  {
    title: "Analyse IA",
    rows: [
      {
        feature: "Analyses complètes",
        free: "1",
        pack: "1",
        premium: "Illimitées",
      },
      {
        feature: "Croisement cours / annales / syllabus",
        free: true,
        pack: true,
        premium: true,
      },
      {
        feature: "Score d'importance par chapitre",
        free: true,
        pack: true,
        premium: true,
      },
      {
        feature: "Probabilité estimée par chapitre",
        free: "Top 3",
        pack: true,
        premium: true,
      },
    ],
  },
  {
    title: "Contenu généré",
    rows: [
      {
        feature: "Vue d'ensemble + score de préparation",
        free: true,
        pack: true,
        premium: true,
      },
      {
        feature: "Top chapitres prioritaires",
        free: "3",
        pack: "Tous",
        premium: "Tous",
      },
      {
        feature: "Fiches de révision détaillées",
        free: "1",
        pack: "Toutes",
        premium: "Toutes",
      },
      {
        feature: "Examen blanc complet",
        free: false,
        pack: true,
        premium: true,
      },
      {
        feature: "Barème + correction de l'examen blanc",
        free: false,
        pack: true,
        premium: true,
      },
      {
        feature: "Plan de révision jour par jour",
        free: "2 jours",
        pack: "Complet",
        premium: "Complet",
      },
    ],
  },
  {
    title: "À venir",
    rows: [
      { feature: "Mode urgence (24h / 3j / 7j)", free: false, pack: false, premium: true },
      { feature: "Correction de copies", free: false, pack: false, premium: true },
      { feature: "Flashcards interactives", free: false, pack: false, premium: true },
      { feature: "Export PDF des fiches", free: false, pack: true, premium: true },
    ],
  },
];

export function BillingComparison() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100">
      {/* Header sticky */}
      <div
        className="grid border-b border-slate-100 bg-slate-50 text-sm font-semibold text-slate-900"
        style={{ gridTemplateColumns: "minmax(0, 2fr) repeat(3, minmax(0, 1fr))" }}
      >
        <div className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Fonctionnalité
        </div>
        <ColumnHeader title="Gratuit" subtitle="0 €" />
        <ColumnHeader title="Pack Examen" subtitle="6,99 €" />
        <ColumnHeader title="Premium" subtitle="9,99 €/mois" highlighted />
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title}>
          <div
            className="border-b border-t border-slate-100 bg-slate-50/50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            {section.title}
          </div>
          {section.rows.map((row) => (
            <div
              key={row.feature}
              className="grid items-center border-b border-slate-100 last:border-b-0"
              style={{
                gridTemplateColumns: "minmax(0, 2fr) repeat(3, minmax(0, 1fr))",
              }}
            >
              <div className="px-5 py-3 text-sm text-slate-800">
                {row.feature}
              </div>
              <CellView value={row.free} />
              <CellView value={row.pack} />
              <CellView value={row.premium} highlighted />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ColumnHeader({
  title,
  subtitle,
  highlighted = false,
}: {
  title: string;
  subtitle: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        "px-5 py-4 text-center",
        highlighted && "bg-brand-50/60",
      )}
    >
      <p
        className={cn(
          "text-sm font-semibold",
          highlighted
            ? "bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent"
            : "text-slate-900",
        )}
      >
        {title}
      </p>
      <p className="mt-0.5 text-xs font-normal text-slate-500">{subtitle}</p>
    </div>
  );
}

function CellView({
  value,
  highlighted = false,
}: {
  value: Cell;
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-3 py-3 text-center text-sm",
        highlighted && "bg-brand-50/30",
      )}
    >
      {typeof value === "boolean" ? (
        value ? (
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full",
              highlighted
                ? "bg-success-100 text-success-700"
                : "bg-slate-100 text-slate-500",
            )}
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : (
          <Minus className="h-4 w-4 text-slate-300" aria-hidden="true" />
        )
      ) : (
        <span
          className={cn(
            "font-medium",
            highlighted ? "text-brand-900" : "text-slate-700",
          )}
        >
          {value}
        </span>
      )}
    </div>
  );
}
