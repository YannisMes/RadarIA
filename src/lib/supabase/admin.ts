// =====================================================
// Client Supabase ADMIN (service_role)
// =====================================================
// /!\ DANGER : bypasse RLS. À n'utiliser QUE :
//   - dans les routes API serveur ;
//   - dans les server actions ;
//   - jamais dans un Client Component ;
//   - jamais avec des paramètres venant directement du client
//     sans validation préalable.

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { serverEnv } from "@/lib/env";

let _admin: ReturnType<typeof createClient<Database>> | null = null;

export function createSupabaseAdminClient() {
  if (_admin) return _admin;
  _admin = createClient<Database>(
    serverEnv.supabaseUrl,
    serverEnv.supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
  return _admin;
}
