import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const syncRecordsTable = pgTable(
  "sync_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    entity: text("entity").notNull(),
    recordId: text("recordId").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
    deletedAt: timestamp("deletedAt", { mode: "date" }),
  },
  (table) => [
    index("sync_records_userId_idx").on(table.userId),
    index("sync_records_entity_idx").on(table.entity),
  ],
);

export type SyncRecord = typeof syncRecordsTable.$inferSelect;
