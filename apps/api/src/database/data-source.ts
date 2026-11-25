import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  AppFeedbackEntity,
  AppVersionEntity,
  AuthSessionEntity,
  CIRCLE_ENTITIES,
  ContactMessageEntity,
  ContentReportAttachmentEntity,
  ContentReportEntity,
  DeletedAccountEntity,
  InAppNotificationEntity,
  LiveActivityPushJobEntity,
  LiveActivityPushTokenEntity,
  OssContentDownloadFailureEntity,
  PushTokenEntity,
  SurfacePushJobEntity,
  SurfacePushRegistrationEntity,
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
    SurfacePushRegistrationEntity,
    SurfacePushJobEntity,
    PushTokenEntity,
    DeletedAccountEntity,
    ...CIRCLE_ENTITIES,
  ],
  // Timestamped files only — colocated `*.spec.ts` tests import Vitest and
  // crash the CLI if TypeORM tries to load them as migrations.
  migrations: ["src/database/migrations/[0-9]*-*.ts"],
  synchronize: false,
});
