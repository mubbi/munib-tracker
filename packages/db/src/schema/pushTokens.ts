import { index, pgTable, serial, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { timestampNowOptional } from "./columnHelpers";
import { usersTable } from "./users";

/** Platform: 'expo' = Expo push token; 'web' = Web Push subscription JSON. */
export const pushTokensTable = pgTable(
  "push_tokens",
  {
    id: serial("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    deviceId: text("deviceId"),
    /** 'expo' | 'web' */
    platform: text("platform").notNull().default("expo"),
    /** Optional app UI locale for broadcast targeting (e.g. en, ar, ur). */
    locale: text("locale"),
    /** Optional client OS: ios | android | web */
    clientPlatform: text("clientPlatform"),
    createdAt: timestampNowOptional("createdAt"),
    updatedAt: timestampNowOptional("updatedAt"),
  },
  (table) => [
    index("push_tokens_userId_idx").on(table.userId),
    uniqueIndex("push_tokens_user_device").on(table.userId, table.deviceId),
  ],
);

export type PushToken = typeof pushTokensTable.$inferSelect;
export type InsertPushToken = typeof pushTokensTable.$inferInsert;
