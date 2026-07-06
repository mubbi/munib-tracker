import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, type TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DatabaseType, EnvironmentVariables } from "../config/env.schema";
import {
  AuthSessionEntity,
  ContentReportAttachmentEntity,
  ContentReportEntity,
  SyncRecordEntity,
  UserEntity,
} from "./entities";
import { createInMemorySqliteOptions } from "./in-memory-sqlite.options";

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

        return {
          type: "postgres",
          host: configService.get("DATABASE_HOST", { infer: true }) ?? "localhost",
          port: configService.get("DATABASE_PORT", { infer: true }) ?? 5432,
          username: configService.get("DATABASE_USER", { infer: true }) ?? "postgres",
          password: configService.get("DATABASE_PASSWORD", { infer: true }) ?? "postgres",
          database: configService.get("DATABASE_NAME", { infer: true }) ?? "munib_tracker",
          ssl: configService.get("DATABASE_SSL", { infer: true })
            ? { rejectUnauthorized: false }
            : false,
          entities: [
            UserEntity,
            AuthSessionEntity,
            SyncRecordEntity,
            ContentReportEntity,
            ContentReportAttachmentEntity,
          ],
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
