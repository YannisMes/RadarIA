"use client";

import { useFormState } from "react-dom";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  STUDY_LEVELS,
  EXAM_TYPES,
  CURRENT_LEVELS,
  TARGET_GRADES,
  AVAILABLE_TIMES,
} from "@/lib/constants";
import {
  createProjectAction,
  initialCreateProjectState,
} from "./actions";

export function NewProjectForm() {
  const [state, formAction] = useFormState(
    createProjectAction,
    initialCreateProjectState,
  );

  // Date min = aujourd'hui (au format YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl bg-white p-6 ring-1 ring-slate-100 shadow-soft sm:p-8"
    >
      {state.error && (
        <FormMessage variant="error">{state.error}</FormMessage>
      )}

      {/* --- Section : matière + niveau --- */}
      <section className="space-y-4">
        <SectionTitle
          icon={<Sparkles className="h-4 w-4" />}
          title="Ta matière"
          description="Donne un nom clair pour reconnaître ce projet."
        />

        <FormField
          label="Nom de la matière"
          htmlFor="subject_name"
          required
          hint="Ex. : Droit civil, Cardiologie, Économie monétaire…"
        >
          <Input
            id="subject_name"
            name="subject_name"
            required
            maxLength={100}
            placeholder="Ex. Droit civil"
            invalid={Boolean(state.fieldErrors?.subject_name)}
          />
          <FieldError message={state.fieldErrors?.subject_name} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Niveau d'étude" htmlFor="study_level" required>
            <Select
              id="study_level"
              name="study_level"
              required
              defaultValue=""
              invalid={Boolean(state.fieldErrors?.study_level)}
            >
              <option value="" disabled>
                Sélectionne ton niveau
              </option>
              {STUDY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Select>
            <FieldError message={state.fieldErrors?.study_level} />
          </FormField>

          <FormField label="Type d'examen" htmlFor="exam_type" required>
            <Select
              id="exam_type"
              name="exam_type"
              required
              defaultValue=""
              invalid={Boolean(state.fieldErrors?.exam_type)}
            >
              <option value="" disabled>
                Sélectionne le format
              </option>
              {EXAM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
            <FieldError message={state.fieldErrors?.exam_type} />
          </FormField>
        </div>
      </section>

      <Divider />

      {/* --- Section : examen --- */}
      <section className="space-y-4">
        <SectionTitle
          title="Ton examen"
          description="Tu pourras compléter ces infos plus tard si besoin."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Date de l'examen" htmlFor="exam_date" optional>
            <Input
              id="exam_date"
              name="exam_date"
              type="date"
              min={today}
              invalid={Boolean(state.fieldErrors?.exam_date)}
            />
            <FieldError message={state.fieldErrors?.exam_date} />
          </FormField>

          <FormField label="Objectif de note" htmlFor="target_grade" optional>
            <Select
              id="target_grade"
              name="target_grade"
              defaultValue=""
              invalid={Boolean(state.fieldErrors?.target_grade)}
            >
              <option value="">Aucun objectif précis</option>
              {TARGET_GRADES.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </Select>
            <FieldError message={state.fieldErrors?.target_grade} />
          </FormField>
        </div>
      </section>

      <Divider />

      {/* --- Section : organisation --- */}
      <section className="space-y-4">
        <SectionTitle
          title="Ton temps et ton niveau"
          description="Sert à adapter ton plan de révision et la difficulté de l'examen blanc."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Temps disponible par jour"
            htmlFor="available_time_per_day"
            optional
          >
            <Select
              id="available_time_per_day"
              name="available_time_per_day"
              defaultValue=""
              invalid={Boolean(state.fieldErrors?.available_time_per_day)}
            >
              <option value="">Pas encore défini</option>
              {AVAILABLE_TIMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
            <FieldError
              message={state.fieldErrors?.available_time_per_day}
            />
          </FormField>

          <FormField
            label="Niveau actuel estimé"
            htmlFor="current_level"
            optional
          >
            <Select
              id="current_level"
              name="current_level"
              defaultValue=""
              invalid={Boolean(state.fieldErrors?.current_level)}
            >
              <option value="">Préfère ne pas dire</option>
              {CURRENT_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </Select>
            <FieldError message={state.fieldErrors?.current_level} />
          </FormField>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        <SubmitButton
          pendingLabel="Création du projet…"
          className="sm:w-auto"
        >
          Créer et continuer
        </SubmitButton>
      </div>
    </form>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
        {icon && <span className="text-brand-600">{icon}</span>}
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      )}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-slate-100" />;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-danger-600">{message}</p>;
}
