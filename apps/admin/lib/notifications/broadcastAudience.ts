import {
  type AdminBroadcastAudience,
  type AdminBroadcastFilters,
  usersTable,
} from "@munib-tracker/db/schema";
import {
  ADMIN_BROADCAST_SCHEDULE_WINDOW_MINUTES,
  isUserLocalWallClockDue,
  type ScheduledWallClock,
} from "@munib-tracker/shared/admin-broadcasts";
import { and, asc, count, gt, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  audienceWhereClause,
  buildAudienceUserSelect,
  normalizeBroadcastFilters,
} from "./broadcastFilters";

export type AudienceQueryOptions = {
  audience: AdminBroadcastAudience;
  filters?: AdminBroadcastFilters;
  dedupeKeyPrefix?: string;
  /** When set, only return users whose local time matches the wall clock window. */
  scheduledWallClock?: ScheduledWallClock | null;
  now?: Date;
};

function resolvedFilters(
  _audience: AdminBroadcastAudience,
  filters?: AdminBroadcastFilters,
): AdminBroadcastFilters {
  return normalizeBroadcastFilters(filters ?? {});
}

/** Count users matching audience + filters (optionally excluding already-delivered). */
export async function countAudienceUsers(options: AudienceQueryOptions): Promise<number> {
  const db = getDb();
  const filters = resolvedFilters(options.audience, options.filters);
  const where = audienceWhereClause(options.audience, filters);
  if (!where) return 0;

  const dedupe =
    options.dedupeKeyPrefix != null
      ? sql`not exists (
          select 1 from in_app_notifications ian
          where ian."userId" = ${usersTable.id}
            and ian."dedupeKey" like ${`${options.dedupeKeyPrefix}-%`}
        )`
      : undefined;

  const [row] = await db
    .select({ value: count() })
    .from(usersTable)
    .where(dedupe ? and(where, dedupe) : where);
  return Number(row?.value ?? 0);
}

async function fetchAudienceUserRows(
  options: AudienceQueryOptions,
  afterUserId: string,
  limit: number,
) {
  const db = getDb();
  const filters = resolvedFilters(options.audience, options.filters);
  const { where, timezoneExpr } = buildAudienceUserSelect(
    options.audience,
    filters,
    options.dedupeKeyPrefix,
  );

  // UUID text cursor: empty string = start; `id > cursor` lexicographic order.
  const cursor = afterUserId || "";

  const rows = await db
    .select({
      id: usersTable.id,
      timezone: timezoneExpr,
    })
    .from(usersTable)
    .where(and(where, gt(usersTable.id, cursor)))
    .orderBy(asc(usersTable.id))
    .limit(limit);

  const now = options.now ?? new Date();
  if (!options.scheduledWallClock) {
    return rows;
  }

  return rows.filter((row) =>
    isUserLocalWallClockDue(
      options.scheduledWallClock as ScheduledWallClock,
      row.timezone?.trim() || "UTC",
      now,
      ADMIN_BROADCAST_SCHEDULE_WINDOW_MINUTES,
    ),
  );
}

/** Paginate user ids for resumable batch delivery. Over-fetches when timezone filtering applies. */
export async function listAudienceUserIds(
  options: AudienceQueryOptions,
  afterUserId: string,
  limit: number,
): Promise<string[]> {
  const overfetch = options.scheduledWallClock ? Math.min(limit * 4, 1000) : limit;
  const rows = await fetchAudienceUserRows(options, afterUserId, overfetch);
  return rows.slice(0, limit).map((r) => r.id);
}

export { normalizeBroadcastFilters };
