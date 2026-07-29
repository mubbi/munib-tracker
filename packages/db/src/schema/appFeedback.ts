import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestampNow } from "./columnHelpers";
import { usersTable } from "./users";

export const appFeedbackTable = pgTable(
  "app_feedback",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    deviceId: text("deviceId").notNull(),
    rating: integer("rating").notNull(),
    message: text("message"),
    source: text("source").notNull(),
    triggerId: text("triggerId"),
    appVersion: text("appVersion").notNull(),
    platform: text("platform").notNull(),
    locale: text("locale"),
    createdAt: timestampNow("createdAt"),
  },
  (table) => [
    index("app_feedback_userId_createdAt_idx").on(table.userId, table.createdAt),
    index("app_feedback_createdAt_idx").on(table.createdAt),
  ],
);

export type AppFeedback = typeof appFeedbackTable.$inferSelect;
export type InsertAppFeedback = typeof appFeedbackTable.$inferInsert;
