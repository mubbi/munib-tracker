import { BROADCAST_BATCH_GUARD } from "@munib-tracker/shared";
import { NextResponse } from "next/server";
import { requirePageSession } from "@/lib/auth/guards";
import { assertModuleAccess } from "@/lib/auth/module-guard";
import { processBroadcastBatch } from "@/lib/notifications/broadcastProcessor";
import { canSendBroadcasts } from "@/lib/permissions";

export const maxDuration = 60;

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext): Promise<NextResponse> {
  const session = await requirePageSession();
  assertModuleAccess(session.role, "/notifications");
  if (!canSendBroadcasts(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: raw } = await context.params;
  const broadcastId = Number(raw);
  if (!Number.isFinite(broadcastId) || broadcastId <= 0) {
    return NextResponse.json({ error: "Invalid broadcast id" }, { status: 400 });
  }

  try {
    let result = await processBroadcastBatch(broadcastId);
    let guard = 1;
    while (!result.done && result.waiting !== true && guard < BROADCAST_BATCH_GUARD) {
      guard += 1;
      result = await processBroadcastBatch(broadcastId);
    }

    return NextResponse.json({
      done: result.done,
      waiting: result.waiting === true,
      batchesProcessed: guard,
      broadcast: {
        id: result.broadcast.id,
        status: result.broadcast.status,
        usersProcessed: result.broadcast.usersProcessed,
        totalUsers: result.broadcast.totalUsers,
        inAppSent: result.broadcast.inAppSent,
        pushExpoSent: result.broadcast.pushExpoSent,
        pushWebSent: result.broadcast.pushWebSent,
        pushFailed: result.broadcast.pushFailed,
        openedCount: result.broadcast.openedCount,
        clickedCount: result.broadcast.clickedCount,
        errorMessage: result.broadcast.errorMessage,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Broadcast processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
