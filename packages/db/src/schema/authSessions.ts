import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestampNow } from "./columnHelpers";
import { usersTable } from "./users";

export const authSessionsTable = pgTable(
  "auth_sessions",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    refreshToken: text("refreshToken").notNull().unique(),
    refreshExpiresAt: timestamp("refreshExpiresAt", { mode: "date" }).notNull(),
    createdAt: timestampNow("createdAt"),
  },
  (table) => [index("auth_sessions_userId_idx").on(table.userId)],
);

export type AuthSession = typeof authSessionsTable.$inferSelect;
