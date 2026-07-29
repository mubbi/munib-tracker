import { type AdminBroadcast, adminBroadcastsTable } from "@munib-tracker/db/schema";
import { BROADCAST_USER_BATCH_SIZE, isBroadcastScheduleReady } from "@munib-tracker/shared";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { countAudienceUsers, listAudienceUserIds } from "./broadcastAudience";
import {
  audienceOptionsForBroadcast,
  markBroadcastCompleted,
  markBroadcastFailed,
  markBroadcastProcessingIfNeeded,
  resolveBroadcastCompletion,
  updateBroadcastBatchProgress,
} from "./broadcastCompletion";
import { bulkInsertInAppNotifications } from "./broadcastInAppWriter";
import { loadPushTargetsForUsers } from "./broadcastPushLoader";
import { sendBroadcastPush } from "./pushDelivery";

export type BroadcastBatchResult = {
  done: boolean;
  broadcast: AdminBroadcast;
  waiting?: boolean;
};

export { isBroadcastScheduleReady };

/** Process the next batch for a broadcast. Safe to call repeatedly until `done`. */
export async function processBroadcastBatch(broadcastId: number): Promise<BroadcastBatchResult> {
  const db = getDb();
  const [broadcast] = await db
    .select()
    .from(adminBroadcastsTable)
    .where(eq(adminBroadcastsTable.id, broadcastId))
    .limit(1);

  if (!broadcast) {
    throw new Error("Broadcast not found");
  }
  if (broadcast.status === "completed" || broadcast.status === "cancelled") {
    return { done: true, broadcast };
  }
  if (broadcast.status === "failed") {
    throw new Error(broadcast.errorMessage ?? "Broadcast failed");
  }

  const now = new Date();
  if (!isBroadcastScheduleReady(broadcast, now)) {
    return { done: false, broadcast, waiting: true };
  }

  if (broadcast.status === "scheduled" || broadcast.status === "pending") {
    await markBroadcastProcessingIfNeeded(broadcast, broadcastId, now);
  }

  const audienceOpts = audienceOptionsForBroadcast(broadcast);
  const userIds = await listAudienceUserIds(
    audienceOpts,
    broadcast.cursorUserId,
    BROADCAST_USER_BATCH_SIZE,
  );

  if (userIds.length === 0) {
    const undelivered = await countAudienceUsers({
      ...audienceOpts,
      scheduledWallClock: undefined,
    });
    if (undelivered === 0) {
      const completed = await markBroadcastCompleted(broadcastId, broadcast);
      return { done: true, broadcast: completed };
    }
    if (broadcast.scheduleMode === "user_local") {
      return { done: false, broadcast, waiting: true };
    }
    const completed = await markBroadcastCompleted(broadcastId, broadcast);
    return { done: true, broadcast: completed };
  }

  let inAppSent = 0;
  let pushExpoSent = 0;
  let pushWebSent = 0;
  let pushFailed = 0;
  let inAppIdsByUserId = new Map<string, number>();

  try {
    const pushRouteData = {
      ...(broadcast.routeData ?? {}),
      broadcastId: broadcast.id,
    };

    if (broadcast.sendInApp) {
      inAppIdsByUserId = await bulkInsertInAppNotifications(userIds, broadcast);
      inAppSent = inAppIdsByUserId.size;
    }

    if (broadcast.sendPush) {
      const tokenRows = await loadPushTargetsForUsers(userIds);
      const pushStats = await sendBroadcastPush(tokenRows, {
        title: broadcast.title,
        body: broadcast.body,
        subtitle: broadcast.subtitle ?? undefined,
        routeData: pushRouteData,
        collapseId: broadcast.dedupeKeyPrefix,
        inAppIdsByUserId: broadcast.sendInApp ? inAppIdsByUserId : undefined,
      });
      pushExpoSent = pushStats.expoSent;
      pushWebSent = pushStats.webSent;
      pushFailed = pushStats.failed;
    }

    const lastUserId = userIds[userIds.length - 1];
    const updated =
      (await updateBroadcastBatchProgress(
        broadcastId,
        lastUserId,
        userIds.length,
        inAppSent,
        pushExpoSent,
        pushWebSent,
        pushFailed,
      )) ?? broadcast;

    const nextCursor = lastUserId ?? broadcast.cursorUserId;
    const completion = await resolveBroadcastCompletion(updated, audienceOpts, nextCursor);
    return {
      done: completion.done,
      waiting: completion.waiting,
      broadcast: completion.broadcast,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Broadcast batch failed";
    await markBroadcastFailed(broadcastId, message);
    throw new Error(message);
  }
}
