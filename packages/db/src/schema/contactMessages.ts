import { index, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestampNow } from "./columnHelpers";

export const CONTACT_MESSAGE_STATUSES = ["new", "in_progress", "closed"] as const;
export type ContactMessageStatus = (typeof CONTACT_MESSAGE_STATUSES)[number];

export const contactMessagesTable = pgTable(
  "contact_messages",
  {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    adminNotes: text("adminNotes"),
    ipAddress: varchar("ipAddress", { length: 64 }),
    userAgent: varchar("userAgent", { length: 512 }),
    createdAt: timestampNow("createdAt"),
    updatedAt: timestampNow("updatedAt"),
  },
  (table) => [
    index("contact_messages_email_createdAt_idx").on(table.email, table.createdAt),
    index("contact_messages_status_createdAt_idx").on(table.status, table.createdAt),
    index("contact_messages_createdAt_idx").on(table.createdAt),
  ],
);

export type ContactMessage = typeof contactMessagesTable.$inferSelect;
export type InsertContactMessage = typeof contactMessagesTable.$inferInsert;
