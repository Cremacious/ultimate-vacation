import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";

type NotificationInput = {
  userId: string;
  tripId?: string | null;
  type: string;
  payload: Record<string, unknown>;
};

export async function emitNotificationBulk(rows: NotificationInput[]): Promise<void> {
  if (rows.length === 0) return;
  await db.insert(notifications).values(
    rows.map((r) => ({
      userId: r.userId,
      tripId: r.tripId ?? null,
      type: r.type,
      payload: r.payload,
    }))
  );
}
