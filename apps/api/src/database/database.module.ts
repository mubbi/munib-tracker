import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, type TypeOrmModuleOptions } from "@nestjs/typeorm";
import type { EnvironmentVariables } from "../config/env.schema";
import { DatabaseType } from "../config/env.schema";
import { AuthSessionEntity, SyncRecordEntity, UserEntity } from "./entities";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>): TypeOrmModuleOptions => {
        const databaseType = configService.get("DATABASE_TYPE", { infer: true });

        if (databaseType === DatabaseType.Sqlite) {
          return {
            type: "sqljs",
            autoSave: false,
            location: "memory",
            entities: [UserEntity, AuthSessionEntity, SyncRecordEntity],
            synchronize: true,
          };
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
          entities: [UserEntity, AuthSessionEntity, SyncRecordEntity],
          synchronize: configService.get("NODE_ENV", { infer: true }) !== "production",
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
