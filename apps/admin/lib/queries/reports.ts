import {
  contentReportAttachmentsTable,
  contentReportsTable,
  usersTable,
} from "@munib-tracker/db/schema";
import type { ContentReportStatus } from "@munib-tracker/shared/types/content-report";
import { count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { getDb } from "../db";
import { dateRangeOn, whereAll } from "../query-conditions";

export type ContentReportFilters = {
  status?: string;
  issueType?: string;
  userId?: string;
  q?: string;
  from?: Date;
  to?: Date;
};

function reportsWhere(filters: ContentReportFilters): SQL | undefined {
  const trimmedQ = filters.q?.trim();
  return whereAll([
    filters.status ? eq(contentReportsTable.status, filters.status) : undefined,
    filters.issueType ? eq(contentReportsTable.issueType, filters.issueType) : undefined,
    filters.userId ? eq(contentReportsTable.userId, filters.userId) : undefined,
    dateRangeOn(contentReportsTable.createdAt, filters.from, filters.to),
    trimmedQ
      ? or(
          ilike(contentReportsTable.description, `%${trimmedQ}%`),
          ilike(contentReportsTable.userReference, `%${trimmedQ}%`),
          ilike(usersTable.email, `%${trimmedQ}%`),
          eq(contentReportsTable.id, trimmedQ),
        )
      : undefined,
  ]);
}

export async function listContentReports(
  limit = 50,
  offset = 0,
  filters: ContentReportFilters = {},
) {
  const db = getDb();
  const where = reportsWhere(filters);
  return db
    .select({
      id: contentReportsTable.id,
      userId: contentReportsTable.userId,
      userEmail: usersTable.email,
      status: contentReportsTable.status,
      issueType: contentReportsTable.issueType,
      description: contentReportsTable.description,
      appVersion: contentReportsTable.appVersion,
      platform: contentReportsTable.platform,
      createdAt: contentReportsTable.createdAt,
      updatedAt: contentReportsTable.updatedAt,
      resolvedAt: contentReportsTable.resolvedAt,
    })
    .from(contentReportsTable)
    .leftJoin(usersTable, eq(contentReportsTable.userId, usersTable.id))
    .where(where)
    .orderBy(desc(contentReportsTable.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function countContentReports(filters: ContentReportFilters = {}): Promise<number> {
  const db = getDb();
  const where = reportsWhere(filters);
  const [row] = await db
    .select({ count: count() })
    .from(contentReportsTable)
    .leftJoin(usersTable, eq(contentReportsTable.userId, usersTable.id))
    .where(where);
  return row?.count ?? 0;
}

export async function getContentReport(id: string) {
  const db = getDb();
  const [report] = await db
    .select({
      id: contentReportsTable.id,
      userId: contentReportsTable.userId,
      userEmail: usersTable.email,
      status: contentReportsTable.status,
      issueType: contentReportsTable.issueType,
      description: contentReportsTable.description,
      suggestedCorrection: contentReportsTable.suggestedCorrection,
      userReference: contentReportsTable.userReference,
      content: contentReportsTable.content,
      appVersion: contentReportsTable.appVersion,
      platform: contentReportsTable.platform,
      adminNotes: contentReportsTable.adminNotes,
      resolvedAt: contentReportsTable.resolvedAt,
      createdAt: contentReportsTable.createdAt,
      updatedAt: contentReportsTable.updatedAt,
    })
    .from(contentReportsTable)
    .leftJoin(usersTable, eq(contentReportsTable.userId, usersTable.id))
    .where(eq(contentReportsTable.id, id))
    .limit(1);

  if (!report) return null;

  const attachments = await db
    .select()
    .from(contentReportAttachmentsTable)
    .where(eq(contentReportAttachmentsTable.reportId, id))
    .orderBy(desc(contentReportAttachmentsTable.createdAt));

  return { report, attachments };
}

export async function updateContentReportStatus(
  id: string,
  input: { status: ContentReportStatus; adminNotes?: string | null },
) {
  const db = getDb();
  const resolvedStatuses = new Set(["completed", "cancelled", "spam"]);
  const [row] = await db
    .update(contentReportsTable)
    .set({
      status: input.status,
      adminNotes: input.adminNotes === undefined ? undefined : input.adminNotes,
      updatedAt: new Date(),
      resolvedAt: resolvedStatuses.has(input.status) ? new Date() : null,
    })
    .where(eq(contentReportsTable.id, id))
    .returning({ id: contentReportsTable.id });
  return row ?? null;
}

export async function getContentReportStatusCounts() {
  const db = getDb();
  return db
    .select({ status: contentReportsTable.status, count: count() })
    .from(contentReportsTable)
    .groupBy(contentReportsTable.status)
    .orderBy(desc(count()));
}
