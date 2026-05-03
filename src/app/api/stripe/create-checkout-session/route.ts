// =====================================================
// POST /api/stripe/create-checkout-session
// =====================================================
// Reçoit { plan: "pack" | "premium" }, vérifie l'auth,
// crée un Customer si besoin, génère une Checkout Session
// et renvoie l'URL Stripe à laquelle rediriger l'utilisateur.

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { publicEnv } from "@/lib/env";
import {
  getOrCreateStripeCustomerId,
  getStripe,
  isStripeReady,
  PLAN_MODES,
  priceIdForPlan,
} from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  plan: z.enum(["pack", "premium"]),
});

export async function POST(request: NextRequest) {
  if (!isStripeReady()) {
    return NextResponse.json(
      {
        error:
          "Les paiements ne sont pas encore activés. Reviens plus tard !",
      },
      { status: 503 },
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentification requise.", redirectTo: "/login" },
      { status: 401 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Plan invalide." },
      { status: 400 },
    );
  }
  const plan = parsed.data.plan;

  const priceId = priceIdForPlan(plan);
  if (!priceId) {
    return NextResponse.json(
      {
        error:
          "Ce plan n'est pas encore configuré. Contacte le support si le problème persiste.",
      },
      { status: 503 },
    );
  }

  try {
    const customerId = await getOrCreateStripeCustomerId({
      userId: user.id,
      email: user.email,
      fullName:
        (user.user_metadata?.full_name as string | undefined) ?? null,
    });

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: PLAN_MODES[plan],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${publicEnv.appUrl}/dashboard?checkout=success`,
      cancel_url: `${publicEnv.appUrl}/pricing?checkout=cancel`,
      metadata: {
        user_id: user.id,
        plan,
      },
      subscription_data:
        PLAN_MODES[plan] === "subscription"
          ? { metadata: { user_id: user.id, plan } }
          : undefined,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe n'a pas renvoyé d'URL de paiement." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[stripe:create-checkout-session]", e);
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Impossible de créer la session de paiement.",
      },
      { status: 500 },
    );
  }
}
