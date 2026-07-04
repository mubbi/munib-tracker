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

/**
 * The insecure default JWT secret. Fine for local dev/test, but production must
 * override it with a strong secret — see the production check in
 * `validateEnvironment`.
 */
export const DEV_JWT_SECRET = "change-me-in-development";

/** Minimum acceptable JWT secret length (bytes) in production. */
export const MIN_PROD_JWT_SECRET_LENGTH = 32;

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
  JWT_SECRET = DEV_JWT_SECRET;

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

  /**
   * Allowed audiences for Apple id_token verification (comma/space separated).
   * Include the iOS bundle id (native Sign in with Apple) and, when using the
   * web/Android Apple OAuth flow, the Services ID.
   */
  @IsString()
  @IsOptional()
  APPLE_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  APPLE_CLIENT_SECRET?: string;

  /** Apple Services ID used as the `client_id` for the web/Android OAuth code exchange. */
  @IsString()
  @IsOptional()
  APPLE_SERVICES_ID?: string;

  /** Apple developer Team ID (issuer of the client-secret JWT). */
  @IsString()
  @IsOptional()
  APPLE_TEAM_ID?: string;

  /** Key ID of the Apple .p8 private key (Sign in with Apple key). */
  @IsString()
  @IsOptional()
  APPLE_KEY_ID?: string;

  /**
   * Apple .p8 private key (PKCS#8 PEM). In `.env` keep it on one line with literal
   * `\n` between PEM lines; we expand them before importing.
   */
  @IsString()
  @IsOptional()
  APPLE_PRIVATE_KEY?: string;

  @IsString()
  @IsOptional()
  FACEBOOK_APP_ID?: string;

  @IsString()
  @IsOptional()
  FACEBOOK_APP_SECRET?: string;
}
