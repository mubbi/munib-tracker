import type { OssContentDownloadFailureMeta } from "@munib-tracker/shared/types/oss-content-download-failure";
import { index, integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { timestampNow } from "./columnHelpers";
import { usersTable } from "./users";

export const ossContentDownloadFailuresTable = pgTable(
  "oss_content_download_failures",
  {
    id: uuid("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    contentKind: text("contentKind").notNull(),
    contentKey: text("contentKey").notNull(),
    sourceProvider: text("sourceProvider").notNull(),
    sourceUrl: text("sourceUrl").notNull(),
    contentMeta: jsonb("contentMeta").$type<OssContentDownloadFailureMeta>().notNull(),
    errorCode: text("errorCode").notNull(),
    errorMessage: text("errorMessage").notNull(),
    httpStatus: integer("httpStatus"),
    appVersion: text("appVersion").notNull(),
    platform: text("platform").notNull(),
    locale: text("locale"),
    translationLocale: text("translationLocale"),
    createdAt: timestampNow("createdAt"),
  },
  (table) => [
    index("oss_failures_kind_created_idx").on(table.contentKind, table.createdAt),
    index("oss_failures_key_created_idx").on(table.contentKey, table.createdAt),
    index("oss_failures_provider_created_idx").on(table.sourceProvider, table.createdAt),
    index("oss_failures_created_idx").on(table.createdAt),
  ],
);

export type OssContentDownloadFailure = typeof ossContentDownloadFailuresTable.$inferSelect;
export type InsertOssContentDownloadFailure = typeof ossContentDownloadFailuresTable.$inferInsert;
