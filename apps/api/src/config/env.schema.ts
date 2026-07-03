import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export enum NodeEnvironment {
  Development = "development",
  Production = "production",
  Test = "test",
}

export enum DatabaseType {
  Postgres = "postgres",
  Sqlite = "sqlite",
}

export class EnvironmentVariables {
  @Transform(({ value }) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 3001;
  })
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3001;

  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment = NodeEnvironment.Development;

  @IsEnum(DatabaseType)
  DATABASE_TYPE: DatabaseType = DatabaseType.Postgres;

  @IsString()
  @IsOptional()
  DATABASE_HOST = "localhost";

  @Transform(({ value }) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 5432;
  })
  @IsInt()
  @Min(1)
  @Max(65535)
  DATABASE_PORT = 5432;

  @IsString()
  @IsOptional()
  DATABASE_USER = "postgres";

  @IsString()
  @IsOptional()
  DATABASE_PASSWORD = "postgres";

  @IsString()
  @IsOptional()
  DATABASE_NAME = "munib_tracker";

  @Transform(({ value }) => value === true || value === "true")
  @IsBoolean()
  DATABASE_SSL = false;

  @IsString()
  JWT_SECRET = "change-me-in-development";

  /** Access-token lifetime (any `jsonwebtoken` duration string, e.g. `15m`, `1h`, `7d`). */
  @IsString()
  @IsOptional()
  JWT_ACCESS_TTL = "15m";

  /** Refresh-token lifetime in days. */
  @Transform(({ value }) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 30;
  })
  @IsInt()
  @Min(1)
  @Max(365)
  JWT_REFRESH_TTL_DAYS = 30;

  @IsString()
  @IsOptional()
  CORS_ORIGINS?: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  GOOGLE_CLIENT_SECRET?: string;

  @IsString()
  @IsOptional()
  APPLE_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  APPLE_CLIENT_SECRET?: string;

  @IsString()
  @IsOptional()
  FACEBOOK_APP_ID?: string;

  @IsString()
  @IsOptional()
  FACEBOOK_APP_SECRET?: string;
}
