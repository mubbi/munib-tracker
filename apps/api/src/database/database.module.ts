import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, type TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DatabaseType, EnvironmentVariables } from "../config/env.schema";
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
import { createInMemorySqliteOptions } from "./in-memory-sqlite.options";
import { resolvePostgresConnection, toTypeOrmPostgresOptions } from "./postgres-connection";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ): TypeOrmModuleOptions => {
        const databaseType = configService.get("DATABASE_TYPE", { infer: true });
        const nodeEnv = configService.get("NODE_ENV", { infer: true });

        // Auto-sync is only ever safe for sqlite/test; those return here. Every
        // other path is Postgres, which relies exclusively on committed
        // migrations so schema changes are never silently applied in prod.
        if (databaseType === DatabaseType.Sqlite || nodeEnv === "test") {
          return createInMemorySqliteOptions();
        }

        // Same URL-first resolver as the TypeORM CLI (DATABASE_URL or DATABASE_*).
        const connection = resolvePostgresConnection(process.env);
        const pgOptions = toTypeOrmPostgresOptions(connection);

        return {
          ...pgOptions,
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
          synchronize: false,
          autoLoadEntities: true,
          // Fail fast on unreachable Postgres (default TCP wait can hit Vercel 300s).
          // `options` forces UTF-8 client encoding (see toTypeOrmPostgresOptions).
          extra: {
            ...pgOptions.extra,
            connectionTimeoutMillis: 15_000,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
