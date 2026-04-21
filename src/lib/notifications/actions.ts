"use server";

import { and, eq, isNull } from "drizzle-orm";

import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { getUnreadCount, listNotifications } from "./queries";

export type SerializedNotification = {
  id: string;
  tripId: string | null;
  type: string;
  payload: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

export async function fetchNotificationsForUser(): Promise<SerializedNotification[]> {
  const user = await requireUser();
  const rows = await listNotifications(user.id);
  return rows.map((n) => ({
    id: n.id,
    tripId: n.tripId,
    type: n.type,
    payload: n.payload as Record<string, unknown>,
    readAt: n.readAt?.toISOString() ?? null,
    createdAt: n.createdAt.toISOString(),
  }));
}

export async function fetchUnreadCountAction(): Promise<number> {
  const user = await requireUser();
  return getUnreadCount(user.id);
}

export async function markAllReadAction(): Promise<void> {
  const user = await requireUser();
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, user.id), isNull(notifications.readAt)));
}
