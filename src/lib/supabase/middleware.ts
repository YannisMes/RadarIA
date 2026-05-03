// =====================================================
// Helper Supabase pour le middleware Next.js
// =====================================================
// Rafraîchit la session via les cookies à chaque requête,
// puis renvoie une NextResponse à enchaîner.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database";
import { publicEnv } from "@/lib/env";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  // Si Supabase n'est pas configuré, on laisse passer pour ne pas
  // bloquer le développement local sans .env.local.
  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    return { response, user: null };
  }

  const supabase = createServerClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // /!\ Important : appel obligatoire pour rafraîchir le token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
