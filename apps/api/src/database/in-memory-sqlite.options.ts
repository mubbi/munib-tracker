import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
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
  SurfacePushJobEntity,
  SurfacePushRegistrationEntity,
  SyncRecordEntity,
  UserEntity,
  UserMediaEntity,
} from "./entities";

const testEntities = [
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
];

/** Shared in-memory SQLite options for unit, e2e, and OpenAPI export runs. */
export function createInMemorySqliteOptions(
  entities: TypeOrmModuleOptions["entities"] = testEntities,
): TypeOrmModuleOptions {
  return {
    type: "better-sqlite3",
    database: ":memory:",
    entities,
    synchronize: true,
  };
}
