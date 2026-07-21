import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  AppFeedbackEntity,
  AppVersionEntity,
  AuthSessionEntity,
  ContactMessageEntity,
  ContentReportAttachmentEntity,
  ContentReportEntity,
  DeletedAccountEntity,
  InAppNotificationEntity,
  LiveActivityPushJobEntity,
  LiveActivityPushTokenEntity,
  OssContentDownloadFailureEntity,
  PushTokenEntity,
  SyncRecordEntity,
  UserEntity,
  UserMediaEntity,
} from "./entities";
import {
  loadLocalApiEnvFile,
  resolvePostgresConnection,
  toTypeOrmPostgresOptions,
} from "./postgres-connection";

/**
 * Standalone DataSource for the TypeORM CLI (migration generate/run/revert).
 *
 * Prefers `DATABASE_URL` (same as admin / Expense Trail). On Vercel set that
 * on the API project. Transaction-pooler URLs (:6543) are upgraded to session
 * (:5432) for migrations; override with `DATABASE_MIGRATE_URL` if needed.
 */
loadLocalApiEnvFile();
const connection = resolvePostgresConnection(process.env, { forMigrate: true });

export default new DataSource({
  ...toTypeOrmPostgresOptions(connection),
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
    LiveActivityPushTokenEntity,
    LiveActivityPushJobEntity,
    PushTokenEntity,
    DeletedAccountEntity,
  ],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
});
