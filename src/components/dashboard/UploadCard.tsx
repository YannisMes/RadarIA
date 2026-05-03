"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  ScrollText,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  uploadDocumentAction,
  initialUploadState,
} from "@/app/dashboard/projects/[id]/upload/actions";
import { FormMessage } from "@/components/ui/FormMessage";
import { cn } from "@/lib/utils";
import type { DocumentCategory } from "@/types/database";

const CATEGORY_OPTIONS: {
  value: DocumentCategory;
  label: string;
  description: string;
  icon: typeof FileText;
}[] = [
  {
    value: "course",
    label: "Cours",
    description: "Notes, slides, polycopiés.",
    icon: FileText,
  },
  {
    value: "past_exam",
    label: "Annales",
    description: "Anciens examens, partiels.",
    icon: ScrollText,
  },
  {
    value: "syllabus",
    label: "Syllabus",
    description: "Programme officiel.",
    icon: Sparkles,
  },
];

interface UploadCardProps {
  projectId: string;
  disabled?: boolean;
  disabledReason?: string;
}

export function UploadCard({
  projectId,
  disabled = false,
  disabledReason,
}: UploadCardProps) {
  const [state, formAction] = useFormState(
    uploadDocumentAction,
    initialUploadState,
  );
  const [category, setCategory] = useState<DocumentCategory>("course");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quand l'action revient (succès ou erreur), on réinitialise le fichier.
  useEffect(() => {
    if (state.success || state.error) {
      setPendingFile(null);
      setSubmitting(false);
      if (formRef.current) formRef.current.reset();
    }
  }, [state]);

  const onPick = (file: File | null | undefined) => {
    if (!file) return;
    setPendingFile(file);
  };

  const onSubmitFile = () => {
    if (!pendingFile || !formRef.current) return;
    setSubmitting(true);
    formRef.current.requestSubmit();
  };

  if (disabled) {
    return (
      <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-100 shadow-soft">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Upload désactivé
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {disabledReason ?? "Tu ne peux pas ajouter de nouveaux fichiers."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5 rounded-2xl bg-white p-6 ring-1 ring-slate-100 shadow-soft sm:p-8"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="category" value={category} />

      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Ajouter un document
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Choisis la catégorie, puis dépose ton fichier (PDF ou TXT, max 20
          MB).
        </p>
      </div>

      {state.success && (
        <FormMessage variant="success">{state.success}</FormMessage>
      )}
      {state.error && <FormMessage variant="error">{state.error}</FormMessage>}

      {/* Sélecteur de catégorie */}
      <fieldset>
        <legend className="sr-only">Catégorie du document</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {CATEGORY_OPTIONS.map((opt) => {
            const checked = category === opt.value;
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer flex-col rounded-xl p-4 ring-1 transition-all",
                  checked
                    ? "bg-brand-50 ring-2 ring-brand-500"
                    : "bg-white ring-slate-200 hover:ring-slate-300",
                )}
              >
                <input
                  type="radio"
                  name="categoryRadio"
                  value={opt.value}
                  checked={checked}
                  onChange={() => setCategory(opt.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-2">
                  <opt.icon
                    className={cn(
                      "h-4 w-4",
                      checked ? "text-brand-600" : "text-slate-400",
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      checked ? "text-brand-900" : "text-slate-900",
                    )}
                  >
                    {opt.label}
                  </span>
                  {checked && (
                    <CheckCircle2
                      className="ml-auto h-4 w-4 text-brand-600"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <span className="mt-1.5 text-xs text-slate-600">
                  {opt.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && inputRef.current) {
            const dt = new DataTransfer();
            dt.items.add(file);
            inputRef.current.files = dt.files;
            onPick(file);
          }
        }}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-6 text-center transition-all",
          isDragging
            ? "border-brand-500 bg-brand-50"
            : "border-slate-200 bg-slate-50/50 hover:border-slate-300",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          required
          onChange={(e) => onPick(e.target.files?.[0])}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Sélectionne un fichier"
        />
        <div className="pointer-events-none flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft ring-1 ring-slate-100">
            <Upload className="h-5 w-5" aria-hidden="true" />
          </div>
          {pendingFile ? (
            <>
              <p className="text-sm font-semibold text-slate-900">
                {pendingFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatFileSize(pendingFile.size)}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-900">
                Glisse-dépose ton fichier
              </p>
              <p className="text-xs text-slate-500">
                ou clique pour parcourir tes fichiers
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bouton d'envoi (apparait quand un fichier est sélectionné) */}
      {pendingFile && (
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setPendingFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
            disabled={submitting}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onSubmitFile}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700 disabled:opacity-70"
          >
            {submitting && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {submitting ? "Upload en cours…" : "Uploader"}
          </button>
        </div>
      )}
    </form>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} octets`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
