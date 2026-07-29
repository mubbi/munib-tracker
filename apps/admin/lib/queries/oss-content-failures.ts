import { ossContentDownloadFailuresTable, usersTable } from "@munib-tracker/db/schema";
import { count, desc, eq, ilike, or, type SQL, sql } from "drizzle-orm";
import { getDb } from "../db";
import type { ClientPlatform } from "../filter-options";
import { dateRangeOn, whereAll } from "../query-conditions";

export type OssContentFailureFilters = {
  from?: Date;
  to?: Date;
  contentKind?: string;
  errorCode?: string;
  sourceProvider?: string;
  platform?: ClientPlatform;
  q?: string;
};

function ossFailureWhere(filters: OssContentFailureFilters): SQL | undefined {
  const trimmedQ = filters.q?.trim();
  return whereAll([
    dateRangeOn(ossContentDownloadFailuresTable.createdAt, filters.from, filters.to),
    filters.contentKind
      ? eq(ossContentDownloadFailuresTable.contentKind, filters.contentKind)
      : undefined,
    filters.errorCode
      ? eq(ossContentDownloadFailuresTable.errorCode, filters.errorCode)
      : undefined,
    filters.sourceProvider
      ? eq(ossContentDownloadFailuresTable.sourceProvider, filters.sourceProvider)
      : undefined,
    filters.platform ? eq(ossContentDownloadFailuresTable.platform, filters.platform) : undefined,
    trimmedQ
      ? or(
          ilike(ossContentDownloadFailuresTable.contentKey, `%${trimmedQ}%`),
          ilike(ossContentDownloadFailuresTable.sourceUrl, `%${trimmedQ}%`),
          ilike(ossContentDownloadFailuresTable.errorMessage, `%${trimmedQ}%`),
          ilike(ossContentDownloadFailuresTable.sourceProvider, `%${trimmedQ}%`),
          ilike(usersTable.email, `%${trimmedQ}%`),
          sql`${ossContentDownloadFailuresTable.contentMeta}::text ilike ${`%${trimmedQ}%`}`,
        )
      : undefined,
  ]);
}

export async function listOssContentFailures(
  limit = 100,
  offset = 0,
  filters: OssContentFailureFilters = {},
) {
  const db = getDb();
  const where = ossFailureWhere(filters);
  return db
    .select({
      id: ossContentDownloadFailuresTable.id,
      userId: ossContentDownloadFailuresTable.userId,
      userEmail: usersTable.email,
      contentKind: ossContentDownloadFailuresTable.contentKind,
      contentKey: ossContentDownloadFailuresTable.contentKey,
      sourceProvider: ossContentDownloadFailuresTable.sourceProvider,
      sourceUrl: ossContentDownloadFailuresTable.sourceUrl,
      contentMeta: ossContentDownloadFailuresTable.contentMeta,
      errorCode: ossContentDownloadFailuresTable.errorCode,
      errorMessage: ossContentDownloadFailuresTable.errorMessage,
      httpStatus: ossContentDownloadFailuresTable.httpStatus,
      appVersion: ossContentDownloadFailuresTable.appVersion,
      platform: ossContentDownloadFailuresTable.platform,
      locale: ossContentDownloadFailuresTable.locale,
      translationLocale: ossContentDownloadFailuresTable.translationLocale,
      createdAt: ossContentDownloadFailuresTable.createdAt,
    })
    .from(ossContentDownloadFailuresTable)
    .leftJoin(usersTable, eq(ossContentDownloadFailuresTable.userId, usersTable.id))
    .where(where)
    .orderBy(desc(ossContentDownloadFailuresTable.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getOssContentFailureById(id: string) {
  const db = getDb();
  const rows = await db
    .select({
      id: ossContentDownloadFailuresTable.id,
      userId: ossContentDownloadFailuresTable.userId,
      userEmail: usersTable.email,
      contentKind: ossContentDownloadFailuresTable.contentKind,
      contentKey: ossContentDownloadFailuresTable.contentKey,
      sourceProvider: ossContentDownloadFailuresTable.sourceProvider,
      sourceUrl: ossContentDownloadFailuresTable.sourceUrl,
      contentMeta: ossContentDownloadFailuresTable.contentMeta,
      errorCode: ossContentDownloadFailuresTable.errorCode,
      errorMessage: ossContentDownloadFailuresTable.errorMessage,
      httpStatus: ossContentDownloadFailuresTable.httpStatus,
      appVersion: ossContentDownloadFailuresTable.appVersion,
      platform: ossContentDownloadFailuresTable.platform,
      locale: ossContentDownloadFailuresTable.locale,
      translationLocale: ossContentDownloadFailuresTable.translationLocale,
      createdAt: ossContentDownloadFailuresTable.createdAt,
    })
    .from(ossContentDownloadFailuresTable)
    .leftJoin(usersTable, eq(ossContentDownloadFailuresTable.userId, usersTable.id))
    .where(eq(ossContentDownloadFailuresTable.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function getOssContentFailureStats(filters: OssContentFailureFilters = {}) {
  const db = getDb();
  const where = ossFailureWhere(filters);
  const [totals, byKind, byError, byProvider] = await Promise.all([
    db
      .select({ total: count() })
      .from(ossContentDownloadFailuresTable)
      .leftJoin(usersTable, eq(ossContentDownloadFailuresTable.userId, usersTable.id))
      .where(where),
    db
      .select({
        contentKind: ossContentDownloadFailuresTable.contentKind,
        count: count(),
      })
      .from(ossContentDownloadFailuresTable)
      .leftJoin(usersTable, eq(ossContentDownloadFailuresTable.userId, usersTable.id))
      .where(where)
      .groupBy(ossContentDownloadFailuresTable.contentKind)
      .orderBy(desc(count())),
    db
      .select({
        errorCode: ossContentDownloadFailuresTable.errorCode,
        count: count(),
      })
      .from(ossContentDownloadFailuresTable)
      .leftJoin(usersTable, eq(ossContentDownloadFailuresTable.userId, usersTable.id))
      .where(where)
      .groupBy(ossContentDownloadFailuresTable.errorCode)
      .orderBy(desc(count())),
    db
      .select({
        sourceProvider: ossContentDownloadFailuresTable.sourceProvider,
        count: count(),
      })
      .from(ossContentDownloadFailuresTable)
      .leftJoin(usersTable, eq(ossContentDownloadFailuresTable.userId, usersTable.id))
      .where(where)
      .groupBy(ossContentDownloadFailuresTable.sourceProvider)
      .orderBy(desc(count())),
  ]);

  return {
    total: totals[0]?.total ?? 0,
    byKind,
    byError,
    byProvider,
  };
}
