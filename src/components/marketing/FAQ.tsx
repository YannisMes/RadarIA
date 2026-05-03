"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "RadarIA peut-il prédire le sujet exact de mon examen ?",
    answer:
      "Non, et ne fais confiance à aucun outil qui prétend le faire. RadarIA fournit une analyse indicative basée uniquement sur les documents que tu fournis. Les probabilités estimées t'aident à prioriser, mais ne garantissent pas les sujets réels d'examen.",
  },
  {
    question: "Quels documents puis-je uploader ?",
    answer:
      "Pour la V1, RadarIA accepte les fichiers PDF et TXT. Tu peux uploader ton cours, tes annales (anciens examens) et ton syllabus officiel. Le support DOCX, JPG et PNG arrive bientôt.",
  },
  {
    question: "Mes documents sont-ils en sécurité ?",
    answer:
      "Oui. Tes fichiers sont stockés sur Supabase (chiffrement au repos) et accessibles uniquement par toi grâce aux Row Level Security policies. Nous ne partageons rien avec qui que ce soit.",
  },
  {
    question: "L'IA va-t-elle réutiliser mes documents pour entraîner ses modèles ?",
    answer:
      "Non. RadarIA utilise l'API Gemini en mode requête classique : tes documents servent uniquement à produire ton analyse personnelle. Ils ne sont pas utilisés pour entraîner de modèle.",
  },
  {
    question: "Combien de fichiers et d'analyses puis-je faire en gratuit ?",
    answer:
      "Le plan Gratuit inclut 1 projet, 3 fichiers et 1 analyse pour découvrir RadarIA. Pour aller plus loin (examens blancs complets, plan de révision détaillé, fiches complètes), tu peux prendre le Pack Examen ou l'abonnement Premium.",
  },
  {
    question: "RadarIA fonctionne-t-il dans toutes les matières ?",
    answer:
      "Oui, du moment que tu fournis des documents textuels exploitables. RadarIA est particulièrement utile en droit, médecine, économie, sciences humaines, ingénierie et toute matière où les annales et le syllabus sont structurants.",
  },
  {
    question: "Puis-je annuler mon abonnement Premium à tout moment ?",
    answer:
      "Oui, l'annulation est sans engagement. Tu peux annuler depuis ton dashboard à n'importe quel moment, et tu gardes l'accès jusqu'à la fin de la période en cours.",
  },
];

export function FAQ() {
  return (
    <Section id="faq">
      <SectionHeader
        eyebrow="FAQ"
        title="Les questions fréquentes."
        description="Tout ce que tu dois savoir avant de te lancer."
      />

      <div className="mx-auto mt-12 max-w-3xl divide-y divide-slate-100 rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </Section>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-slate-900">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-slate-400 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
          {answer}
        </div>
      )}
    </div>
  );
}
