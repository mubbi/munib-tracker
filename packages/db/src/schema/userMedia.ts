import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestampNow } from "./columnHelpers";
import { usersTable } from "./users";

export const userMediaTable = pgTable(
  "user_media",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    mimeType: text("mimeType").notNull(),
    filename: text("filename").notNull(),
    sizeBytes: integer("sizeBytes").notNull(),
    storagePath: text("storagePath").notNull(),
    createdAt: timestampNow("createdAt"),
  },
  (table) => [index("user_media_userId_createdAt_idx").on(table.userId, table.createdAt)],
);

export type UserMedia = typeof userMediaTable.$inferSelect;
