import {
  Column,
  type ColumnType,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

// SQLite (unit/e2e tests + `DATABASE_TYPE=sqlite`) uses `datetime`; Postgres uses
// `timestamp`. Mirrors the driver choice in `database.module.ts` so the same
// entities validate under both drivers.
const usingSqlite = process.env.DATABASE_TYPE === "sqlite" || process.env.NODE_ENV === "test";
const TIMESTAMP_TYPE: ColumnType = usingSqlite ? "datetime" : "timestamp";

@Entity("users")
// The provider's stable subject id is the authoritative identity key; email is
// non-authoritative metadata. Unique per (provider, providerAccountId) so two
// distinct provider accounts can never collapse into one row.
@Index(["provider", "providerAccountId"], {
  unique: true,
  where: '"providerAccountId" IS NOT NULL',
})
export class UserEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 16 })
  accountType!: "guest" | "user";

  @Column({ type: "varchar", length: 32, nullable: true })
  provider?: string | null;

  /** The provider's stable subject id (Google/Apple `sub`, Facebook `id`). */
  @Column({ type: "varchar", length: 255, nullable: true })
  providerAccountId?: string | null;

  @Column({ type: "varchar", length: 320, nullable: true })
  email?: string | null;

  @Column({ type: "varchar", length: 120, nullable: true })
  displayName?: string | null;

  @Column({ type: "varchar", length: 128, nullable: true })
  deviceId?: string | null;

  /** Dedupe bucket for server-side review-reactivation push (60-day windows). */
  @Column({ type: "varchar", length: 32, nullable: true })
  reviewReactivationLastWindowKey?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity("auth_sessions")
export class AuthSessionEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: UserEntity;

  /**
   * Opaque, rotating refresh token. Access tokens are stateless JWTs that carry
   * this session's id, so we only persist the refresh secret here.
   */
  @Index({ unique: true })
  @Column({ type: "varchar", length: 64 })
  refreshToken!: string;

  @Column({ type: TIMESTAMP_TYPE })
  refreshExpiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity("sync_records")
@Index(["userId", "entity", "recordId"], { unique: true })
export class SyncRecordEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @Column({ type: "varchar", length: 64 })
  entity!: string;

  @Column({ type: "varchar", length: 128 })
  recordId!: string;

  @Column({ type: "simple-json" })
  data!: Record<string, unknown>;

  @Column({ type: TIMESTAMP_TYPE })
  updatedAt!: Date;

  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  deletedAt?: Date | null;
}

@Entity("content_reports")
@Index(["userId", "createdAt"])
export class ContentReportEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: UserEntity;

  @Column({ type: "varchar", length: 32 })
  status!: string;

  @Column({ type: "varchar", length: 64 })
  issueType!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "text", nullable: true })
  suggestedCorrection?: string | null;

  @Column({ type: "text", nullable: true })
  userReference?: string | null;

  @Column({ type: "simple-json" })
  content!: Record<string, unknown>;

  @Column({ type: "varchar", length: 32, nullable: true })
  appVersion?: string | null;

  @Column({ type: "varchar", length: 16, nullable: true })
  platform?: string | null;

  @Column({ type: "text", nullable: true })
  adminNotes?: string | null;

  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  resolvedAt?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

/** Per-platform semver thresholds for soft/hard update prompts. */
@Entity("app_versions")
export class AppVersionEntity {
  @PrimaryColumn({ type: "varchar", length: 16 })
  platform!: "web" | "android" | "ios";

  @Column({ type: "varchar", length: 32 })
  latestVersion!: string;

  @Column({ type: "varchar", length: 32 })
  minSoftVersion!: string;

  @Column({ type: "varchar", length: 32 })
  minHardVersion!: string;

  @Column({ type: "text", nullable: true })
  message?: string | null;

  @Column({ type: "varchar", length: 512, nullable: true })
  storeUrl?: string | null;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity("app_feedback")
@Index(["userId", "createdAt"])
export class AppFeedbackEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: UserEntity;

  @Column({ type: "varchar", length: 128 })
  deviceId!: string;

  @Column({ type: "int" })
  rating!: number;

  @Column({ type: "text", nullable: true })
  message?: string | null;

  @Column({ type: "varchar", length: 64 })
  source!: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  triggerId?: string | null;

  @Column({ type: "varchar", length: 32 })
  appVersion!: string;

  @Column({ type: "varchar", length: 16 })
  platform!: string;

  @Column({ type: "varchar", length: 16, nullable: true })
  locale?: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}

/** Marketing-site contact form submissions (anonymous; keyed by email for rate limits). */
@Entity("contact_messages")
@Index(["email", "createdAt"])
@Index(["status", "createdAt"])
@Index(["createdAt"])
export class ContactMessageEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 254 })
  email!: string;

  @Column({ type: "text" })
  message!: string;

  /** Triage: new | in_progress | closed */
  @Column({ type: "varchar", length: 32, default: "new" })
  status!: string;

  @Column({ type: "text", nullable: true })
  adminNotes?: string | null;

  @Column({ type: "varchar", length: 64, nullable: true })
  ipAddress?: string | null;

  @Column({ type: "varchar", length: 512, nullable: true })
  userAgent?: string | null;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;

  @UpdateDateColumn({ type: TIMESTAMP_TYPE })
  updatedAt!: Date;
}

/** Failed on-demand OSS CDN downloads reported by the Expo app (Qur'an/hadith/fonts/audio). */
@Entity("oss_content_download_failures")
@Index(["contentKind", "createdAt"])
@Index(["contentKey", "createdAt"])
@Index(["sourceProvider", "createdAt"])
@Index(["createdAt"])
export class OssContentDownloadFailureEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: UserEntity;

  @Column({ type: "varchar", length: 64 })
  contentKind!: string;

  /** Stable grouping key, e.g. `quran_edition:en-saheehintl:2` or `hadith:bukhari:ur`. */
  @Column({ type: "varchar", length: 256 })
  contentKey!: string;

  @Column({ type: "varchar", length: 128 })
  sourceProvider!: string;

  @Column({ type: "text" })
  sourceUrl!: string;

  @Column({ type: "simple-json" })
  contentMeta!: Record<string, unknown>;

  @Column({ type: "varchar", length: 64 })
  errorCode!: string;

  @Column({ type: "text" })
  errorMessage!: string;

  @Column({ type: "int", nullable: true })
  httpStatus?: number | null;

  @Column({ type: "varchar", length: 32 })
  appVersion!: string;

  @Column({ type: "varchar", length: 16 })
  platform!: string;

  @Column({ type: "varchar", length: 16, nullable: true })
  locale?: string | null;

  @Column({ type: "varchar", length: 16, nullable: true })
  translationLocale?: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity("content_report_attachments")
export class ContentReportAttachmentEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  reportId!: string;

  @ManyToOne(() => ContentReportEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "reportId" })
  report!: ContentReportEntity;

  @Column({ type: "varchar", length: 128 })
  mimeType!: string;

  @Column({ type: "varchar", length: 255 })
  filename!: string;

  @Column({ type: "int" })
  sizeBytes!: number;

  @Column({ type: "varchar", length: 512 })
  storagePath!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

/** Private user-owned images (e.g. custom adhkar attachments). */
@Entity("user_media")
@Index(["userId", "createdAt"])
export class UserMediaEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: UserEntity;

  @Column({ type: "varchar", length: 128 })
  mimeType!: string;

  @Column({ type: "varchar", length: 255 })
  filename!: string;

  @Column({ type: "int" })
  sizeBytes!: number;

  /** Disk path or `cloudinary:{public_id}` (authenticated delivery). */
  @Column({ type: "varchar", length: 512 })
  storagePath!: string;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;
}

const JSON_COLUMN_TYPE: ColumnType = usingSqlite ? "simple-json" : "jsonb";

/** Server-synced in-app inbox rows (including admin broadcast announcements). */
@Entity("in_app_notifications")
@Index("in_app_notifications_userId_idx", ["userId"])
@Index("in_app_notifications_user_read_idx", ["userId", "readAt"])
@Index("in_app_notifications_broadcastId_idx", ["broadcastId"])
@Index("in_app_notifications_user_dedupe", ["userId", "dedupeKey"], { unique: true })
export class InAppNotificationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("uuid")
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: UserEntity;

  @Column({ type: "varchar" })
  kind!: string;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text" })
  body!: string;

  @Column({ type: "text", nullable: true })
  subtitle?: string | null;

  @Column({ type: JSON_COLUMN_TYPE, nullable: true })
  routeData?: Record<string, unknown> | null;

  @Column({ type: "text", nullable: true })
  dedupeKey?: string | null;

  @Column({ type: "int", nullable: true })
  broadcastId?: number | null;

  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  readAt?: Date | null;

  @Column({ type: TIMESTAMP_TYPE, nullable: true })
  clickedAt?: Date | null;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;
}

/** Expo / web push tokens for linked users. */
@Entity("push_tokens")
@Index("push_tokens_userId_idx", ["userId"])
@Index("push_tokens_user_device", ["userId", "deviceId"], { unique: true })
export class PushTokenEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("uuid")
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: UserEntity;

  @Column({ type: "text" })
  token!: string;

  @Column({ type: "text", nullable: true })
  deviceId?: string | null;

  @Column({ type: "varchar", default: "expo" })
  platform!: string;

  @Column({ type: "text", nullable: true })
  locale?: string | null;

  @Column({ type: "text", nullable: true })
  clientPlatform?: string | null;

  @CreateDateColumn({ type: TIMESTAMP_TYPE })
  createdAt!: Date;

  @UpdateDateColumn({ type: TIMESTAMP_TYPE })
  updatedAt!: Date;
}
