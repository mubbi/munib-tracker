import type {
  CircleMemberKind,
  CircleNudgeKind,
  CircleRole,
  CircleSignalKind,
  CircleType,
  KhatmAssignmentMode,
  KhatmPartStatus,
  KhatmStatus,
  KhatmUnit,
} from "@munib-tracker/shared/circles";
import type { NearbyRequestStatus } from "@munib-tracker/shared/circles/nearby";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { JSON_COLUMN_TYPE, TIMESTAMP_TYPE } from "./column-types";

/**
 * Circles (NF-3.16–3.18, D1). DDL is owned by migration `1720000012000-Circles`
 * (CHECK constraints + FKs to `users` live there); the Drizzle mirror is
 * `packages/db/src/schema/circles.ts`. Relations to `users` are intentionally not
 * modelled here (account deletion tombstones the user row, so cleanup is
 * explicit — see `circles/circle-retention.ts`).
 */

/** Closed per-type settings. Family: none yet. Khatm groups: optional OSM masjid tag. */
export type CircleSettings = {
  /** Display-only OpenStreetMap ref, e.g. `node/123` (NF-3.18 masjid khatm). */
  masjidOsmRef?: string;
};

/** Per-member sharing switches (never the private goal itself). */
export type CircleShareScope = {
  /** Partner: pause sharing `goal_done`. */
  paused?: boolean;
  /** Family adult member (graduated child): opt in to share `fard_status` with parents. */
  shareFardStatus?: boolean;
};

@Entity("circles")
@Index("circles_owner_idx", ["ownerId"])
export class CircleEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 16 })
  type!: CircleType;

  /** Nulled when the circle is deleted. */
  @Column({ type: "varchar", length: 60, nullable: true })
  name?: string | null;

  @Column({ type: "uuid", nullable: true })
  ownerId?: string | null;

  @Column({ type: JSON_COLUMN_TYPE, default: "{}" })
  settings!: CircleSettings;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;

  @UpdateDateColumn({ type: TIMESTAMP_TYPE })
  updatedAt!: Date;

  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  deletedAt?: Date | null;
}

@Entity("circle_members")
@Index("circle_members_member_idx", ["memberId"])
export class CircleMemberEntity {
  @PrimaryColumn("uuid")
  circleId!: string;

  /** `users.id` for `user` members, `child_profiles.id` for `child` members. */
  @PrimaryColumn("uuid")
  memberId!: string;

  @ManyToOne(() => CircleEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "circleId" })
  circle?: CircleEntity;

  @Column({ type: "varchar", length: 8 })
  memberKind!: CircleMemberKind;

  @Column({ type: "varchar", length: 8 })
  role!: CircleRole;

  /** Name the member chooses for this circle (never the account name). */
  @Column({ type: "varchar", length: 32, nullable: true })
  displayName?: string | null;

  @Column({ type: JSON_COLUMN_TYPE, default: "{}" })
  shareScope!: CircleShareScope;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  joinedAt!: Date;

  /** Set on leave; signals are purged `leftMemberRetentionDays` later. */
  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  leftAt?: Date | null;
}

@Entity("circle_invites")
@Index("circle_invites_code_unique", ["codeHash"], { unique: true })
@Index("circle_invites_circle_idx", ["circleId"])
@Index("circle_invites_creator_idx", ["createdBy", "createdAt"])
export class CircleInviteEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  circleId!: string;

  @ManyToOne(() => CircleEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "circleId" })
  circle?: CircleEntity;

  /** SHA-256 hex of the normalized 10-char base32 code. The code itself is never stored. */
  @Column({ type: "varchar", length: 64 })
  codeHash!: string;

  @Column({ type: "varchar", length: 8 })
  role!: CircleRole;

  @Column({ type: "integer" })
  maxUses!: number;

  @Column({ type: "integer", default: 0 })
  uses!: number;

  @Column({ type: TIMESTAMP_TYPE })
  expiresAt!: Date;

  @Column("uuid")
  createdBy!: string;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;

  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  revokedAt?: Date | null;
}

/** Parent-defined real reward ("All 5 for 7 days → park trip"). */
export type ChildReward = { title: string; days: number };

/**
 * Parent-managed child profile (D7): nickname + birth year only, no email, no
 * password. `createdBy` is the consenting parent; consent is recorded with
 * `consentedAt` + `consentPolicyVersion`. Deletion is immediate (hard delete).
 * If that parent deletes their account, the profile transfers to a remaining
 * co-parent with consent pending (`consentTransferredAt`, D34).
 */
@Entity("child_profiles")
@Index("child_profiles_circle_idx", ["circleId"])
@Index("child_profiles_creator_idx", ["createdBy"])
@Index("child_profiles_device_token_unique", ["deviceTokenHash"], { unique: true })
@Index("child_profiles_link_token_unique", ["linkTokenHash"], { unique: true })
export class ChildProfileEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  circleId!: string;

  @ManyToOne(() => CircleEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "circleId" })
  circle?: CircleEntity;

  @Column("uuid")
  createdBy!: string;

  @Column({ type: "varchar", length: 24 })
  nickname!: string;

  @Column({ type: "integer" })
  birthYear!: number;

  /** Id of a bundled avatar (never an uploaded image). */
  @Column({ type: "varchar", length: 32, nullable: true })
  avatar?: string | null;

  @Column({ type: JSON_COLUMN_TYPE, nullable: true })
  reward?: ChildReward | null;

  /** Parent allowed graduation before the approximate age of 13. */
  @Column({ type: "boolean", default: false })
  graduationUnlocked!: boolean;

  @Column({ type: TIMESTAMP_TYPE })
  consentedAt!: Date;

  @Column({ type: "varchar", length: 32 })
  consentPolicyVersion!: string;

  /**
   * D34: set when the consenting parent deleted their account and the profile
   * passed to a remaining co-parent (`createdBy` now points at them). While set,
   * consent is pending: the parent view is hidden until the co-parent
   * re-confirms; the retention sweep deletes it after `childConsentTransferDays`.
   */
  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  consentTransferredAt?: Date | null;

  /** One-time QR device-link token (5-min TTL), hashed. */
  @Column({ type: "varchar", length: 64, nullable: true })
  linkTokenHash?: string | null;

  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  linkTokenExpiresAt?: Date | null;

  /** Scoped child-session bearer token, hashed. One linked device per child. */
  @Column({ type: "varchar", length: 64, nullable: true })
  deviceTokenHash?: string | null;

  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  linkedDeviceAt?: Date | null;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;

  @UpdateDateColumn({ type: TIMESTAMP_TYPE })
  updatedAt!: Date;
}

/**
 * Minimal shared state. `value` is a closed schema per kind, validated by the
 * DTOs: `fard_status` {fajr..isha: bool}, `rest_day` {rest: true},
 * `goal_done` {done: true}. No notes, no qaza, no journals — ever.
 */
@Entity("daily_signals")
@Index("daily_signals_circle_date_idx", ["circleId", "date"])
export class CircleDailySignalEntity {
  @PrimaryColumn("uuid")
  circleId!: string;

  @PrimaryColumn("uuid")
  memberId!: string;

  /** The member's local calendar date, YYYY-MM-DD. */
  @PrimaryColumn({ type: "varchar", length: 10 })
  date!: string;

  @PrimaryColumn({ type: "varchar", length: 16 })
  kind!: CircleSignalKind;

  @ManyToOne(() => CircleEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "circleId" })
  circle?: CircleEntity;

  @Column({ type: JSON_COLUMN_TYPE })
  value!: Record<string, boolean>;

  @UpdateDateColumn({ type: TIMESTAMP_TYPE })
  updatedAt!: Date;
}

@Entity("group_khatms")
@Index("group_khatms_circle_idx", ["circleId"])
export class GroupKhatmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  circleId!: string;

  @ManyToOne(() => CircleEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "circleId" })
  circle?: CircleEntity;

  @Column({ type: "varchar", length: 80 })
  title!: string;

  /** Free-text intention (user content — never logged). */
  @Column({ type: "varchar", length: 280, nullable: true })
  intention?: string | null;

  @Column({ type: "varchar", length: 8 })
  unit!: KhatmUnit;

  @Column({ type: "integer" })
  partCount!: number;

  @Column({ type: "varchar", length: 16, default: "self_pick" })
  assignmentMode!: KhatmAssignmentMode;

  /** YYYY-MM-DD or null. */
  @Column({ type: "varchar", length: 10, nullable: true })
  deadline?: string | null;

  @Column({ type: "integer", default: 1 })
  round!: number;

  @Column({ type: "varchar", length: 12, default: "active" })
  status!: KhatmStatus;

  /** `circle_members.memberId` of the creator; nulled if they delete their account. */
  @Column({ type: "uuid", nullable: true })
  createdBy?: string | null;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;

  @UpdateDateColumn({ type: TIMESTAMP_TYPE })
  updatedAt!: Date;

  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  completedAt?: Date | null;
}

@Entity("khatm_parts")
@Index("khatm_parts_assignee_idx", ["assigneeMemberId"])
export class KhatmPartEntity {
  @PrimaryColumn("uuid")
  khatmId!: string;

  @PrimaryColumn({ type: "integer" })
  partNo!: number;

  @ManyToOne(() => GroupKhatmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "khatmId" })
  khatm?: GroupKhatmEntity;

  @Column({ type: "uuid", nullable: true })
  assigneeMemberId?: string | null;

  @Column({ type: "varchar", length: 8, default: "open" })
  status!: KhatmPartStatus;

  /**
   * L12: the current assignment came from round-robin dealing (true) rather than
   * a member's own claim or a manager's assignment — only dealt parts are re-dealt.
   */
  @Column({ type: "boolean", default: false })
  dealt!: boolean;

  @Column({ type: TIMESTAMP_TYPE })
  updatedAt!: Date;
}

/** Rate-limited nudges: one per kind per (from, to) pair per UTC day (unique index, D32). */
@Entity("circle_nudges")
@Index(
  "circle_nudges_pair_kind_day_unique",
  ["circleId", "fromMember", "toMember", "kind", "day"],
  { unique: true },
)
@Index("circle_nudges_to_idx", ["toMember", "createdAt"])
export class CircleNudgeEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  circleId!: string;

  @ManyToOne(() => CircleEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "circleId" })
  circle?: CircleEntity;

  @Column("uuid")
  fromMember!: string;

  @Column("uuid")
  toMember!: string;

  @Column({ type: "varchar", length: 16 })
  kind!: CircleNudgeKind;

  /** UTC day bucket for the rate limit, YYYY-MM-DD. */
  @Column({ type: "varchar", length: 10 })
  day!: string;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;
}

/**
 * NF-3.25 nearby-join session (D41–D44): lives while the host's invite screen is
 * open (10 min). The id is the 8-byte opaque value the host's phone advertises
 * over Bluetooth LE — no invite code, no personal data. The 4-digit match code is
 * derived from it server-side (`nearbyMatchCode`), never stored.
 */
@Entity("circle_nearby_sessions")
@Index("circle_nearby_sessions_circle_idx", ["circleId"])
@Index("circle_nearby_sessions_creator_idx", ["createdBy", "createdAt"])
export class CircleNearbySessionEntity {
  /** 16 lowercase hex chars (`NEARBY_SERVICE_UUID_PREFIX` + this = the BLE service UUID). */
  @PrimaryColumn({ type: "varchar", length: 16 })
  id!: string;

  @Column("uuid")
  circleId!: string;

  @ManyToOne(() => CircleEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "circleId" })
  circle?: CircleEntity;

  /** Host (`users.id`). */
  @Column("uuid")
  createdBy!: string;

  /** Role a `member` session grants on accept (`parent` / `member`). `child` for a device link. */
  @Column({ type: "varchar", length: 8 })
  role!: CircleRole;

  /** `child_link` sessions: the child profile whose device is being linked. */
  @Column({ type: "uuid", nullable: true })
  childId?: string | null;

  @Column({ type: TIMESTAMP_TYPE })
  expiresAt!: Date;

  /** Host closed the invite screen (or the app went to the background). */
  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  endedAt?: Date | null;

  /** Single-use sessions (parent invite, child link) are consumed by the first accept. */
  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  consumedAt?: Date | null;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;
}

/** A joiner's "Asking to join" request; the host accepts or declines (D42). */
@Entity("circle_nearby_requests")
@Index("circle_nearby_requests_session_idx", ["sessionId", "status"])
@Index("circle_nearby_requests_requester_idx", ["requesterId"])
@Index("circle_nearby_requests_token_unique", ["tokenHash"], { unique: true })
export class CircleNearbyRequestEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 16 })
  sessionId!: string;

  @ManyToOne(() => CircleNearbySessionEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sessionId" })
  session?: CircleNearbySessionEntity;

  /** Account asking to join (`member` sessions); `null` for a child device (no account, D7). */
  @Column({ type: "uuid", nullable: true })
  requesterId?: string | null;

  @Column({ type: "varchar", length: 8, nullable: true })
  requesterAccountType?: "guest" | "user" | null;

  /** Name the joiner chose for this circle (shown to the host only). */
  @Column({ type: "varchar", length: 32, nullable: true })
  displayName?: string | null;

  /** SHA-256 of the joiner's one-time request secret (`mtn_…`) — authenticates polling. */
  @Column({ type: "varchar", length: 64 })
  tokenHash!: string;

  @Column({ type: "varchar", length: 10 })
  status!: NearbyRequestStatus;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;

  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  decidedAt?: Date | null;
}

export const CIRCLE_ENTITIES = [
  CircleEntity,
  CircleMemberEntity,
  CircleInviteEntity,
  ChildProfileEntity,
  CircleDailySignalEntity,
  GroupKhatmEntity,
  KhatmPartEntity,
  CircleNudgeEntity,
  CircleNearbySessionEntity,
  CircleNearbyRequestEntity,
];
