import "reflect-metadata";
import { DataSource } from "typeorm";
import { hostRequiresDatabaseSsl, resolveDatabaseSsl } from "./database-ssl";
import {
  AppFeedbackEntity,
  AppVersionEntity,
  AuthSessionEntity,
  ContactMessageEntity,
  ContentReportAttachmentEntity,
  ContentReportEntity,
  InAppNotificationEntity,
  OssContentDownloadFailureEntity,
  PushTokenEntity,
  SyncRecordEntity,
  UserEntity,
  UserMediaEntity,
} from "./entities";

/**
 * Standalone DataSource for the TypeORM CLI (migration generate/run/revert).
 *
 * Production runs with `synchronize: false` (see `database.module.ts`), so schema
 * changes are applied through committed migrations rather than auto-sync. Load
 * your `.env` before invoking, e.g. `pnpm --filter api migration:run`.
 */
const port = Number(process.env.DATABASE_PORT ?? 5432);
const host = process.env.DATABASE_HOST ?? "localhost";

export default new DataSource({
  type: "postgres",
  host,
  port: Number.isFinite(port) ? port : 5432,
  username: process.env.DATABASE_USER ?? "postgres",
  password: process.env.DATABASE_PASSWORD ?? "postgres",
  database: process.env.DATABASE_NAME ?? "munib_tracker",
  ssl: resolveDatabaseSsl({
    enabled: process.env.DATABASE_SSL === "true" || hostRequiresDatabaseSsl(host),
    rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
    ca: process.env.DATABASE_CA_CERT,
  }),
  entities: [
    UserEntity,
    AuthSessionEntity,
    SyncRecordEntity,
    ContentReportEntity,
    ContentReportAttachmentEntity,
    UserMediaEntity,
    AppVersionEntity,
    AppFeedbackEntity,
    ContactMessageEntity,
    OssContentDownloadFailureEntity,
    InAppNotificationEntity,
    PushTokenEntity,
  ],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
});
