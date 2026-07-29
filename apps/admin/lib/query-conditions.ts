import { usersTable } from "@munib-tracker/db/schema";
import { and, gte, lte, type SQL, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

/** Linked (non-guest) users — default broadcast / KPI denominator. */
export const ACTIVE_USER_SQL = sql`${usersTable.accountType} = 'user'`;

export const GUEST_USER_SQL = sql`${usersTable.accountType} = 'guest'`;

export function whereAll(conditions: (SQL | undefined)[]): SQL | undefined {
  const valid = conditions.filter((c): c is SQL => c !== undefined);
  return valid.length > 0 ? and(...valid) : undefined;
}

export function dateRangeOn(column: PgColumn, from?: Date, to?: Date): SQL | undefined {
  return whereAll([from ? gte(column, from) : undefined, to ? lte(column, to) : undefined]);
}
