import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { timestampNow } from "./columnHelpers";
import { usersTable } from "./users";

export const contentReportsTable = pgTable(
  "content_reports",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    status: text("status").notNull(),
    issueType: text("issueType").notNull(),
    description: text("description").notNull(),
    suggestedCorrection: text("suggestedCorrection"),
    userReference: text("userReference"),
    content: jsonb("content").$type<Record<string, unknown>>().notNull(),
    appVersion: text("appVersion"),
    platform: text("platform"),
    adminNotes: text("adminNotes"),
    resolvedAt: timestamp("resolvedAt", { mode: "date" }),
    createdAt: timestampNow("createdAt"),
    updatedAt: timestampNow("updatedAt"),
  },
  (table) => [
    index("content_reports_userId_createdAt_idx").on(table.userId, table.createdAt),
    index("content_reports_status_idx").on(table.status),
  ],
);

export const contentReportAttachmentsTable = pgTable("content_report_attachments", {
  id: uuid("id").primaryKey(),
  reportId: uuid("reportId")
    .notNull()
    .references(() => contentReportsTable.id, { onDelete: "cascade" }),
  mimeType: text("mimeType").notNull(),
  filename: text("filename").notNull(),
  sizeBytes: integer("sizeBytes").notNull(),
  storagePath: text("storagePath").notNull(),
  createdAt: timestampNow("createdAt"),
});

export type ContentReport = typeof contentReportsTable.$inferSelect;
export type ContentReportAttachment = typeof contentReportAttachmentsTable.$inferSelect;
