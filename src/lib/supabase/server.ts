// =====================================================
// Client Supabase côté serveur (RSC, Server Actions, Routes)
// =====================================================
// Utilise les cookies pour porter la session de l'utilisateur.
// /!\ Toujours créer une nouvelle instance par requête (cookies()).

import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { serverEnv } from "@/lib/env";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    serverEnv.supabaseUrl,
    serverEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          // En RSC ("read-only cookies"), set() peut throw : on ignore
          // car le middleware se charge de rafraîchir la session.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* RSC read-only cookies, OK */
          }
        },
      },
    },
  );
}
