import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { supporterEntitlements, users } from "@/lib/db/schema";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  // Raw body must be read before any parsing — required for Stripe signature verification.
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only grant entitlement for fully paid sessions.
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const userId = session.metadata?.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId in session metadata" },
        { status: 400 }
      );
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null);

    const now = new Date();

    // Insert audit record. Idempotent: partial unique index on (source, external_id)
    // WHERE external_id IS NOT NULL prevents duplicate rows on webhook retries.
    await db
      .insert(supporterEntitlements)
      .values({
        userId,
        source: "stripe_web",
        externalId: paymentIntentId,
        amountCents: session.amount_total ?? 499,
        currency: session.currency?.toUpperCase() ?? "USD",
        purchasedAt: now,
      })
      .onConflictDoNothing();

    // Mark user as supporter only if not already marked (idempotent on retries).
    await db
      .update(users)
      .set({ supporterEntitledAt: now, supporterSource: "stripe_web" })
      .where(and(eq(users.id, userId), isNull(users.supporterEntitledAt)));
  }

  return NextResponse.json({ received: true });
}
