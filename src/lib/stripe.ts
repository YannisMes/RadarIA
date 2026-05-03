// =====================================================
// Stripe — client + helpers
// =====================================================
// /!\ Module server-only. Tous les usages passent par le
// service role pour écrire dans `stripe_customers` /
// `subscriptions` / `profiles` (RLS empêche les utilisateurs
// d'écrire dedans directement).

import "server-only";
import Stripe from "stripe";
import { serverEnv, isStripeConfigured } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types/database";

let cached: Stripe | null = null;

/**
 * Singleton Stripe. Throw si la clé n'est pas définie (les
 * routes API doivent court-circuiter avant via isStripeReady()).
 */
export function getStripe(): Stripe {
  if (cached) return cached;
  const key = serverEnv.stripeSecretKey;
  if (!key) {
    throw new Error(
      "Stripe non configuré : STRIPE_SECRET_KEY manquant dans .env.local.",
    );
  }
  cached = new Stripe(key, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
    appInfo: { name: "RadarIA" },
  });
  return cached;
}

export function isStripeReady(): boolean {
  return isStripeConfigured();
}

// -----------------------------------------------------
// Mapping plans ↔ price IDs
// -----------------------------------------------------
export type PaidPlan = SubscriptionPlan; // "pack" | "premium"

export const PLAN_MODES: Record<PaidPlan, "payment" | "subscription"> = {
  pack: "payment",
  premium: "subscription",
};

export function priceIdForPlan(plan: PaidPlan): string | null {
  if (plan === "pack") return serverEnv.stripePricePackExam ?? null;
  if (plan === "premium") return serverEnv.stripePricePremiumMonthly ?? null;
  return null;
}

export function planForPriceId(priceId: string | null | undefined): PaidPlan | null {
  if (!priceId) return null;
  if (priceId === serverEnv.stripePricePackExam) return "pack";
  if (priceId === serverEnv.stripePricePremiumMonthly) return "premium";
  return null;
}

// -----------------------------------------------------
// stripe_customers <-> users
// -----------------------------------------------------
interface UserRefForCustomer {
  userId: string;
  email: string | null | undefined;
  fullName?: string | null;
}

/**
 * Récupère ou crée un customer Stripe pour un utilisateur donné,
 * et garde le mapping en DB. Idempotent.
 */
export async function getOrCreateStripeCustomerId(
  user: UserRefForCustomer,
): Promise<string> {
  const admin = createSupabaseAdminClient();

  const { data: existingRaw } = await admin
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", user.userId)
    .maybeSingle();
  const existing = existingRaw as { stripe_customer_id: string } | null;
  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id;
  }

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.fullName ?? undefined,
    metadata: { user_id: user.userId },
  });

  await admin
    .from("stripe_customers")
    .insert({
      user_id: user.userId,
      stripe_customer_id: customer.id,
    } as never);

  // Sync rapide sur profiles aussi.
  await admin
    .from("profiles")
    .update({ stripe_customer_id: customer.id } as never)
    .eq("id", user.userId);

  return customer.id;
}

// -----------------------------------------------------
// Sync profile / subscriptions depuis un événement Stripe
// -----------------------------------------------------
export async function setUserSubscriptionStatus(
  userId: string,
  status: SubscriptionStatus,
): Promise<void> {
  const admin = createSupabaseAdminClient();
  await admin
    .from("profiles")
    .update({ subscription_status: status } as never)
    .eq("id", userId);
}

export async function upsertSubscription(input: {
  userId: string;
  stripeSubscriptionId: string | null;
  status: string;
  plan: PaidPlan;
  currentPeriodEnd: number | null; // unix seconds
}): Promise<void> {
  const admin = createSupabaseAdminClient();
  const periodEnd =
    typeof input.currentPeriodEnd === "number"
      ? new Date(input.currentPeriodEnd * 1000).toISOString()
      : null;

  if (input.stripeSubscriptionId) {
    // Subscription Stripe : on upsert sur l'id Stripe.
    const { data: existingRaw } = await admin
      .from("subscriptions")
      .select("id")
      .eq("stripe_subscription_id", input.stripeSubscriptionId)
      .maybeSingle();
    const existing = existingRaw as { id: string } | null;

    if (existing) {
      await admin
        .from("subscriptions")
        .update({
          status: input.status,
          plan: input.plan,
          current_period_end: periodEnd,
        } as never)
        .eq("id", existing.id);
      return;
    }
  }

  // Sinon insertion directe (cas pack one-shot).
  await admin.from("subscriptions").insert({
    user_id: input.userId,
    stripe_subscription_id: input.stripeSubscriptionId,
    status: input.status,
    plan: input.plan,
    current_period_end: periodEnd,
  } as never);
}

export async function findUserIdByCustomerId(
  customerId: string,
): Promise<string | null> {
  const admin = createSupabaseAdminClient();
  const { data: rawData } = await admin
    .from("stripe_customers")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  const data = rawData as { user_id: string } | null;
  return data?.user_id ?? null;
}
