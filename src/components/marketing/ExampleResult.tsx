import { Section, SectionHeader } from "@/components/ui/Section";
import { DisclaimerBox } from "@/components/ui/DisclaimerBox";
import { cn } from "@/lib/utils";

type Importance = "Très élevée" | "Élevée" | "Moyenne" | "Faible";

interface Row {
  chapter: string;
  frequency: string;
  inSyllabus: boolean;
  importance: Importance;
  probability: number;
}

const rows: Row[] = [
  {
    chapter: "Responsabilité civile",
    frequency: "4/5",
    inSyllabus: true,
    importance: "Très élevée",
    probability: 82,
  },
  {
    chapter: "Contrats",
    frequency: "3/5",
    inSyllabus: true,
    importance: "Élevée",
    probability: 68,
  },
  {
    chapter: "Régime des obligations",
    frequency: "2/5",
    inSyllabus: true,
    importance: "Moyenne",
    probability: 47,
  },
  {
    chapter: "Prescription",
    frequency: "1/5",
    inSyllabus: true,
    importance: "Moyenne",
    probability: 35,
  },
];

const importanceStyle: Record<Importance, string> = {
  "Très élevée": "bg-brand-600 text-white",
  Élevée: "bg-brand-100 text-brand-700",
  Moyenne: "bg-accent-100 text-accent-700",
  Faible: "bg-slate-100 text-slate-600",
};

export function ExampleResult() {
  return (
    <Section id="exemple">
      <SectionHeader
        eyebrow="Exemple de résultat"
        title="À quoi ressemble une analyse RadarIA ?"
        description="Un classement clair des chapitres prioritaires avec justification, fréquence dans les annales et probabilité estimée."
      />

      <div className="mt-12 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-100">
        <div className="border-b border-slate-100 bg-gradient-to-r from-brand-50/50 to-accent-50/50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                Aperçu démo
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Droit civil — Licence 2
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span>3 cours</span>
              <span aria-hidden="true">·</span>
              <span>5 annales</span>
              <span aria-hidden="true">·</span>
              <span>1 syllabus</span>
            </div>
          </div>
        </div>

        {/* Table desktop */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Chapitre</th>
                <th className="px-6 py-3">Fréquence annales</th>
                <th className="px-6 py-3">Présence syllabus</th>
                <th className="px-6 py-3">Importance</th>
                <th className="px-6 py-3">Probabilité estimée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.chapter} className="text-sm text-slate-800">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {row.chapter}
                  </td>
                  <td className="px-6 py-4">{row.frequency}</td>
                  <td className="px-6 py-4">
                    {row.inSyllabus ? "Oui" : "Non"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "badge",
                        importanceStyle[row.importance],
                      )}
                    >
                      {row.importance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                          style={{ width: `${row.probability}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-900">
                        {row.probability} %
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards mobile */}
        <ul className="divide-y divide-slate-100 md:hidden">
          {rows.map((row) => (
            <li key={row.chapter} className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-slate-900">{row.chapter}</p>
                <span className={cn("badge", importanceStyle[row.importance])}>
                  {row.importance}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <p className="text-slate-400">Annales</p>
                  <p className="font-medium text-slate-800">{row.frequency}</p>
                </div>
                <div>
                  <p className="text-slate-400">Syllabus</p>
                  <p className="font-medium text-slate-800">
                    {row.inSyllabus ? "Oui" : "Non"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                    style={{ width: `${row.probability}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-900">
                  {row.probability} %
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-6 max-w-3xl">
        <DisclaimerBox />
      </div>
    </Section>
  );
}
