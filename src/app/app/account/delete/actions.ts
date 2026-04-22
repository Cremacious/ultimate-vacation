"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
import { deleteUserAccount } from "@/lib/account/deleteUserAccount";

export async function deleteAccountAction() {
  const user = await requireUser();
  await deleteUserAccount(user.id);
  // Sessions are hard-deleted by deleteUserAccount — cookie becomes invalid.
  // Redirect to public landing so the unauthenticated state resolves cleanly.
  redirect("/?account=deleted");
}
