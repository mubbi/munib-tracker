import { appFeedbackTable, usersTable } from "@munib-tracker/db/schema";
import { count, desc, eq, ilike, or, type SQL, sql } from "drizzle-orm";
import { getDb } from "../db";
import type { ClientPlatform } from "../filter-options";
import { dateRangeOn, whereAll } from "../query-conditions";

export type AppFeedbackFilters = {
  from?: Date;
  to?: Date;
  rating?: number;
  platform?: ClientPlatform;
  triggerId?: string;
  q?: string;
};

function appFeedbackWhere(filters: AppFeedbackFilters): SQL | undefined {
  const trimmedQ = filters.q?.trim();
  return whereAll([
    dateRangeOn(appFeedbackTable.createdAt, filters.from, filters.to),
    filters.rating !== undefined ? eq(appFeedbackTable.rating, filters.rating) : undefined,
    filters.platform ? eq(appFeedbackTable.platform, filters.platform) : undefined,
    filters.triggerId ? eq(appFeedbackTable.triggerId, filters.triggerId) : undefined,
    trimmedQ
      ? or(
          ilike(appFeedbackTable.message, `%${trimmedQ}%`),
          ilike(appFeedbackTable.deviceId, `%${trimmedQ}%`),
          ilike(usersTable.email, `%${trimmedQ}%`),
        )
      : undefined,
  ]);
}

export async function listAppFeedback(limit = 100, offset = 0, filters: AppFeedbackFilters = {}) {
  const db = getDb();
  const where = appFeedbackWhere(filters);
  return db
    .select({
      id: appFeedbackTable.id,
      deviceId: appFeedbackTable.deviceId,
      userId: appFeedbackTable.userId,
      userEmail: usersTable.email,
      rating: appFeedbackTable.rating,
      message: appFeedbackTable.message,
      source: appFeedbackTable.source,
      triggerId: appFeedbackTable.triggerId,
      appVersion: appFeedbackTable.appVersion,
      platform: appFeedbackTable.platform,
      locale: appFeedbackTable.locale,
      createdAt: appFeedbackTable.createdAt,
    })
    .from(appFeedbackTable)
    .leftJoin(usersTable, eq(appFeedbackTable.userId, usersTable.id))
    .where(where)
    .orderBy(desc(appFeedbackTable.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getAppFeedbackStats(filters: AppFeedbackFilters = {}) {
  const db = getDb();
  const where = appFeedbackWhere(filters);
  const [totals, byRating, byTrigger, byPlatform] = await Promise.all([
    db
      .select({
        total: count(),
        withMessage: sql<number>`count(*) filter (where ${appFeedbackTable.message} is not null and trim(${appFeedbackTable.message}) != '')`,
      })
      .from(appFeedbackTable)
      .leftJoin(usersTable, eq(appFeedbackTable.userId, usersTable.id))
      .where(where),
    db
      .select({ rating: appFeedbackTable.rating, count: count() })
      .from(appFeedbackTable)
      .leftJoin(usersTable, eq(appFeedbackTable.userId, usersTable.id))
      .where(where)
      .groupBy(appFeedbackTable.rating)
      .orderBy(appFeedbackTable.rating),
    db
      .select({ triggerId: appFeedbackTable.triggerId, count: count() })
      .from(appFeedbackTable)
      .leftJoin(usersTable, eq(appFeedbackTable.userId, usersTable.id))
      .where(where)
      .groupBy(appFeedbackTable.triggerId)
      .orderBy(desc(count())),
    db
      .select({ platform: appFeedbackTable.platform, count: count() })
      .from(appFeedbackTable)
      .leftJoin(usersTable, eq(appFeedbackTable.userId, usersTable.id))
      .where(where)
      .groupBy(appFeedbackTable.platform)
      .orderBy(desc(count())),
  ]);

  const row = totals[0];
  return {
    total: row?.total ?? 0,
    withMessage: row?.withMessage ?? 0,
    byRating,
    byTrigger,
    byPlatform,
  };
}
