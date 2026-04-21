import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/session";
import { uploadReceipt } from "@/lib/receipts/upload";

export const runtime = "nodejs"; // Vercel Blob `put` needs Node runtime

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const form = await req.formData();
    const expenseId = form.get("expenseId");
    const file = form.get("file");
    if (typeof expenseId !== "string" || !expenseId) {
      return NextResponse.json({ error: "Missing expenseId." }, { status: 400 });
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 });
    }
    const row = await uploadReceipt(user.id, { expenseId, file });
    return NextResponse.json({ receipt: row });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
