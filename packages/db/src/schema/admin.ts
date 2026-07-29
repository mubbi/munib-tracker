import type {
  AdminBroadcastAudience,
  AdminBroadcastCategory,
  AdminBroadcastFilters,
  AdminBroadcastLinkType,
  AdminBroadcastScheduleMode,
  AdminBroadcastStatus,
  ScheduledWallClock,
} from "@munib-tracker/shared/admin-broadcasts";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { timestampNow } from "./columnHelpers";

export const ADMIN_ROLES = ["super_admin", "support", "analytics", "ops", "content"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

/** Google OAuth allowlist — only pre-provisioned emails may sign in. */
export const adminUsersTable = pgTable(
  "admin_users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    role: text("role").$type<AdminRole>().notNull(),
    enabled: boolean("enabled").notNull().default(true),
    createdByAdminId: integer("created_by_admin_id"),
    createdAt: timestampNow("created_at"),
    updatedAt: timestampNow("updated_at"),
  },
  (table) => [
    index("admin_users_email_idx").on(table.email),
    index("admin_users_role_idx").on(table.role),
  ],
);

export const adminSessionsTable = pgTable(
  "admin_sessions",
  {
    id: serial("id").primaryKey(),
    adminUserId: integer("admin_user_id")
      .notNull()
      .references(() => adminUsersTable.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestampNow("created_at"),
    lastUsedAt: timestamp("last_used_at", { mode: "date" }),
  },
  (table) => [
    index("admin_sessions_admin_user_id_idx").on(table.adminUserId),
    index("admin_sessions_expires_at_idx").on(table.expiresAt),
  ],
);

export const adminAuditLogTable = pgTable(
  "admin_audit_log",
  {
    id: serial("id").primaryKey(),
    adminUserId: integer("admin_user_id").references(() => adminUsersTable.id, {
      onDelete: "set null",
    }),
    adminEmail: text("admin_email").notNull(),
    adminRole: text("admin_role").$type<AdminRole>().notNull(),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    ipAddress: text("ip_address"),
    createdAt: timestampNow("created_at"),
  },
  (table) => [
    index("admin_audit_log_created_at_idx").on(table.createdAt),
    index("admin_audit_log_action_idx").on(table.action),
    index("admin_audit_log_admin_email_idx").on(table.adminEmail),
  ],
);

export const cronRunsTable = pgTable(
  "cron_runs",
  {
    id: serial("id").primaryKey(),
    bucketId: text("bucket_id").notNull(),
    status: text("status").notNull(),
    jobIds: jsonb("job_ids").$type<string[]>().default([]),
    durationMs: integer("duration_ms"),
    errorMessage: text("error_message"),
    startedAt: timestampNow("started_at"),
    finishedAt: timestamp("finished_at", { mode: "date" }),
  },
  (table) => [
    index("cron_runs_bucket_id_idx").on(table.bucketId),
    index("cron_runs_started_at_idx").on(table.startedAt),
  ],
);

export const cannedRepliesTable = pgTable("canned_replies", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestampNow("created_at"),
  updatedAt: timestampNow("updated_at"),
});

/**
 * Admin broadcasts. `cursorUserId` is a UUID string (empty = start) because Munib
 * product users use UUID primary keys.
 */
export const adminBroadcastsTable = pgTable(
  "admin_broadcasts",
  {
    id: serial("id").primaryKey(),
    status: text("status").$type<AdminBroadcastStatus>().notNull().default("pending"),
    category: text("category").$type<AdminBroadcastCategory>().notNull(),
    audience: text("audience").$type<AdminBroadcastAudience>().notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    subtitle: text("subtitle"),
    routeData: jsonb("route_data").$type<Record<string, unknown>>(),
    filters: jsonb("filters").$type<AdminBroadcastFilters>().notNull().default({}),
    scheduleMode: text("schedule_mode")
      .$type<AdminBroadcastScheduleMode>()
      .notNull()
      .default("immediate"),
    scheduledAt: timestamp("scheduled_at", { mode: "date" }),
    scheduledWallClock: jsonb("scheduled_wall_clock").$type<ScheduledWallClock>(),
    linkType: text("link_type").$type<AdminBroadcastLinkType>().notNull().default("none"),
    externalUrl: text("external_url"),
    sendInApp: boolean("send_in_app").notNull().default(true),
    sendPush: boolean("send_push").notNull().default(true),
    dedupeKeyPrefix: text("dedupe_key_prefix").notNull(),
    cursorUserId: text("cursor_user_id").notNull().default(""),
    totalUsers: integer("total_users"),
    usersProcessed: integer("users_processed").notNull().default(0),
    inAppSent: integer("in_app_sent").notNull().default(0),
    pushExpoSent: integer("push_expo_sent").notNull().default(0),
    pushWebSent: integer("push_web_sent").notNull().default(0),
    pushFailed: integer("push_failed").notNull().default(0),
    openedCount: integer("opened_count").notNull().default(0),
    clickedCount: integer("clicked_count").notNull().default(0),
    errorMessage: text("error_message"),
    createdByAdminId: integer("created_by_admin_id").references(() => adminUsersTable.id, {
      onDelete: "set null",
    }),
    createdByEmail: text("created_by_email").notNull(),
    startedAt: timestamp("started_at", { mode: "date" }),
    completedAt: timestamp("completed_at", { mode: "date" }),
    createdAt: timestampNow("created_at"),
  },
  (table) => [
    index("admin_broadcasts_status_idx").on(table.status),
    index("admin_broadcasts_created_at_idx").on(table.createdAt),
    index("admin_broadcasts_schedule_mode_idx").on(table.scheduleMode, table.status),
  ],
);

export type AdminUser = typeof adminUsersTable.$inferSelect;
export type InsertAdminUser = typeof adminUsersTable.$inferInsert;
export type AdminSession = typeof adminSessionsTable.$inferSelect;
export type AdminAuditLog = typeof adminAuditLogTable.$inferSelect;
export type CronRun = typeof cronRunsTable.$inferSelect;
export type CannedReply = typeof cannedRepliesTable.$inferSelect;
export type AdminBroadcast = typeof adminBroadcastsTable.$inferSelect;
export type InsertAdminBroadcast = typeof adminBroadcastsTable.$inferInsert;

export type {
  AdminBroadcastAudience,
  AdminBroadcastCategory,
  AdminBroadcastFilters,
  AdminBroadcastLinkType,
  AdminBroadcastScheduleMode,
  AdminBroadcastStatus,
  ScheduledWallClock,
} from "@munib-tracker/shared/admin-broadcasts";
export {
  ADMIN_BROADCAST_AUDIENCES,
  ADMIN_BROADCAST_CATEGORIES,
  ADMIN_BROADCAST_LINK_TYPES,
  ADMIN_BROADCAST_SCHEDULE_MODES,
  ADMIN_BROADCAST_STATUSES,
} from "@munib-tracker/shared/admin-broadcasts";
