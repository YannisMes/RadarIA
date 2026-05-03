"use client";

import { useState, useTransition } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  ScrollText,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { DocumentRow, DocumentCategory } from "@/types/database";
import { deleteDocumentAction } from "@/app/dashboard/projects/[id]/upload/actions";
import { cn } from "@/lib/utils";

interface DocumentListProps {
  projectId: string;
  documents: DocumentRow[];
}

const CATEGORY_META: Record<
  DocumentCategory,
  {
    label: string;
    description: string;
    icon: typeof FileText;
    accent: string;
  }
> = {
  course: {
    label: "Cours",
    description: "Notes et supports de cours.",
    icon: FileText,
    accent: "bg-brand-50 text-brand-700 ring-brand-100",
  },
  past_exam: {
    label: "Annales",
    description: "Anciens examens et partiels.",
    icon: ScrollText,
    accent: "bg-accent-50 text-accent-700 ring-accent-100",
  },
  syllabus: {
    label: "Syllabus",
    description: "Programme officiel de la matière.",
    icon: Sparkles,
    accent: "bg-success-50 text-success-700 ring-success-100",
  },
};

export function DocumentList({ projectId, documents }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-700">
          Aucun document pour ce projet
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Ajoute au moins un cours et une annale ou un syllabus pour lancer
          l'analyse.
        </p>
      </div>
    );
  }

  const grouped: Record<DocumentCategory, DocumentRow[]> = {
    course: [],
    past_exam: [],
    syllabus: [],
  };
  for (const doc of documents) {
    grouped[doc.document_category].push(doc);
  }

  return (
    <div className="space-y-4">
      {(Object.keys(grouped) as DocumentCategory[]).map((cat) => {
        const docs = grouped[cat];
        if (docs.length === 0) return null;
        const meta = CATEGORY_META[cat];
        return (
          <section
            key={cat}
            className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 shadow-soft"
          >
            <header className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl ring-1",
                  meta.accent,
                )}
              >
                <meta.icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  {meta.label}
                  <span className="ml-1.5 text-xs font-normal text-slate-500">
                    ({docs.length})
                  </span>
                </h3>
                <p className="text-xs text-slate-500">{meta.description}</p>
              </div>
            </header>
            <ul className="mt-3 divide-y divide-slate-100">
              {docs.map((doc) => (
                <DocumentRowItem
                  key={doc.id}
                  doc={doc}
                  projectId={projectId}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function DocumentRowItem({
  doc,
  projectId,
}: {
  doc: DocumentRow;
  projectId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteDocumentAction(projectId, doc.id);
      if (result?.error) {
        setError(result.error);
        setConfirming(false);
      }
    });
  };

  const hasExtractedText =
    typeof doc.extracted_text === "string" && doc.extracted_text.length > 50;

  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">
          {doc.file_name}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span>{formatFileSize(doc.file_size ?? 0)}</span>
          <span aria-hidden="true">·</span>
          <span>{doc.file_type?.includes("pdf") ? "PDF" : "TXT"}</span>
          <span aria-hidden="true">·</span>
          {hasExtractedText ? (
            <span className="inline-flex items-center gap-1 text-success-700">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
              Texte extrait
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 text-urgent-600"
              title="L'analyse pourra rester partielle pour ce document."
            >
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              Texte non extrait
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-danger-600">{error}</p>
        )}
      </div>
      {confirming ? (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600">Supprimer ?</span>
          <button
            type="button"
            onClick={onDelete}
            disabled={pending}
            className="inline-flex items-center gap-1 rounded-md bg-danger-600 px-2 py-1 font-medium text-white hover:bg-danger-700 disabled:opacity-60"
          >
            {pending && (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            )}
            Oui
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={pending}
            className="rounded-md px-2 py-1 font-medium text-slate-600 hover:bg-slate-100"
          >
            Non
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-danger-50 hover:text-danger-600"
          aria-label={`Supprimer ${doc.file_name}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </li>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} octets`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
