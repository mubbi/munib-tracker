import { type AdminBroadcast, inAppNotificationsTable } from "@munib-tracker/db/schema";
import { IN_APP_NOTIFICATION_MAX_ITEMS } from "@munib-tracker/shared/admin-broadcasts";
import { and, inArray, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { ADMIN_ANNOUNCEMENT_KIND } from "./broadcastConstants";

function dedupeKeyForUser(prefix: string, userId: string): string {
  return `${prefix}-${userId}`;
}

async function trimInAppNotificationsForUsers(userIds: readonly string[]): Promise<void> {
  if (userIds.length === 0) return;
  const db = getDb();
  // Keep the newest N notifications per user (Munib camelCase columns).
  await db.execute(sql`
    delete from in_app_notifications ian
    where ian."userId" in (${sql.join(
      userIds.map((id) => sql`${id}`),
      sql`, `,
    )})
    and ian.id not in (
      select id from (
        select id,
          row_number() over (partition by "userId" order by "createdAt" desc nulls last, id desc) as rn
        from in_app_notifications
        where "userId" in (${sql.join(
          userIds.map((id) => sql`${id}`),
          sql`, `,
        )})
      ) ranked
      where rn <= ${IN_APP_NOTIFICATION_MAX_ITEMS}
    )
  `);
}

/** Bulk insert in-app rows for a batch; returns userId → notification id map. */
export async function bulkInsertInAppNotifications(
  userIds: readonly string[],
  broadcast: AdminBroadcast,
): Promise<Map<string, number>> {
  const idsByUser = new Map<string, number>();
  if (userIds.length === 0) return idsByUser;

  const db = getDb();
  const routeData = {
    ...(broadcast.routeData ?? {}),
    broadcastId: broadcast.id,
  };

  const values = userIds.map((userId) => ({
    userId,
    kind: ADMIN_ANNOUNCEMENT_KIND,
    title: broadcast.title,
    body: broadcast.body,
    subtitle: broadcast.subtitle ?? null,
    routeData,
    broadcastId: broadcast.id,
    dedupeKey: dedupeKeyForUser(broadcast.dedupeKeyPrefix, userId),
  }));

  const inserted = await db
    .insert(inAppNotificationsTable)
    .values(values)
    .onConflictDoNothing({
      target: [inAppNotificationsTable.userId, inAppNotificationsTable.dedupeKey],
    })
    .returning({ id: inAppNotificationsTable.id, userId: inAppNotificationsTable.userId });

  for (const row of inserted) {
    idsByUser.set(row.userId, row.id);
  }

  if (inserted.length < userIds.length) {
    const missing = userIds.filter((id) => !idsByUser.has(id));
    if (missing.length > 0) {
      const existing = await db
        .select({
          id: inAppNotificationsTable.id,
          userId: inAppNotificationsTable.userId,
        })
        .from(inAppNotificationsTable)
        .where(
          and(
            inArray(inAppNotificationsTable.userId, [...missing]),
            inArray(
              inAppNotificationsTable.dedupeKey,
              missing.map((userId) => dedupeKeyForUser(broadcast.dedupeKeyPrefix, userId)),
            ),
          ),
        );
      for (const row of existing) {
        idsByUser.set(row.userId, row.id);
      }
    }
  }

  await trimInAppNotificationsForUsers(userIds);
  return idsByUser;
}
