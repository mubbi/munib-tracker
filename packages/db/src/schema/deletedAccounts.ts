import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Closure analytics for deleted accounts — no PII. Mirrors TypeORM `DeletedAccountEntity`. */
export const deletedAccountsTable = pgTable(
  "deleted_accounts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    formerUserId: uuid("formerUserId").notNull(),
    primaryReason: text("primaryReason").notNull(),
    details: text("details"),
    accountCreatedAt: timestamp("accountCreatedAt", { withTimezone: true, mode: "date" }),
    deletedAt: timestamp("deletedAt", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("IDX_deleted_accounts_deletedAt").on(table.deletedAt),
    index("IDX_deleted_accounts_primaryReason").on(table.primaryReason),
    index("IDX_deleted_accounts_formerUserId").on(table.formerUserId),
  ],
);

export type DeletedAccount = typeof deletedAccountsTable.$inferSelect;
export type InsertDeletedAccount = typeof deletedAccountsTable.$inferInsert;
