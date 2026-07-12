import { type AdminBroadcast, adminBroadcastsTable } from "@munib-tracker/db/schema";
import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  type AudienceQueryOptions,
  countAudienceUsers,
  listAudienceUserIds,
} from "./broadcastAudience";

export async function markBroadcastProcessingIfNeeded(
  broadcast: AdminBroadcast,
  broadcastId: number,
  now: Date,
): Promise<AdminBroadcast> {
  if (broadcast.status === "processing") return broadcast;
  const db = getDb();
  const [updated] = await db
    .update(adminBroadcastsTable)
    .set({ status: "processing", startedAt: now })
    .where(eq(adminBroadcastsTable.id, broadcastId))
    .returning();
  return updated ?? broadcast;
}

export async function updateBroadcastBatchProgress(
  broadcastId: number,
  lastUserId: string,
  userCount: number,
  inAppSent: number,
  pushExpoSent: number,
  pushWebSent: number,
  pushFailed: number,
): Promise<AdminBroadcast | undefined> {
  const db = getDb();
  const [updated] = await db
    .update(adminBroadcastsTable)
    .set({
      cursorUserId: lastUserId,
      usersProcessed: sql`${adminBroadcastsTable.usersProcessed} + ${userCount}`,
      inAppSent: sql`${adminBroadcastsTable.inAppSent} + ${inAppSent}`,
      pushExpoSent: sql`${adminBroadcastsTable.pushExpoSent} + ${pushExpoSent}`,
      pushWebSent: sql`${adminBroadcastsTable.pushWebSent} + ${pushWebSent}`,
      pushFailed: sql`${adminBroadcastsTable.pushFailed} + ${pushFailed}`,
    })
    .where(eq(adminBroadcastsTable.id, broadcastId))
    .returning();
  return updated;
}

export async function markBroadcastCompleted(
  broadcastId: number,
  fallback: AdminBroadcast,
): Promise<AdminBroadcast> {
  const db = getDb();
  const [completed] = await db
    .update(adminBroadcastsTable)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(adminBroadcastsTable.id, broadcastId))
    .returning();
  return completed ?? fallback;
}

export async function markBroadcastFailed(broadcastId: number, message: string): Promise<void> {
  const db = getDb();
  await db
    .update(adminBroadcastsTable)
    .set({ status: "failed", errorMessage: message, completedAt: new Date() })
    .where(eq(adminBroadcastsTable.id, broadcastId));
}

/** Decide whether the broadcast has finished or is waiting (user-local window). */
export async function resolveBroadcastCompletion(
  broadcast: AdminBroadcast,
  audienceOpts: AudienceQueryOptions,
  nextCursor: string,
): Promise<{ done: boolean; waiting: boolean; broadcast: AdminBroadcast }> {
  const moreUsers = await listAudienceUserIds(audienceOpts, nextCursor, 1);
  if (moreUsers.length > 0) {
    return { done: false, waiting: false, broadcast };
  }

  const undelivered = await countAudienceUsers({
    ...audienceOpts,
    scheduledWallClock: undefined,
  });
  if (undelivered === 0) {
    const completed = await markBroadcastCompleted(broadcast.id, broadcast);
    return { done: true, waiting: false, broadcast: completed };
  }
  if (broadcast.scheduleMode === "user_local") {
    return { done: false, waiting: true, broadcast };
  }
  const completed = await markBroadcastCompleted(broadcast.id, broadcast);
  return { done: true, waiting: false, broadcast: completed };
}

export function audienceOptionsForBroadcast(broadcast: AdminBroadcast): AudienceQueryOptions {
  return {
    audience: broadcast.audience,
    filters: broadcast.filters ?? {},
    dedupeKeyPrefix: broadcast.dedupeKeyPrefix,
    scheduledWallClock:
      broadcast.scheduleMode === "user_local" ? (broadcast.scheduledWallClock ?? null) : null,
  };
}
