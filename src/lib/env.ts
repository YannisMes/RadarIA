// =====================================================
// Validation des variables d'environnement
// =====================================================
// Centralise l'accès aux variables d'env et permet
// un échec contrôlé en cas de variable manquante.
//
// Côté serveur uniquement : ne JAMAIS importer dans
// un Client Component ou la fonction sera leakée.

function required(name: string, value: string | undefined): string {
  if (!value || value.length === 0) {
    throw new Error(
      `Variable d'environnement manquante : ${name}. Voir .env.example.`,
    );
  }
  return value;
}

function optional(value: string | undefined): string | undefined {
  if (!value || value.length === 0) return undefined;
  return value;
}

// Variables publiques (NEXT_PUBLIC_*) — utilisables côté client
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
};

// Variables serveur — getters pour échec à l'utilisation, pas à l'import
export const serverEnv = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL", publicEnv.supabaseUrl);
  },
  get supabaseAnonKey() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY", publicEnv.supabaseAnonKey);
  },
  get supabaseServiceRoleKey() {
    return required(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
  },
  get geminiApiKey() {
    return required("GEMINI_API_KEY", process.env.GEMINI_API_KEY);
  },
  get stripeSecretKey() {
    return optional(process.env.STRIPE_SECRET_KEY);
  },
  get stripeWebhookSecret() {
    return optional(process.env.STRIPE_WEBHOOK_SECRET);
  },
  get stripePricePackExam() {
    return optional(process.env.STRIPE_PRICE_PACK_EXAM);
  },
  get stripePricePremiumMonthly() {
    return optional(process.env.STRIPE_PRICE_PREMIUM_MONTHLY);
  },
};

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET,
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}
