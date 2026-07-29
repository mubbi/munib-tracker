import {
  adminBroadcastsTable,
  appFeedbackTable,
  appVersionsTable,
  authSessionsTable,
  contentReportsTable,
  cronRunsTable,
  pushTokensTable,
  usersTable,
} from "@munib-tracker/db/schema";
import { and, count, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { getDb } from "../db";
import type { ClientPlatform } from "../filter-options";
import { dateRangeOn, whereAll } from "../query-conditions";

export type MetricsDateRange = {
  from?: Date;
  to?: Date;
};

export type DashboardMetricsFilters = MetricsDateRange & {
  platform?: ClientPlatform;
};

export type AuthAbuseFilters = MetricsDateRange & {
  ipPrefix?: string;
  platform?: ClientPlatform;
};

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/**
 * Munib executive dashboard KPIs — chart-friendly shape for the dashboard page.
 */
export async function getDashboardMetrics(range: DashboardMetricsFilters = {}) {
  const db = getDb();
  const since7d = daysAgo(7);
  const since30d = daysAgo(30);
  const platform = range.platform;

  const [
    userAgg,
    pendingReports,
    feedbackAgg,
    broadcastAgg,
    versionRows,
    localeDist,
    platformSessions,
    signupsByProvider,
    sessionActivity,
  ] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)`,
        guests: sql<number>`count(*) filter (where ${usersTable.accountType} = 'guest')`,
        linked: sql<number>`count(*) filter (where ${usersTable.accountType} = 'user')`,
        signups7d: sql<number>`count(*) filter (where ${usersTable.createdAt} >= ${since7d})`,
        signups30d: sql<number>`count(*) filter (where ${usersTable.createdAt} >= ${since30d})`,
      })
      .from(usersTable)
      .where(dateRangeOn(usersTable.createdAt, range.from, range.to)),
    db
      .select({ count: count() })
      .from(contentReportsTable)
      .where(inArray(contentReportsTable.status, ["pending", "in_review", "in_progress"])),
    db
      .select({
        last7d: sql<number>`count(*) filter (where ${appFeedbackTable.createdAt} >= ${since7d})`,
        last30d: sql<number>`count(*) filter (where ${appFeedbackTable.createdAt} >= ${since30d})`,
      })
      .from(appFeedbackTable),
    db
      .select({
        open: sql<number>`count(*) filter (where ${adminBroadcastsTable.status} in ('pending', 'scheduled'))`,
        processing: sql<number>`count(*) filter (where ${adminBroadcastsTable.status} = 'processing')`,
      })
      .from(adminBroadcastsTable),
    db.select({ count: count() }).from(appVersionsTable),
    db
      .select({ label: pushTokensTable.locale, count: count() })
      .from(pushTokensTable)
      .where(sql`${pushTokensTable.locale} is not null and trim(${pushTokensTable.locale}) <> ''`)
      .groupBy(pushTokensTable.locale)
      .orderBy(desc(count()))
      .limit(12),
    db
      .select({
        platform: pushTokensTable.clientPlatform,
        count: sql<number>`count(distinct ${pushTokensTable.userId})`,
      })
      .from(pushTokensTable)
      .where(
        whereAll([
          sql`${pushTokensTable.clientPlatform} is not null`,
          platform ? eq(pushTokensTable.clientPlatform, platform) : undefined,
        ]),
      )
      .groupBy(pushTokensTable.clientPlatform),
    db
      .select({ provider: usersTable.provider, count: count() })
      .from(usersTable)
      .where(and(eq(usersTable.accountType, "user"), sql`${usersTable.provider} is not null`))
      .groupBy(usersTable.provider),
    db
      .select({
        dau: sql<number>`count(distinct ${authSessionsTable.userId}) filter (where ${authSessionsTable.createdAt} >= ${daysAgo(1)})`,
        wau: sql<number>`count(distinct ${authSessionsTable.userId}) filter (where ${authSessionsTable.createdAt} >= ${since7d})`,
        mau: sql<number>`count(distinct ${authSessionsTable.userId}) filter (where ${authSessionsTable.createdAt} >= ${since30d})`,
      })
      .from(authSessionsTable),
  ]);

  const [users] = userAgg;
  const [reports] = pendingReports;
  const [feedback] = feedbackAgg;
  const [broadcasts] = broadcastAgg;
  const [versions] = versionRows;
  const [sessions] = sessionActivity;

  let periodSignups: number | undefined;
  let periodActiveUsers: number | undefined;
  if (range.from || range.to) {
    const [signupRow, activeRow] = await Promise.all([
      db
        .select({ count: count() })
        .from(usersTable)
        .where(dateRangeOn(usersTable.createdAt, range.from, range.to)),
      db
        .select({ count: sql<number>`count(distinct ${authSessionsTable.userId})` })
        .from(authSessionsTable)
        .where(dateRangeOn(authSessionsTable.createdAt, range.from, range.to)),
    ]);
    periodSignups = signupRow[0]?.count ?? 0;
    periodActiveUsers = Number(activeRow[0]?.count ?? 0);
  }

  return {
    totalUsers: Number(users?.total ?? 0),
    guestUsers: Number(users?.guests ?? 0),
    linkedUsers: Number(users?.linked ?? 0),
    signups7d: Number(users?.signups7d ?? 0),
    signups30d: Number(users?.signups30d ?? 0),
    pendingContentReports: reports?.count ?? 0,
    feedback7d: Number(feedback?.last7d ?? 0),
    feedback30d: Number(feedback?.last30d ?? 0),
    openBroadcasts: Number(broadcasts?.open ?? 0),
    processingBroadcasts: Number(broadcasts?.processing ?? 0),
    appVersionRows: versions?.count ?? 0,
    dau: Number(sessions?.dau ?? 0),
    wau: Number(sessions?.wau ?? 0),
    mau: Number(sessions?.mau ?? 0),
    localeDist: localeDist.map((r) => ({ label: r.label ?? "unknown", count: r.count })),
    platformSessions: platformSessions.map((r) => ({
      platform: r.platform ?? "unknown",
      count: Number(r.count ?? 0),
    })),
    signupsByProvider: signupsByProvider.map((r) => ({
      provider: r.provider ?? "unknown",
      count: r.count,
    })),
    periodSignups,
    periodActiveUsers,
  };
}

export async function getAppVersions() {
  const db = getDb();
  return db.select().from(appVersionsTable).orderBy(appVersionsTable.platform);
}

export async function getNotificationStats() {
  const db = getDb();
  const [pushTotal, pushByPlatform, openBroadcasts] = await Promise.all([
    db.select({ count: count() }).from(pushTokensTable),
    db
      .select({ platform: pushTokensTable.platform, count: count() })
      .from(pushTokensTable)
      .groupBy(pushTokensTable.platform),
    db
      .select({ count: count() })
      .from(adminBroadcastsTable)
      .where(inArray(adminBroadcastsTable.status, ["pending", "scheduled", "processing"])),
  ]);

  return {
    pushTotal: pushTotal[0]?.count ?? 0,
    pushByPlatform,
    openBroadcasts: openBroadcasts[0]?.count ?? 0,
  };
}

/** Auth session volume proxy — Munib has no refresh-token IP table yet. */
export async function getAuthAbuseStats(filters: AuthAbuseFilters = {}) {
  const db = getDb();
  const since7d = daysAgo(7);
  const [sessions7d, recentByDay] = await Promise.all([
    db
      .select({ count: count() })
      .from(authSessionsTable)
      .where(
        whereAll([
          gte(authSessionsTable.createdAt, since7d),
          dateRangeOn(authSessionsTable.createdAt, filters.from, filters.to),
        ]),
      ),
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${authSessionsTable.createdAt}), 'YYYY-MM-DD')`,
        count: count(),
      })
      .from(authSessionsTable)
      .where(gte(authSessionsTable.createdAt, since7d))
      .groupBy(sql`date_trunc('day', ${authSessionsTable.createdAt})`)
      .orderBy(sql`date_trunc('day', ${authSessionsTable.createdAt})`),
  ]);

  return {
    tokenReuseEvents: 0,
    sessions7d: sessions7d[0]?.count ?? 0,
    topIps: [] as { ipAddress: string | null; count: number }[],
    sessionsByDay: recentByDay,
    note: "IP-level abuse signals require enriching auth_sessions; showing session volume only.",
  };
}

export async function getAbuseSignals() {
  const db = getDb();
  const since1d = daysAgo(1);
  const since7d = daysAgo(7);
  const [reports, feedback] = await Promise.all([
    db
      .select({
        last24h: sql<number>`count(*) filter (where ${contentReportsTable.createdAt} >= ${since1d})`,
        last7d: sql<number>`count(*) filter (where ${contentReportsTable.createdAt} >= ${since7d})`,
        pending: sql<number>`count(*) filter (where ${contentReportsTable.status} in ('pending', 'in_review', 'in_progress'))`,
      })
      .from(contentReportsTable),
    db
      .select({
        last24h: sql<number>`count(*) filter (where ${appFeedbackTable.createdAt} >= ${since1d})`,
        last7d: sql<number>`count(*) filter (where ${appFeedbackTable.createdAt} >= ${since7d})`,
      })
      .from(appFeedbackTable),
  ]);

  return {
    reports24h: Number(reports[0]?.last24h ?? 0),
    reports7d: Number(reports[0]?.last7d ?? 0),
    pendingReports: Number(reports[0]?.pending ?? 0),
    feedback24h: Number(feedback[0]?.last24h ?? 0),
    feedback7d: Number(feedback[0]?.last7d ?? 0),
  };
}

export async function getMigrationJournalStatus(): Promise<{
  applied: number;
  latestAt: Date | null;
} | null> {
  const db = getDb();
  // TypeORM default migrations table (not Drizzle).
  try {
    const result = await db.execute(
      sql`select count(*)::int as applied, max(timestamp) as latest from migrations`,
    );
    const row = result.rows[0];
    if (!row) return null;
    const latestMs = row.latest != null ? Number(row.latest) : NaN;
    return {
      applied: Number(row.applied ?? 0),
      latestAt: Number.isFinite(latestMs) ? new Date(latestMs) : null,
    };
  } catch {
    return null;
  }
}

export async function getDashboardAlertSignals() {
  const db = getDb();
  const since1d = daysAgo(1);
  const since7d = daysAgo(7);
  const [reportRows, cronRows] = await Promise.all([
    db
      .select({
        last24h: sql<number>`count(*) filter (where ${contentReportsTable.createdAt} >= ${since1d})`,
        last7d: sql<number>`count(*) filter (where ${contentReportsTable.createdAt} >= ${since7d})`,
        pending: sql<number>`count(*) filter (where ${contentReportsTable.status} in ('pending', 'in_review', 'in_progress'))`,
      })
      .from(contentReportsTable),
    db.select({ latest: sql<Date | null>`max(${cronRunsTable.startedAt})` }).from(cronRunsTable),
  ]);
  const latest = cronRows[0]?.latest ?? null;
  const latestCronRunAt = latest ? new Date(latest) : null;
  return {
    reports24h: Number(reportRows[0]?.last24h ?? 0),
    reports7d: Number(reportRows[0]?.last7d ?? 0),
    pendingReports: Number(reportRows[0]?.pending ?? 0),
    latestCronRunAt,
    cronAgeMs: latestCronRunAt ? Date.now() - latestCronRunAt.getTime() : null,
  };
}
