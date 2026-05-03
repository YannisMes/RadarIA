// =====================================================
// Endpoint de déconnexion
// =====================================================
// Accepte POST (formulaire) et GET (lien direct).

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function handle(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/`);
}

export { handle as GET, handle as POST };
