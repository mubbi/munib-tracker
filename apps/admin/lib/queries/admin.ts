import {
  type AdminRole,
  adminAuditLogTable,
  adminSessionsTable,
  adminUsersTable,
  cannedRepliesTable,
  cronRunsTable,
} from "@munib-tracker/db/schema";
import { count, desc, eq, ilike } from "drizzle-orm";
import { getDb } from "../db";
import { dateRangeOn, whereAll } from "../query-conditions";

export type AuditLogFilters = {
  from?: Date;
  to?: Date;
  action?: string;
  adminEmail?: string;
  targetType?: string;
};

export type CronRunFilters = {
  from?: Date;
  to?: Date;
  bucketId?: string;
  status?: string;
};

export type AdminUserFilters = {
  role?: AdminRole;
  enabled?: boolean;
};

export type AdminSessionFilters = {
  from?: Date;
  to?: Date;
};

export async function listAdminUsers(filters: AdminUserFilters = {}) {
  const db = getDb();
  const where = whereAll([
    filters.role ? eq(adminUsersTable.role, filters.role) : undefined,
    filters.enabled !== undefined ? eq(adminUsersTable.enabled, filters.enabled) : undefined,
  ]);
  return db.select().from(adminUsersTable).where(where).orderBy(adminUsersTable.email);
}

export async function listAdminSessions(filters: AdminSessionFilters = {}) {
  const db = getDb();
  const where = dateRangeOn(adminSessionsTable.lastUsedAt, filters.from, filters.to);
  return db
    .select({
      id: adminSessionsTable.id,
      adminUserId: adminSessionsTable.adminUserId,
      email: adminUsersTable.email,
      role: adminUsersTable.role,
      ipAddress: adminSessionsTable.ipAddress,
      userAgent: adminSessionsTable.userAgent,
      expiresAt: adminSessionsTable.expiresAt,
      lastUsedAt: adminSessionsTable.lastUsedAt,
      createdAt: adminSessionsTable.createdAt,
    })
    .from(adminSessionsTable)
    .innerJoin(adminUsersTable, eq(adminSessionsTable.adminUserId, adminUsersTable.id))
    .where(where)
    .orderBy(desc(adminSessionsTable.lastUsedAt))
    .limit(100);
}

export async function listAuditLog(limit = 100, offset = 0, filters: AuditLogFilters = {}) {
  const db = getDb();
  const trimmedEmail = filters.adminEmail?.trim();
  const where = whereAll([
    dateRangeOn(adminAuditLogTable.createdAt, filters.from, filters.to),
    filters.action ? eq(adminAuditLogTable.action, filters.action) : undefined,
    trimmedEmail ? ilike(adminAuditLogTable.adminEmail, `%${trimmedEmail}%`) : undefined,
    filters.targetType ? eq(adminAuditLogTable.targetType, filters.targetType) : undefined,
  ]);
  return db
    .select()
    .from(adminAuditLogTable)
    .where(where)
    .orderBy(desc(adminAuditLogTable.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getAuditActionCounts(filters: AuditLogFilters = {}) {
  const db = getDb();
  const trimmedEmail = filters.adminEmail?.trim();
  const where = whereAll([
    dateRangeOn(adminAuditLogTable.createdAt, filters.from, filters.to),
    filters.action ? eq(adminAuditLogTable.action, filters.action) : undefined,
    trimmedEmail ? ilike(adminAuditLogTable.adminEmail, `%${trimmedEmail}%`) : undefined,
    filters.targetType ? eq(adminAuditLogTable.targetType, filters.targetType) : undefined,
  ]);
  return db
    .select({ action: adminAuditLogTable.action, count: count() })
    .from(adminAuditLogTable)
    .where(where)
    .groupBy(adminAuditLogTable.action)
    .orderBy(desc(count()))
    .limit(8);
}

export async function listCannedReplies() {
  const db = getDb();
  return db.select().from(cannedRepliesTable).orderBy(cannedRepliesTable.title);
}

export async function listCronRuns(filters: CronRunFilters = {}, limit = 50) {
  const db = getDb();
  const where = whereAll([
    dateRangeOn(cronRunsTable.startedAt, filters.from, filters.to),
    filters.bucketId ? eq(cronRunsTable.bucketId, filters.bucketId) : undefined,
    filters.status ? eq(cronRunsTable.status, filters.status) : undefined,
  ]);
  return db
    .select()
    .from(cronRunsTable)
    .where(where)
    .orderBy(desc(cronRunsTable.startedAt))
    .limit(limit);
}
