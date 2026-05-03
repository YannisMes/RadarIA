// =====================================================
// Client Supabase côté navigateur
// =====================================================
// À importer dans des Client Components uniquement.
// Utilise la clé anon (publique) — RLS protège les données.

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { publicEnv } from "@/lib/env";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
  );
}
