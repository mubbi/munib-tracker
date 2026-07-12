import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestampNow } from "./columnHelpers";

/**
 * Mirrors TypeORM `UserEntity` — camelCase column names as created by Munib migrations.
 * User primary keys are UUIDs (not serial ints).
 */
export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(),
    accountType: text("accountType").notNull().$type<"guest" | "user">(),
    provider: text("provider"),
    providerAccountId: text("providerAccountId"),
    email: text("email"),
    displayName: text("displayName"),
    deviceId: text("deviceId"),
    reviewReactivationLastWindowKey: text("reviewReactivationLastWindowKey"),
    createdAt: timestampNow("createdAt"),
    updatedAt: timestampNow("updatedAt"),
  },
  (table) => [index("users_email_idx").on(table.email)],
);

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
