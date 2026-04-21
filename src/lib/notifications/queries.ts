import { and, count, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";

export type NotificationRow = {
  id: string;
  tripId: string | null;
  type: string;
  payload: Record<string, unknown>;
  readAt: Date | null;
  createdAt: Date;
};

export async function getUnreadCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return row?.count ?? 0;
}

export async function listNotifications(
  userId: string,
  limit = 50
): Promise<NotificationRow[]> {
  const rows = await db
    .select({
      id: notifications.id,
      tripId: notifications.tripId,
      type: notifications.type,
      payload: notifications.payload,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
  return rows.map((r) => ({ ...r, payload: (r.payload ?? {}) as Record<string, unknown> }));
}
