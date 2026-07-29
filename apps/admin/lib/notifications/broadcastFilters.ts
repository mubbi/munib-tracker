import {
  type AdminBroadcastAudience,
  type AdminBroadcastFilters,
  authSessionsTable,
  pushTokensTable,
  usersTable,
} from "@munib-tracker/db/schema";
import type { AdminBroadcastPlatform } from "@munib-tracker/shared/admin-broadcasts";
import { canonicalBroadcastFilters } from "@munib-tracker/shared/admin-broadcasts";
import { and, eq, exists, notExists, type SQL, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";

/** Linked (non-guest) product users only. */
const LINKED_USER_SQL = eq(usersTable.accountType, "user");

function buildFilterConditions(filters: AdminBroadcastFilters): SQL[] {
  const db = getDb();
  const conditions: SQL[] = [];

  if (filters.locales?.length) {
    const locales = filters.locales.map((l) => l.trim()).filter(Boolean);
    if (locales.length > 0) {
      conditions.push(
        exists(
          db
            .select({ id: pushTokensTable.id })
            .from(pushTokensTable)
            .where(
              and(
                eq(pushTokensTable.userId, usersTable.id),
                sql`${pushTokensTable.locale} in (${sql.join(
                  locales.map((locale) => sql`${locale}`),
                  sql`, `,
                )})`,
              ),
            ),
        ),
      );
    }
  }

  if (filters.activeWithinDays != null && filters.activeWithinDays > 0) {
    const days = Math.floor(filters.activeWithinDays);
    conditions.push(
      exists(
        db
          .select({ id: authSessionsTable.id })
          .from(authSessionsTable)
          .where(
            and(
              eq(authSessionsTable.userId, usersTable.id),
              sql`${authSessionsTable.createdAt} >= now() - (${days}::int * interval '1 day')`,
            ),
          ),
      ),
    );
  }

  if (filters.inactiveForDays != null && filters.inactiveForDays > 0) {
    const days = Math.floor(filters.inactiveForDays);
    conditions.push(
      notExists(
        db
          .select({ id: authSessionsTable.id })
          .from(authSessionsTable)
          .where(
            and(
              eq(authSessionsTable.userId, usersTable.id),
              sql`${authSessionsTable.createdAt} >= now() - (${days}::int * interval '1 day')`,
            ),
          ),
      ),
    );
  }

  if (filters.platforms?.length) {
    const platforms = filters.platforms.filter(
      (p): p is AdminBroadcastPlatform => p === "ios" || p === "android" || p === "web",
    );
    if (platforms.length > 0) {
      conditions.push(
        exists(
          db
            .select({ id: pushTokensTable.id })
            .from(pushTokensTable)
            .where(
              and(
                eq(pushTokensTable.userId, usersTable.id),
                sql`${pushTokensTable.clientPlatform} in (${sql.join(
                  platforms.map((p) => sql`${p}`),
                  sql`, `,
                )})`,
              ),
            ),
        ),
      );
    }
  }

  return conditions;
}

/** Audience filter SQL — Munib only supports `all_linked`. */
export function audienceWhereClause(
  _audience: AdminBroadcastAudience,
  filters: AdminBroadcastFilters,
): SQL | undefined {
  return and(LINKED_USER_SQL, ...buildFilterConditions(filters));
}

export function notYetDeliveredSql(dedupeKeyPrefix: string): SQL {
  return sql`not exists (
    select 1 from in_app_notifications ian
    where ian."userId" = ${usersTable.id}
      and ian."dedupeKey" like ${`${dedupeKeyPrefix}-%`}
  )`;
}

export function buildAudienceUserSelect(
  audience: AdminBroadcastAudience,
  filters: AdminBroadcastFilters,
  dedupeKeyPrefix?: string,
) {
  const conditions = [
    audienceWhereClause(audience, filters),
    dedupeKeyPrefix ? notYetDeliveredSql(dedupeKeyPrefix) : undefined,
  ].filter((c): c is SQL => c !== undefined);

  return {
    where: conditions.length > 0 ? and(...conditions) : undefined,
    /** Munib has no per-user timezone column — user_local schedules use UTC. */
    timezoneExpr: sql<string>`'UTC'`,
  };
}

export function normalizeBroadcastFilters(raw: AdminBroadcastFilters): AdminBroadcastFilters {
  return canonicalBroadcastFilters(raw);
}
