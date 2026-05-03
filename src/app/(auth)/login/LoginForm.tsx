"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { AuthCard } from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  loginAction,
  initialAuthState,
} from "@/app/(auth)/actions";

interface LoginFormProps {
  redirectTo?: string;
  initialMessage?: string;
}

export function LoginForm({ redirectTo, initialMessage }: LoginFormProps) {
  const [state, formAction] = useFormState(loginAction, initialAuthState);

  return (
    <AuthCard
      title="Bon retour 👋"
      description="Connecte-toi pour reprendre tes révisions."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link
            href="/signup"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Crée-en un
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        {redirectTo && (
          <input type="hidden" name="redirectTo" value={redirectTo} />
        )}

        {initialMessage && !state.error && (
          <FormMessage variant="success">{initialMessage}</FormMessage>
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

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Oublié ?
            </Link>
          </div>
          <div className="mt-1.5">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>
        </div>

        <SubmitButton pendingLabel="Connexion en cours…">
          Se connecter
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
