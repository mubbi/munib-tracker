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
export class UserEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 16 })
  accountType!: "guest" | "user";

  @Column({ type: "varchar", length: 32, nullable: true })
  provider?: string | null;

  @Column({ type: "varchar", length: 320, nullable: true })
  email?: string | null;

  @Column({ type: "varchar", length: 120, nullable: true })
  displayName?: string | null;

  @Column({ type: "varchar", length: 128, nullable: true })
  deviceId?: string | null;

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
