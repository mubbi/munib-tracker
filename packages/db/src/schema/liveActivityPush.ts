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

export const liveActivityPushTokensTable = pgTable(
  "live_activity_push_tokens",
  {
    id: serial("id").primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    activityId: varchar("activityId", { length: 128 }).notNull(),
    tokenHash: varchar("tokenHash", { length: 64 }).notNull(),
    tokenCiphertext: text("tokenCiphertext").notNull(),
    apnsEnvironment: varchar("apnsEnvironment", { length: 16 }).notNull(),
    status: varchar("status", { length: 16 }).notNull().default("active"),
    expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
    lastPushAt: timestamp("lastPushAt", { mode: "date" }),
    createdAt: timestampNowOptional("createdAt"),
    updatedAt: timestampNowOptional("updatedAt"),
  },
  (table) => [
    index("live_activity_push_tokens_user_idx").on(table.userId),
    index("live_activity_push_tokens_expires_idx").on(table.status, table.expiresAt),
    uniqueIndex("live_activity_push_tokens_activity_unique").on(table.activityId),
    uniqueIndex("live_activity_push_tokens_hash_unique").on(table.tokenHash),
  ],
);

export const liveActivityPushJobsTable = pgTable(
  "live_activity_push_jobs",
  {
    id: uuid("id").primaryKey(),
    activityTokenId: integer("activityTokenId")
      .notNull()
      .references(() => liveActivityPushTokensTable.id, { onDelete: "cascade" }),
    phase: varchar("phase", { length: 32 }).notNull(),
    executeAt: timestamp("executeAt", { mode: "date" }).notNull(),
    staleAt: timestamp("staleAt", { mode: "date" }),
    contentStateJson: text("contentStateJson").notNull(),
    status: varchar("status", { length: 16 }).notNull().default("pending"),
    qstashMessageId: text("qstashMessageId"),
    attempts: integer("attempts").notNull().default(0),
    lastError: text("lastError"),
    deliveredAt: timestamp("deliveredAt", { mode: "date" }),
    createdAt: timestampNowOptional("createdAt"),
    updatedAt: timestampNowOptional("updatedAt"),
  },
  (table) => [
    index("live_activity_push_jobs_due_idx").on(table.status, table.executeAt),
    index("live_activity_push_jobs_activity_idx").on(table.activityTokenId),
    uniqueIndex("live_activity_push_jobs_phase_unique").on(
      table.activityTokenId,
      table.phase,
      table.executeAt,
    ),
  ],
);
