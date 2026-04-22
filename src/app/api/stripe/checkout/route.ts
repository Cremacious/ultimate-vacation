import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [row] = await db
    .select({ supporterEntitledAt: users.supporterEntitledAt })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (row?.supporterEntitledAt) {
    return NextResponse.json({ error: "already_supporter" }, { status: 409 });
  }

  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    success_url: `${baseUrl}/app/account/premium?success=1`,
    cancel_url: `${baseUrl}/app/account/premium`,
    customer_email: session.user.email,
    metadata: { userId: session.user.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
