"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { acceptInviteByCode, InviteError } from "@/lib/invites/accept";

export type AcceptInviteFormState = {
  error?: string;
};

export async function acceptInviteAction(
  _prev: AcceptInviteFormState,
  formData: FormData
): Promise<AcceptInviteFormState> {
  const user = await requireUser();
  const code = String(formData.get("code") ?? "");
  if (!code) return { error: "Missing invite code." };

  let result;
  try {
    result = await acceptInviteByCode(user.id, code);
  } catch (err) {
    if (err instanceof InviteError) return { error: err.message };
    return { error: err instanceof Error ? err.message : "Could not accept invite." };
  }

  revalidatePath("/app");
  redirect(`/app/trips/${result.tripId}`);
}
