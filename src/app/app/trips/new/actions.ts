"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { createTripForUser } from "@/lib/trips/create";

export type CreateTripFormState = {
  error?: string;
};

export async function createTripAction(
  _prev: CreateTripFormState,
  formData: FormData
): Promise<CreateTripFormState> {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "");
  const startDate = String(formData.get("startDate") ?? "") || null;
  const endDate = String(formData.get("endDate") ?? "") || null;
  const ballColor = String(formData.get("ballColor") ?? "") || "#00A8CC";

  let trip;
  try {
    trip = await createTripForUser(user.id, { name, startDate, endDate, ballColor });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not create trip." };
  }

  revalidatePath("/app");
  redirect(`/app/trips/${trip.id}`);
}
