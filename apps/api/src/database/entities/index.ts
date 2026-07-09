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
