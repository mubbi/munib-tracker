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

  /**
   * Optional Postgres URI (same Session-pooler string as admin/marketing).
   * When set, TypeORM prefers this over discrete DATABASE_HOST / USER / etc.
   */
  @IsString()
  @IsOptional()
  DATABASE_URL?: string;

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

  /**
   * Whether to verify the database server's TLS certificate chain when
   * `DATABASE_SSL=true`. Defaults to `true` (secure): an unverified TLS
   * connection offers no protection against an active MITM. Only set this to
   * `false` for a managed provider that presents a self-signed certificate, and
   * prefer supplying that provider's CA via `DATABASE_CA_CERT` instead.
   */
  @Transform(({ value }) => !(value === false || value === "false"))
  @IsBoolean()
  DATABASE_SSL_REJECT_UNAUTHORIZED = true;

  /**
   * Optional PEM-encoded CA certificate used to verify the database server's TLS
   * certificate. Keep it on one line with literal `\n` between PEM lines (they are
   * expanded before use), the same convention as `APPLE_PRIVATE_KEY`.
   */
  @IsString()
  @IsOptional()
  DATABASE_CA_CERT?: string;

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

  /**
   * Allowed Google OAuth client IDs (comma/space separated) for access-token /
   * id_token audience checks. Include Web + iOS + Android client ids.
   * Example: web-xxx.apps.googleusercontent.com,ios-xxx.apps.googleusercontent.com
   */
  @IsString()
  @IsOptional()
  GOOGLE_OAUTH_CLIENT_IDS?: string;

  /**
   * Web OAuth client id used for the authorization-code + secret exchange.
   * Defaults to the first entry in `GOOGLE_OAUTH_CLIENT_IDS` when unset.
   */
  @IsString()
  @IsOptional()
  GOOGLE_OAUTH_WEB_CLIENT_ID?: string;

  /** Web OAuth client secret (API only — never ship in the Expo app). */
  @IsString()
  @IsOptional()
  GOOGLE_OAUTH_WEB_CLIENT_SECRET?: string;

  /**
   * Allowed audiences for Apple id_token verification (comma/space separated).
   * Include the iOS bundle id (native Sign in with Apple) and, when using the
   * web/Android Apple OAuth flow, the Services ID.
   */
  @IsString()
  @IsOptional()
  APPLE_CLIENT_IDS?: string;

  /** Legacy single Apple audience when `APPLE_CLIENT_IDS` is unset. */
  @IsString()
  @IsOptional()
  APPLE_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  APPLE_CLIENT_SECRET?: string;

  /**
   * Comma-separated redirect URIs allowed for OAuth code exchange (web origins,
   * Google reversed schemes, Apple API callback, App Link return URLs).
   * Required in production when exchanging authorization codes.
   */
  @IsString()
  @IsOptional()
  OAUTH_REDIRECT_URI_ALLOWLIST?: string;

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

  /** Directory for content-report attachment files (default: ./uploads/reports). */
  @IsString()
  @IsOptional()
  REPORT_ATTACHMENTS_DIR = "./uploads/reports";

  /** Directory for private user media when Cloudinary is unset (default: ./uploads/user-media). */
  @IsString()
  @IsOptional()
  USER_MEDIA_DIR = "./uploads/user-media";

  /**
   * Cloudinary cloud name for report attachments (required on Vercel).
   * When set with API key + secret, files are stored as `cloudinary:{public_id}`.
   */
  @IsString()
  @IsOptional()
  CLOUDINARY_CLOUD_NAME?: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_API_KEY?: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_API_SECRET?: string;

  /** Optional Cloudinary folder prefix for report attachments (default: munib-tracker/reports). */
  @IsString()
  @IsOptional()
  CLOUDINARY_FOLDER?: string;

  /**
   * Optional Cloudinary folder prefix for private custom-adhkar images
   * (default: munib-tracker/custom-adhkar). Assets use authenticated delivery.
   */
  @IsString()
  @IsOptional()
  CLOUDINARY_USER_MEDIA_FOLDER?: string;

  /**
   * Optional Redis URL for shared rate limits, JSON caches, and cron locks.
   * When unset, rate limits stay in-memory per process and caches are skipped.
   * Example: redis://localhost:6379 or rediss://default:…@….upstash.io:6379
   */
  @IsString()
  @IsOptional()
  REDIS_URL?: string;

  /**
   * Optional key namespace segment (defaults to NODE_ENV).
   * Keys are stored as `mt:{prefix}:…`.
   */
  @IsString()
  @IsOptional()
  REDIS_KEY_PREFIX?: string;

  /** Web Push VAPID public key (optional; exposed via GET /notifications/vapid-public-key). */
  @IsString()
  @IsOptional()
  VAPID_PUBLIC_KEY?: string;
}
