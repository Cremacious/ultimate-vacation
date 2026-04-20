"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/session";
import { createInviteForTrip } from "@/lib/invites/create";

export type CreateInviteFormState = {
  error?: string;
  createdCode?: string;
};

export async function createInviteAction(
  _prev: CreateInviteFormState,
  formData: FormData
): Promise<CreateInviteFormState> {
  const user = await requireUser();
  const tripId = String(formData.get("tripId") ?? "");
  if (!tripId) return { error: "Missing trip." };

  try {
    const invite = await createInviteForTrip(user.id, tripId);
    revalidatePath(`/app/trips/${tripId}/invite`);
    return { createdCode: invite.code };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not create invite." };
  }
}
