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
  InAppNotificationEntity,
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

        return {
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
            PushTokenEntity,
          ],
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
