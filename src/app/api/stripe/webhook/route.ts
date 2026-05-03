// =====================================================
// POST /api/stripe/webhook
// =====================================================
// Vérifie la signature Stripe avec le raw body, puis met
// à jour profiles + subscriptions en fonction de l'event.
//
// /!\ Cette route est exclue du middleware (cf. src/middleware.ts)
// pour que le body brut nécessaire à la signature ne soit pas
// transformé en chemin.

import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { serverEnv } from "@/lib/env";
import {
  findUserIdByCustomerId,
  getStripe,
  isStripeReady,
  planForPriceId,
  setUserSubscriptionStatus,
  upsertSubscription,
  type PaidPlan,
} from "@/lib/stripe";
import type { SubscriptionStatus } from "@/types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HANDLED_EVENTS = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: NextRequest) {
  if (!isStripeReady()) {
    return new NextResponse("Stripe non configuré.", { status: 503 });
  }

  const webhookSecret = serverEnv.stripeWebhookSecret;
  if (!webhookSecret) {
    return new NextResponse("STRIPE_WEBHOOK_SECRET manquant.", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("Signature absente.", { status: 400 });
  }

  // /!\ Stripe a besoin du body brut, pas du JSON parsé.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  } catch (err) {
    console.error("[stripe:webhook] signature invalide", err);
    return new NextResponse("Signature invalide.", { status: 400 });
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionEvent(event);
        break;
    }
  } catch (err) {
    console.error("[stripe:webhook] handler error", err);
    return NextResponse.json(
      { error: "Erreur de traitement de l'événement." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}

// -----------------------------------------------------
// Handlers
// -----------------------------------------------------
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  // En "subscription" mode, l'event customer.subscription.created
  // arrive en parallèle. Ici on s'occupe surtout du cas "payment"
  // (Pack Examen) qui n'émet que checkout.session.completed.
  if (session.mode === "subscription") {
    // Le sync principal sera fait par customer.subscription.*
    return;
  }

  const userId = await resolveUserId(session);
  if (!userId) {
    console.warn("[stripe:webhook] checkout sans user_id résolvable");
    return;
  }

  const plan = (session.metadata?.plan as PaidPlan | undefined) ?? "pack";

  await setUserSubscriptionStatus(userId, plan as SubscriptionStatus);
  await upsertSubscription({
    userId,
    stripeSubscriptionId: null,
    status: session.payment_status ?? "paid",
    plan,
    currentPeriodEnd: null,
  });
}

async function handleSubscriptionEvent(
  event: Stripe.Event,
): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription;

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const userId = await findUserIdByCustomerId(customerId);
  if (!userId) {
    console.warn(
      "[stripe:webhook] subscription sans user_id résolvable :",
      customerId,
    );
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const plan: PaidPlan = planForPriceId(priceId) ?? "premium";

  // current_period_end est sur l'item dans l'API moderne, fallback sur
  // le top-level pour rester compatible avec les versions plus anciennes.
  const item = subscription.items.data[0];
  const periodEnd =
    item && "current_period_end" in item && typeof item.current_period_end === "number"
      ? item.current_period_end
      : ((subscription as unknown as { current_period_end?: number })
          .current_period_end ?? null);

  if (event.type === "customer.subscription.deleted") {
    await setUserSubscriptionStatus(userId, "free");
  } else if (subscription.status === "active" || subscription.status === "trialing") {
    await setUserSubscriptionStatus(userId, plan as SubscriptionStatus);
  } else if (
    subscription.status === "canceled" ||
    subscription.status === "incomplete_expired" ||
    subscription.status === "unpaid"
  ) {
    await setUserSubscriptionStatus(userId, "free");
  }

  await upsertSubscription({
    userId,
    stripeSubscriptionId: subscription.id,
    status: subscription.status,
    plan,
    currentPeriodEnd: periodEnd,
  });
}

async function resolveUserId(
  session: Stripe.Checkout.Session,
): Promise<string | null> {
  const fromMeta = session.metadata?.user_id;
  if (fromMeta) return fromMeta;

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id ?? null;
  if (!customerId) return null;
  return findUserIdByCustomerId(customerId);
}
