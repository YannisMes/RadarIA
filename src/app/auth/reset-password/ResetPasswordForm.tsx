"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  updatePasswordAction,
  initialAuthState,
} from "@/app/(auth)/actions";

export function ResetPasswordForm() {
  const [state, formAction] = useFormState(
    updatePasswordAction,
    initialAuthState,
  );

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="border-b border-transparent">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Retour à l'accueil">
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <AuthCard
          title="Nouveau mot de passe"
          description="Choisis un mot de passe d'au moins 8 caractères."
        >
          <form action={formAction} className="space-y-4">
            {state.error && (
              <FormMessage variant="error">{state.error}</FormMessage>
            )}

            <div>
              <Label htmlFor="password">Nouveau mot de passe</Label>
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
            </div>

            <SubmitButton pendingLabel="Mise à jour…">
              Mettre à jour mon mot de passe
            </SubmitButton>
          </form>
        </AuthCard>
      </main>
    </div>
  );
}
