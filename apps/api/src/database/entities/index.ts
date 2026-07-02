import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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

  @Index({ unique: true })
  @Column({ type: "varchar", length: 64 })
  accessToken!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 64 })
  refreshToken!: string;

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

  @Column({ type: "datetime" })
  updatedAt!: Date;

  @Column({ type: "datetime", nullable: true })
  deletedAt?: Date | null;
}
