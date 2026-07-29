import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { timestampNowOptional } from "./columnHelpers";
import { usersTable } from "./users";

export type InAppNotificationRouteData = Record<string, unknown>;

export const inAppNotificationsTable = pgTable(
  "in_app_notifications",
  {
    id: serial("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    subtitle: text("subtitle"),
    routeData: jsonb("routeData").$type<InAppNotificationRouteData>(),
    dedupeKey: text("dedupeKey"),
    broadcastId: integer("broadcastId"),
    readAt: timestamp("readAt", { mode: "date" }),
    clickedAt: timestamp("clickedAt", { mode: "date" }),
    createdAt: timestampNowOptional("createdAt"),
  },
  (table) => [
    index("in_app_notifications_userId_idx").on(table.userId),
    index("in_app_notifications_user_read_idx").on(table.userId, table.readAt),
    index("in_app_notifications_broadcastId_idx").on(table.broadcastId),
    uniqueIndex("in_app_notifications_user_dedupe").on(table.userId, table.dedupeKey),
  ],
);

export type InAppNotification = typeof inAppNotificationsTable.$inferSelect;
export type InsertInAppNotification = typeof inAppNotificationsTable.$inferInsert;
