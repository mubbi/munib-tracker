import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timestampNowOptional } from "./columnHelpers";
import { usersTable } from "./users";

/** Expo / Web Push registrations for Android Live Updates and scheduled PWA push. */
export const surfacePushRegistrationsTable = pgTable(
  "surface_push_registrations",
  {
    id: serial("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    channel: varchar("channel", { length: 16 }).notNull(),
    targetHash: varchar("targetHash", { length: 64 }).notNull(),
    target: text("target").notNull(),
    sessionId: varchar("sessionId", { length: 128 }),
    deviceId: varchar("deviceId", { length: 128 }),
    status: varchar("status", { length: 16 }).notNull().default("active"),
    expiresAt: timestamp("expiresAt", { mode: "date" }),
    lastPushAt: timestamp("lastPushAt", { mode: "date" }),
    createdAt: timestampNowOptional("createdAt"),
    updatedAt: timestampNowOptional("updatedAt"),
  },
  (table) => [
    uniqueIndex("surface_push_registrations_target_unique").on(table.targetHash),
    index("surface_push_registrations_user_idx").on(table.userId),
    index("surface_push_registrations_session_idx").on(table.sessionId),
  ],
);

export const surfacePushJobsTable = pgTable(
  "surface_push_jobs",
  {
    id: uuid("id").primaryKey(),
    registrationId: integer("registrationId")
      .notNull()
      .references(() => surfacePushRegistrationsTable.id, { onDelete: "cascade" }),
    channel: varchar("channel", { length: 16 }).notNull(),
    phase: varchar("phase", { length: 32 }).notNull(),
    dedupeKey: varchar("dedupeKey", { length: 160 }).notNull(),
    executeAt: timestamp("executeAt", { mode: "date" }).notNull(),
    staleAt: timestamp("staleAt", { mode: "date" }),
    payloadJson: text("payloadJson").notNull(),
    status: varchar("status", { length: 16 }).notNull().default("pending"),
    qstashMessageId: text("qstashMessageId"),
    attempts: integer("attempts").notNull().default(0),
    lastError: text("lastError"),
    deliveredAt: timestamp("deliveredAt", { mode: "date" }),
    createdAt: timestampNowOptional("createdAt"),
    updatedAt: timestampNowOptional("updatedAt"),
  },
  (table) => [
    index("surface_push_jobs_due_idx").on(table.status, table.executeAt),
    index("surface_push_jobs_registration_idx").on(table.registrationId),
    uniqueIndex("surface_push_jobs_dedupe_unique").on(table.registrationId, table.dedupeKey),
  ],
);
