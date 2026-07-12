import {
  authSessionsTable,
  inAppNotificationsTable,
  pushTokensTable,
  usersTable,
} from "@munib-tracker/db/schema";
import { count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { AdminActionValidationError } from "../auth/action-guards";
import { getDb } from "../db";
import { dateRangeOn, whereAll } from "../query-conditions";
import { normalizeEmail } from "../utils";

export type UserSearchFilters = {
  from?: Date;
  to?: Date;
  provider?: string;
  accountType?: "guest" | "user";
};

export async function findUserIdByEmail(email: string): Promise<string | null> {
  const db = getDb();
  const normalized = normalizeEmail(email);
  const [row] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, normalized))
    .limit(1);
  return row?.id ?? null;
}

export async function requireUserExists(userId: string): Promise<void> {
  const db = getDb();
  const [row] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!row) {
    throw new AdminActionValidationError(`User ID ${userId} does not exist`);
  }
}

export async function findUserIdsByDeviceId(deviceId: string): Promise<string[]> {
  const db = getDb();
  const trimmed = deviceId.trim();
  const [fromUsers, fromPush] = await Promise.all([
    db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.deviceId, trimmed)),
    db
      .selectDistinct({ userId: pushTokensTable.userId })
      .from(pushTokensTable)
      .where(eq(pushTokensTable.deviceId, trimmed)),
  ]);
  const ids = new Set<string>();
  for (const row of fromUsers) ids.add(row.id);
  for (const row of fromPush) {
    if (row.userId) ids.add(row.userId);
  }
  return [...ids];
}

export async function getUserDetail(userId: string) {
  const db = getDb();
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) return null;

  const [sessions, pushTokens, notifications] = await Promise.all([
    db
      .select({
        id: authSessionsTable.id,
        createdAt: authSessionsTable.createdAt,
        refreshExpiresAt: authSessionsTable.refreshExpiresAt,
      })
      .from(authSessionsTable)
      .where(eq(authSessionsTable.userId, userId))
      .orderBy(desc(authSessionsTable.createdAt)),
    db.select().from(pushTokensTable).where(eq(pushTokensTable.userId, userId)),
    db
      .select({
        id: inAppNotificationsTable.id,
        kind: inAppNotificationsTable.kind,
        title: inAppNotificationsTable.title,
        createdAt: inAppNotificationsTable.createdAt,
        readAt: inAppNotificationsTable.readAt,
      })
      .from(inAppNotificationsTable)
      .where(eq(inAppNotificationsTable.userId, userId))
      .orderBy(desc(inAppNotificationsTable.createdAt))
      .limit(30),
  ]);

  return { user, sessions, pushTokens, notifications };
}

/** @deprecated Prefer getUserDetail */
export async function getUserExtendedDetail(userId: string) {
  return getUserDetail(userId);
}

export async function searchUsersExtended(
  query: string,
  limit = 50,
  offset = 0,
  filters: UserSearchFilters = {},
) {
  const db = getDb();
  const trimmed = query.trim();
  const trimmedProvider = filters.provider?.trim();

  const baseWhere = whereAll([
    dateRangeOn(usersTable.createdAt, filters.from, filters.to),
    filters.accountType ? eq(usersTable.accountType, filters.accountType) : undefined,
    trimmedProvider ? eq(usersTable.provider, trimmedProvider) : undefined,
  ]);

  if (!trimmed) {
    return db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        displayName: usersTable.displayName,
        accountType: usersTable.accountType,
        provider: usersTable.provider,
        deviceId: usersTable.deviceId,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(baseWhere)
      .orderBy(desc(usersTable.createdAt))
      .limit(limit)
      .offset(offset);
  }

  const deviceUserIds = trimmed.includes("@") ? [] : await findUserIdsByDeviceId(trimmed);
  const textConditions = [
    ilike(usersTable.email, `%${trimmed}%`),
    ilike(usersTable.displayName, `%${trimmed}%`),
    ilike(usersTable.deviceId, `%${trimmed}%`),
    eq(usersTable.id, trimmed),
  ];
  if (deviceUserIds.length > 0) {
    textConditions.push(
      sql`${usersTable.id} in (${sql.join(
        deviceUserIds.map((id) => sql`${id}`),
        sql`, `,
      )})`,
    );
  }

  return db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      displayName: usersTable.displayName,
      accountType: usersTable.accountType,
      provider: usersTable.provider,
      deviceId: usersTable.deviceId,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(whereAll([baseWhere, or(...textConditions)]))
    .orderBy(desc(usersTable.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function countUsersMatching(
  query: string,
  filters: UserSearchFilters = {},
): Promise<number> {
  const db = getDb();
  const trimmed = query.trim();
  const trimmedProvider = filters.provider?.trim();
  const baseWhere = whereAll([
    dateRangeOn(usersTable.createdAt, filters.from, filters.to),
    filters.accountType ? eq(usersTable.accountType, filters.accountType) : undefined,
    trimmedProvider ? eq(usersTable.provider, trimmedProvider) : undefined,
    trimmed
      ? or(
          ilike(usersTable.email, `%${trimmed}%`),
          ilike(usersTable.displayName, `%${trimmed}%`),
          ilike(usersTable.deviceId, `%${trimmed}%`),
          eq(usersTable.id, trimmed),
        )
      : undefined,
  ]);
  const [row] = await db.select({ count: count() }).from(usersTable).where(baseWhere);
  return row?.count ?? 0;
}
