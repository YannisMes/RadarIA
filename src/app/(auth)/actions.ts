"use server";

// =====================================================
// Server actions d'authentification
// =====================================================
// Centralise toutes les opérations auth (login/signup/reset).
// Renvoie un objet { error } ou redirige en cas de succès.

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { publicEnv } from "@/lib/env";

// -----------------------------------------------------
// Schémas
// -----------------------------------------------------
const emailSchema = z
  .string()
  .trim()
  .min(1, "Email requis")
  .email("Email invalide");

const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit faire au moins 8 caractères")
  .max(72, "Le mot de passe est trop long");

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis"),
  redirectTo: z.string().optional(),
});

const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Ton nom est trop court")
    .max(80, "Ton nom est trop long"),
  email: emailSchema,
  password: passwordSchema,
});

const resetSchema = z.object({
  email: emailSchema,
});

const updatePasswordSchema = z.object({
  password: passwordSchema,
});

// -----------------------------------------------------
// Helpers
// -----------------------------------------------------
function pickField(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

type ActionState = { error: string | null; success?: string | null };

const initial: ActionState = { error: null };

/**
 * Traduit une erreur Supabase brute en message FR convivial.
 */
function translateAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials"))
    return "Email ou mot de passe incorrect.";
  if (lower.includes("email not confirmed"))
    return "Ton email n'est pas encore confirmé. Vérifie ta boîte de réception.";
  if (lower.includes("user already registered"))
    return "Un compte existe déjà avec cet email. Connecte-toi à la place.";
  if (lower.includes("password should be at least"))
    return "Mot de passe trop court (8 caractères minimum).";
  if (lower.includes("rate limit") || lower.includes("too many"))
    return "Trop de tentatives. Réessaie dans quelques minutes.";
  return "Une erreur est survenue. Réessaie dans un instant.";
}

// -----------------------------------------------------
// LOGIN
// -----------------------------------------------------
export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: pickField(formData, "email"),
    password: pickField(formData, "password"),
    redirectTo: pickField(formData, "redirectTo"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect(parsed.data.redirectTo || "/dashboard");
}

// -----------------------------------------------------
// SIGNUP
// -----------------------------------------------------
export async function signupAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    fullName: pickField(formData, "fullName"),
    email: pickField(formData, "email"),
    password: pickField(formData, "password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Champs invalides." };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${publicEnv.appUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  // Si la confirmation email est désactivée côté Supabase, l'utilisateur
  // est déjà connecté → on l'envoie directement au dashboard.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  // Sinon on affiche un message de confirmation.
  return {
    error: null,
    success:
      "Compte créé. Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.",
  };
}

// -----------------------------------------------------
// REQUEST PASSWORD RESET
// -----------------------------------------------------
export async function requestResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = resetSchema.safeParse({
    email: pickField(formData, "email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Email invalide." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${publicEnv.appUrl}/auth/callback?next=/auth/reset-password`,
    },
  );

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  return {
    error: null,
    success:
      "Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.",
  };
}

// -----------------------------------------------------
// UPDATE PASSWORD (après reset)
// -----------------------------------------------------
export async function updatePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: pickField(formData, "password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Mot de passe invalide." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

// -----------------------------------------------------
// SIGN OUT (utilisé par /auth/signout)
// -----------------------------------------------------
export async function signOutAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export { initial as initialAuthState };
export type { ActionState as AuthActionState };
