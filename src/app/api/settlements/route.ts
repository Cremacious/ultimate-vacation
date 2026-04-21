import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/session";
import { createSettlement } from "@/lib/settlements/create";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = (await req.json()) as {
      tripId?: string;
      fromUserId?: string;
      toUserId?: string;
      amountCents?: number;
      note?: string;
    };
    if (!body.tripId || !body.fromUserId || !body.toUserId || !body.amountCents) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const row = await createSettlement(user.id, {
      tripId: body.tripId,
      fromUserId: body.fromUserId,
      toUserId: body.toUserId,
      amountCents: body.amountCents,
      note: body.note,
    });
    return NextResponse.json({ settlement: row });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Settlement failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
