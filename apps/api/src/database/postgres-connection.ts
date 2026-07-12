import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  type DatabaseSslOption,
  hostRequiresDatabaseSsl,
  resolveDatabaseSsl,
} from "./database-ssl";

/** Discrete / URL-resolved Postgres fields for TypeORM. */
export type PostgresConnectionOptions = {
  /** When set, TypeORM should use `url` instead of discrete host fields. */
  url?: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: DatabaseSslOption;
};

export type ResolvePostgresConnectionOptions = {
  /**
   * When true (TypeORM CLI migrations), prefer `DATABASE_MIGRATE_URL` and
   * upgrade transaction-pooler URLs (:6543 / pgbouncer) to session (:5432).
   */
  forMigrate?: boolean;
};

function isLoopbackHost(host: string): boolean {
  const h = host.trim().toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

function parsePort(raw: string | undefined, fallback: number): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function envFlagTrue(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

function envFlagFalse(value: string | undefined): boolean {
  return value === "false" || value === "0";
}

function normalizePgUrl(url: string): string {
  return url.replace(/^postgres:\/\//i, "postgresql://");
}

function restorePgScheme(normalizedUrl: string, originalUrl: string): string {
  if (/^postgres:\/\//i.test(originalUrl)) {
    return normalizedUrl.replace(/^postgresql:/i, "postgres:");
  }
  return normalizedUrl;
}

/** Strip dashboard `supa*` artifacts and `sslmode` (pg v2 maps require→verify-full). */
export function sanitizeDatabaseUrl(url: string, options?: { stripSslMode?: boolean }): string {
  try {
    const parsed = new URL(normalizePgUrl(url));
    for (const key of [...parsed.searchParams.keys()]) {
      if (key.startsWith("supa") || (options?.stripSslMode && key === "sslmode")) {
        parsed.searchParams.delete(key);
      }
    }
    return restorePgScheme(parsed.toString(), url);
  } catch {
    return url;
  }
}

export function isTransactionPoolerUrl(url: string): boolean {
  try {
    const parsed = new URL(normalizePgUrl(url));
    return parsed.port === "6543" || parsed.searchParams.get("pgbouncer") === "true";
  } catch {
    return false;
  }
}

export function toSessionPoolerUrl(url: string): string {
  const parsed = new URL(normalizePgUrl(url));
  if (parsed.port === "6543") parsed.port = "5432";
  parsed.searchParams.delete("pgbouncer");
  return restorePgScheme(parsed.toString(), url);
}

/**
 * Parse a `postgres://` / `postgresql://` URI into discrete connection fields.
 */
export function parseDatabaseUrl(
  databaseUrl: string,
): Omit<PostgresConnectionOptions, "ssl" | "url"> {
  const sanitized = sanitizeDatabaseUrl(databaseUrl.trim());
  const normalized = normalizePgUrl(sanitized);
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(
      `DATABASE_URL is not a valid Postgres URI. Expected postgresql://user:pass@host:port/db (got a malformed value).`,
    );
  }

  if (parsed.protocol !== "postgresql:") {
    throw new Error(
      `DATABASE_URL must use the postgres/postgresql scheme (got "${parsed.protocol.replace(/:$/, "")}").`,
    );
  }

  const database = decodeURIComponent(parsed.pathname.replace(/^\//, "")).trim();
  if (!parsed.hostname || !database) {
    throw new Error(
      "DATABASE_URL must include a host and database name (e.g. …@pooler.supabase.com:5432/postgres).",
    );
  }

  return {
    host: parsed.hostname,
    port: parsePort(parsed.port, 5432),
    username: decodeURIComponent(parsed.username || "postgres"),
    password: decodeURIComponent(parsed.password || ""),
    database,
  };
}

/**
 * Load apps/api/.env into process.env when keys are unset (TypeORM CLI does not
 * boot Nest ConfigModule). Skipped on Vercel where project env is injected.
 */
export function loadLocalApiEnvFile(env: NodeJS.ProcessEnv = process.env): void {
  if (env.VERCEL) return;

  try {
    // TypeORM CLI runs with cwd = apps/api (pnpm --filter api …).
    const envPath = join(process.cwd(), ".env");
    if (!existsSync(envPath)) return;
    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (env[key] === undefined) {
        env[key] = value;
      }
    }
  } catch {
    // Ignore missing/unreadable .env — Vercel and CI supply env explicitly.
  }
}

function pickDatabaseUrl(env: NodeJS.ProcessEnv, forMigrate: boolean): string | undefined {
  if (forMigrate) {
    const explicit = env.DATABASE_MIGRATE_URL?.trim();
    if (explicit) return sanitizeDatabaseUrl(explicit, { stripSslMode: true });
  }

  const runtime = env.DATABASE_URL?.trim();
  if (!runtime) return undefined;

  const sanitized = sanitizeDatabaseUrl(runtime, { stripSslMode: true });
  if (forMigrate && isTransactionPoolerUrl(sanitized)) {
    return toSessionPoolerUrl(sanitized);
  }
  return sanitized;
}

/**
 * Resolve Postgres options for TypeORM from `DATABASE_URL` (preferred, same as
 * admin/Expense Trail) or discrete `DATABASE_*` vars.
 */
export function resolvePostgresConnection(
  env: NodeJS.ProcessEnv = process.env,
  options: ResolvePostgresConnectionOptions = {},
): PostgresConnectionOptions {
  const forMigrate = options.forMigrate === true;
  const url = pickDatabaseUrl(env, forMigrate);
  const fromUrl = url ? parseDatabaseUrl(url) : null;

  const host = fromUrl?.host ?? env.DATABASE_HOST?.trim() ?? "localhost";
  const port = fromUrl?.port ?? parsePort(env.DATABASE_PORT, 5432);
  const username = fromUrl?.username ?? env.DATABASE_USER?.trim() ?? "postgres";
  const password = fromUrl?.password ?? env.DATABASE_PASSWORD ?? "postgres";
  const database = fromUrl?.database ?? env.DATABASE_NAME?.trim() ?? "munib_tracker";

  if (env.VERCEL && isLoopbackHost(host)) {
    throw new Error(
      "Postgres resolved to localhost during a Vercel build/deploy. " +
        "Set DATABASE_URL on the API Vercel project to the same Supabase Session pooler URI " +
        "as admin (Settings → Environment Variables → Production). " +
        "Name it DATABASE_URL (not POSTGRES_URL). See apps/api/.env.example.",
    );
  }

  const rawUrl = env.DATABASE_MIGRATE_URL?.trim() || env.DATABASE_URL?.trim();
  const sslEnabled =
    envFlagTrue(env.DATABASE_SSL) ||
    hostRequiresDatabaseSsl(host) ||
    (typeof rawUrl === "string" && /[?&]sslmode=(require|verify-full|verify-ca)\b/i.test(rawUrl));

  return {
    ...(url ? { url } : {}),
    host,
    port,
    username,
    password,
    database,
    ssl: resolveDatabaseSsl({
      enabled: sslEnabled,
      rejectUnauthorized: !envFlagFalse(env.DATABASE_SSL_REJECT_UNAUTHORIZED),
      ca: env.DATABASE_CA_CERT,
      host,
    }),
  };
}

/** TypeORM DataSource fields shared by CLI + Nest. */
export function toTypeOrmPostgresOptions(connection: PostgresConnectionOptions): {
  type: "postgres";
  url?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  ssl: DatabaseSslOption;
} {
  if (connection.url) {
    return {
      type: "postgres",
      url: connection.url,
      ssl: connection.ssl,
    };
  }

  return {
    type: "postgres",
    host: connection.host,
    port: connection.port,
    username: connection.username,
    password: connection.password,
    database: connection.database,
    ssl: connection.ssl,
  };
}
