import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timestampNowOptional } from "./columnHelpers";
import { usersTable } from "./users";

/**
 * Circles (NF-3.16–3.18). DDL is owned by the API TypeORM migration
 * `1720000012000-Circles` (CHECK constraints live there); this is a read/write
 * mirror for the admin console. Privacy: never surface signal values, child
 * nicknames or khatm intentions in admin UIs without a documented need
 * (see docs/CIRCLES.md).
 */
export const circlesTable = pgTable(
  "circles",
  {
    id: uuid("id").primaryKey(),
    /** 'family' | 'partner' | 'khatm_group' */
    type: varchar("type", { length: 16 }).notNull(),
    name: varchar("name", { length: 60 }),
    ownerId: uuid("ownerId").references(() => usersTable.id, { onDelete: "set null" }),
    settings: jsonb("settings").$type<{ masjidOsmRef?: string }>().notNull().default({}),
    createdAt: timestampNowOptional("createdAt"),
    updatedAt: timestampNowOptional("updatedAt"),
    deletedAt: timestamp("deletedAt", { mode: "date" }),
  },
  (table) => [index("circles_owner_idx").on(table.ownerId)],
);

export const circleMembersTable = pgTable(
  "circle_members",
  {
    circleId: uuid("circleId")
      .notNull()
      .references(() => circlesTable.id, { onDelete: "cascade" }),
    /** users.id (memberKind 'user') or child_profiles.id (memberKind 'child'). */
    memberId: uuid("memberId").notNull(),
    memberKind: varchar("memberKind", { length: 8 }).notNull(),
    /** 'owner' | 'admin' | 'parent' | 'member' | 'child' */
    role: varchar("role", { length: 8 }).notNull(),
    displayName: varchar("displayName", { length: 32 }),
    shareScope: jsonb("shareScope")
      .$type<{ paused?: boolean; shareFardStatus?: boolean }>()
      .notNull()
      .default({}),
    joinedAt: timestampNowOptional("joinedAt"),
    leftAt: timestamp("leftAt", { mode: "date" }),
  },
  (table) => [
    primaryKey({ columns: [table.circleId, table.memberId] }),
    index("circle_members_member_idx").on(table.memberId),
  ],
);

export const circleInvitesTable = pgTable(
  "circle_invites",
  {
    id: uuid("id").primaryKey(),
    circleId: uuid("circleId")
      .notNull()
      .references(() => circlesTable.id, { onDelete: "cascade" }),
    /** SHA-256 of the normalized code; the code itself is never stored. */
    codeHash: varchar("codeHash", { length: 64 }).notNull(),
    role: varchar("role", { length: 8 }).notNull(),
    maxUses: integer("maxUses").notNull(),
    uses: integer("uses").notNull().default(0),
    expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
    createdBy: uuid("createdBy").notNull(),
    createdAt: timestampNowOptional("createdAt"),
    revokedAt: timestamp("revokedAt", { mode: "date" }),
  },
  (table) => [
    uniqueIndex("circle_invites_code_unique").on(table.codeHash),
    index("circle_invites_circle_idx").on(table.circleId),
    index("circle_invites_creator_idx").on(table.createdBy, table.createdAt),
  ],
);

export const childProfilesTable = pgTable(
  "child_profiles",
  {
    id: uuid("id").primaryKey(),
    circleId: uuid("circleId")
      .notNull()
      .references(() => circlesTable.id, { onDelete: "cascade" }),
    /** The consenting parent. */
    createdBy: uuid("createdBy")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    nickname: varchar("nickname", { length: 24 }).notNull(),
    birthYear: integer("birthYear").notNull(),
    avatar: varchar("avatar", { length: 32 }),
    reward: jsonb("reward").$type<{ title: string; days: number }>(),
    graduationUnlocked: boolean("graduationUnlocked").notNull().default(false),
    consentedAt: timestamp("consentedAt", { mode: "date" }).notNull(),
    consentPolicyVersion: varchar("consentPolicyVersion", { length: 32 }).notNull(),
    /** D34: transferred to a co-parent; consent pending until re-confirmed (30 days). */
    consentTransferredAt: timestamp("consentTransferredAt", { mode: "date" }),
    linkTokenHash: varchar("linkTokenHash", { length: 64 }),
    linkTokenExpiresAt: timestamp("linkTokenExpiresAt", { mode: "date" }),
    deviceTokenHash: varchar("deviceTokenHash", { length: 64 }),
    linkedDeviceAt: timestamp("linkedDeviceAt", { mode: "date" }),
    createdAt: timestampNowOptional("createdAt"),
    updatedAt: timestampNowOptional("updatedAt"),
  },
  (table) => [
    index("child_profiles_circle_idx").on(table.circleId),
    index("child_profiles_creator_idx").on(table.createdBy),
    uniqueIndex("child_profiles_device_token_unique").on(table.deviceTokenHash),
    uniqueIndex("child_profiles_link_token_unique").on(table.linkTokenHash),
  ],
);

export const dailySignalsTable = pgTable(
  "daily_signals",
  {
    circleId: uuid("circleId")
      .notNull()
      .references(() => circlesTable.id, { onDelete: "cascade" }),
    memberId: uuid("memberId").notNull(),
    /** Member-local date, YYYY-MM-DD. */
    date: varchar("date", { length: 10 }).notNull(),
    /** 'fard_status' | 'rest_day' | 'goal_done' */
    kind: varchar("kind", { length: 16 }).notNull(),
    value: jsonb("value").$type<Record<string, boolean>>().notNull(),
    updatedAt: timestampNowOptional("updatedAt"),
  },
  (table) => [
    primaryKey({ columns: [table.circleId, table.memberId, table.date, table.kind] }),
    index("daily_signals_circle_date_idx").on(table.circleId, table.date),
  ],
);

export const groupKhatmsTable = pgTable(
  "group_khatms",
  {
    id: uuid("id").primaryKey(),
    circleId: uuid("circleId")
      .notNull()
      .references(() => circlesTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 80 }).notNull(),
    intention: varchar("intention", { length: 280 }),
    /** 'juz' | 'hizb' | 'surah' */
    unit: varchar("unit", { length: 8 }).notNull(),
    partCount: integer("partCount").notNull(),
    assignmentMode: varchar("assignmentMode", { length: 16 }).notNull().default("self_pick"),
    deadline: varchar("deadline", { length: 10 }),
    round: integer("round").notNull().default(1),
    /** 'active' | 'completed' */
    status: varchar("status", { length: 12 }).notNull().default("active"),
    createdBy: uuid("createdBy"),
    createdAt: timestampNowOptional("createdAt"),
    updatedAt: timestampNowOptional("updatedAt"),
    completedAt: timestamp("completedAt", { mode: "date" }),
  },
  (table) => [index("group_khatms_circle_idx").on(table.circleId)],
);

export const khatmPartsTable = pgTable(
  "khatm_parts",
  {
    khatmId: uuid("khatmId")
      .notNull()
      .references(() => groupKhatmsTable.id, { onDelete: "cascade" }),
    partNo: integer("partNo").notNull(),
    assigneeMemberId: uuid("assigneeMemberId"),
    /** 'open' | 'assigned' | 'reading' | 'done' */
    status: varchar("status", { length: 8 }).notNull().default("open"),
    /** L12: assignment came from round-robin dealing (only dealt parts are re-dealt). */
    dealt: boolean("dealt").notNull().default(false),
    updatedAt: timestampNowOptional("updatedAt"),
  },
  (table) => [
    primaryKey({ columns: [table.khatmId, table.partNo] }),
    index("khatm_parts_assignee_idx").on(table.assigneeMemberId),
  ],
);

export const circleNudgesTable = pgTable(
  "circle_nudges",
  {
    id: uuid("id").primaryKey(),
    circleId: uuid("circleId")
      .notNull()
      .references(() => circlesTable.id, { onDelete: "cascade" }),
    fromMember: uuid("fromMember").notNull(),
    toMember: uuid("toMember").notNull(),
    /** 'dua' | 'reminder' */
    kind: varchar("kind", { length: 16 }).notNull(),
    day: varchar("day", { length: 10 }).notNull(),
    createdAt: timestampNowOptional("createdAt"),
  },
  (table) => [
    // D32: one nudge per KIND per (sender, receiver) pair per UTC day.
    uniqueIndex("circle_nudges_pair_kind_day_unique").on(
      table.circleId,
      table.fromMember,
      table.toMember,
      table.kind,
      table.day,
    ),
    index("circle_nudges_to_idx").on(table.toMember, table.createdAt),
  ],
);

/**
 * NF-3.25 nearby join (D41–D44). Short-lived (10 min) BLE session; the id is the
 * opaque value the host's phone advertises. The 4-digit match code is derived
 * server-side and never stored.
 */
export const circleNearbySessionsTable = pgTable(
  "circle_nearby_sessions",
  {
    id: varchar("id", { length: 16 }).primaryKey(),
    circleId: uuid("circleId")
      .notNull()
      .references(() => circlesTable.id, { onDelete: "cascade" }),
    createdBy: uuid("createdBy").notNull(),
    /** 'parent' | 'member' | 'child' (child-device link) */
    role: varchar("role", { length: 8 }).notNull(),
    childId: uuid("childId").references(() => childProfilesTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
    endedAt: timestamp("endedAt", { mode: "date" }),
    consumedAt: timestamp("consumedAt", { mode: "date" }),
    createdAt: timestampNowOptional("createdAt"),
  },
  (table) => [
    index("circle_nearby_sessions_circle_idx").on(table.circleId),
    index("circle_nearby_sessions_creator_idx").on(table.createdBy, table.createdAt),
  ],
);

/** A joiner's host-approved request (D42). `tokenHash` = SHA-256 of the joiner's poll secret. */
export const circleNearbyRequestsTable = pgTable(
  "circle_nearby_requests",
  {
    id: uuid("id").primaryKey(),
    sessionId: varchar("sessionId", { length: 16 })
      .notNull()
      .references(() => circleNearbySessionsTable.id, { onDelete: "cascade" }),
    requesterId: uuid("requesterId"),
    /** 'guest' | 'user'; null for a child device */
    requesterAccountType: varchar("requesterAccountType", { length: 8 }),
    displayName: varchar("displayName", { length: 32 }),
    tokenHash: varchar("tokenHash", { length: 64 }).notNull(),
    /** 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed' */
    status: varchar("status", { length: 10 }).notNull().default("pending"),
    createdAt: timestampNowOptional("createdAt"),
    decidedAt: timestamp("decidedAt", { mode: "date" }),
  },
  (table) => [
    index("circle_nearby_requests_session_idx").on(table.sessionId, table.status),
    index("circle_nearby_requests_requester_idx").on(table.requesterId),
    uniqueIndex("circle_nearby_requests_token_unique").on(table.tokenHash),
  ],
);

export type Circle = typeof circlesTable.$inferSelect;
export type CircleMember = typeof circleMembersTable.$inferSelect;
export type ChildProfile = typeof childProfilesTable.$inferSelect;
export type GroupKhatm = typeof groupKhatmsTable.$inferSelect;
