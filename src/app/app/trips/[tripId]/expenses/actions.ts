"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { createExpenseForTrip } from "@/lib/expenses/create";

export type CreateExpenseFormState = {
  error?: string;
  ok?: boolean;
};

export async function createExpenseAction(
  _prev: CreateExpenseFormState,
  formData: FormData
): Promise<CreateExpenseFormState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  const description = String(formData.get("description") ?? "");
  const amountDollars = Number(formData.get("amount"));
  const payerId = String(formData.get("payerId") ?? "");
  const participantIds = formData.getAll("participantIds").map(String).filter(Boolean);
  const category = String(formData.get("category") ?? "general");

  if (!tripId) return { error: "Missing trip." };
  if (!Number.isFinite(amountDollars) || amountDollars <= 0) {
    return { error: "Enter a positive amount." };
  }

  // Dollar input → cents. Round to nearest cent to avoid float drift.
  const amountCents = Math.round(amountDollars * 100);

  try {
    await createExpenseForTrip(user.id, tripId, {
      amountCents,
      description,
      payerId,
      participantIds,
      category,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not add expense." };
  }

  revalidatePath(`/app/trips/${tripId}/expenses`);
  revalidatePath(`/app/trips/${tripId}`);
  return { ok: true };
}
