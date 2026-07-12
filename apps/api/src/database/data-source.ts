import "reflect-metadata";
import { DataSource } from "typeorm";
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
import { resolvePostgresConnection } from "./postgres-connection";

/**
 * Standalone DataSource for the TypeORM CLI (migration generate/run/revert).
 *
 * Production runs with `synchronize: false` (see `database.module.ts`), so schema
 * changes are applied through committed migrations rather than auto-sync.
 *
 * Connection: prefer `DATABASE_URL` (same Session-pooler URI as admin), else
 * discrete `DATABASE_HOST` / `DATABASE_PORT` / `DATABASE_USER` /
 * `DATABASE_PASSWORD` / `DATABASE_NAME`. On Vercel, unset DB env fails with a
 * clear error instead of connecting to localhost.
 */
const connection = resolvePostgresConnection();

export default new DataSource({
  type: "postgres",
  host: connection.host,
  port: connection.port,
  username: connection.username,
  password: connection.password,
  database: connection.database,
  ssl: connection.ssl,
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
