"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signupAction } from "@/app/(auth)/actions";
import { initialAuthState } from "@/app/(auth)/types";

export function SignupForm() {
  const [state, formAction] = useFormState(signupAction, initialAuthState);

  return (
    <AuthCard
      title="Crée ton compte"
      description="Gratuit pour commencer · Pas de carte bancaire."
      footer={
        <>
          Déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Se connecter
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
          <Label htmlFor="fullName">Nom complet</Label>
          <div className="mt-1.5">
            <Input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              placeholder="Ton prénom et nom"
            />
          </div>
        </div>

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

        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <div className="mt-1.5">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="8 caractères minimum"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            8 caractères minimum.
          </p>
        </div>

        <SubmitButton pendingLabel="Création du compte…">
          Créer mon compte
        </SubmitButton>

        <p className="text-center text-xs text-slate-500">
          En continuant, tu acceptes nos{" "}
          <Link
            href="/legal/conditions"
            className="font-medium text-slate-700 hover:text-brand-700"
          >
            conditions d'utilisation
          </Link>{" "}
          et notre{" "}
          <Link
            href="/legal/confidentialite"
            className="font-medium text-slate-700 hover:text-brand-700"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </form>
    </AuthCard>
  );
}
