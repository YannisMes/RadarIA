// =====================================================
// Callback Supabase Auth (PKCE / OAuth / email magic / reset)
// =====================================================
// Quand l'utilisateur clique sur le lien de confirmation
// envoyé par email (signup OU reset password), il revient
// sur cette URL avec ?code=... ou ?token_hash=...
// On échange le code contre une session puis on redirige
// vers `next` (par défaut : /dashboard).

import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") ?? "signup";
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = createSupabaseServerClient();

  // Cas 1 : flow PKCE classique (signup, reset)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Cas 2 : magic link / OTP via token_hash
  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      // Le type est validé par Supabase. On accepte les valeurs courantes.
      type: type as
        | "signup"
        | "email"
        | "recovery"
        | "invite"
        | "email_change",
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Echec : renvoi vers /login avec un message d'erreur.
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set(
    "message",
    "Le lien est invalide ou expiré. Connecte-toi pour réessayer.",
  );
  return NextResponse.redirect(loginUrl);
}
