"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { requestResetAction } from "@/app/(auth)/actions";
import { initialAuthState } from "@/app/(auth)/types";

export function ForgotPasswordForm() {
  const [state, formAction] = useFormState(
    requestResetAction,
    initialAuthState,
  );

  return (
    <AuthCard
      title="Mot de passe oublié"
      description="Entre ton email pour recevoir un lien de réinitialisation."
      footer={
        <>
          <Link
            href="/login"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Retour à la connexion
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        {state.success && (
          <FormMessage variant="success">{state.success}</FormMessage>
        )}

        {state.error && (
          <FormMessage variant="error">{state.error}</FormMessage>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <div className="mt-1.5">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="ton@email.com"
            />
          </div>
        </div>

        <SubmitButton pendingLabel="Envoi en cours…">
          Envoyer le lien
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
