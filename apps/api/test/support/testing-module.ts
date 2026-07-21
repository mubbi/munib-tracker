import type { Provider } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Test, type TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "../../src/auth/auth.service";
import { OAuthProviderService } from "../../src/auth/oauth-provider.service";
import { TokenService } from "../../src/auth/token.service";
import { AttachmentStorageService } from "../../src/common/attachment-storage.service";
import { validateEnvironment } from "../../src/config/env.validation";
import {
  AppFeedbackEntity,
  AuthSessionEntity,
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
} from "../../src/database/entities";
import { createInMemorySqliteOptions } from "../../src/database/in-memory-sqlite.options";
import { StubOAuthProviderService } from "./oauth-stub";

const ENTITIES = [
  UserEntity,
  AuthSessionEntity,
  SyncRecordEntity,
  ContentReportEntity,
  ContentReportAttachmentEntity,
  UserMediaEntity,
  AppFeedbackEntity,
  OssContentDownloadFailureEntity,
  InAppNotificationEntity,
  PushTokenEntity,
  LiveActivityPushTokenEntity,
  LiveActivityPushJobEntity,
  DeletedAccountEntity,
];

/**
 * Compiles a Nest testing module wired to a fresh in-memory SQLite database with
 * the real auth stack and a stubbed OAuth provider. Pass any extra providers the
 * suite under test needs (e.g. `SyncService`); they resolve against the same DB.
 */
export function createAuthTestingModule(extraProviders: Provider[] = []): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
      JwtModule.register({ secret: "test-secret" }),
      TypeOrmModule.forRoot(createInMemorySqliteOptions(ENTITIES)),
      TypeOrmModule.forFeature(ENTITIES),
    ],
    providers: [
      AuthService,
      TokenService,
      AttachmentStorageService,
      { provide: OAuthProviderService, useClass: StubOAuthProviderService },
      ...extraProviders,
    ],
  }).compile();
}
