// =====================================================
// Helpers d'auth côté serveur
// =====================================================
// À utiliser dans les RSC, server actions et route handlers.

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Garantit qu'un utilisateur est authentifié, sinon redirige vers /login
 * en conservant la cible d'origine.
 */
export async function requireUser(redirectTo?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    const search = redirectTo
      ? `?redirectTo=${encodeURIComponent(redirectTo)}`
      : "";
    redirect(`/login${search}`);
  }
  return user;
}
