import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
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
  PushTokenEntity,
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
