import {
  type DatabaseSslOption,
  hostRequiresDatabaseSsl,
  resolveDatabaseSsl,
} from "./database-ssl";

/** Discrete Postgres connection fields used by TypeORM (CLI + Nest). */
export type PostgresConnectionOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: DatabaseSslOption;
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

/**
 * Parse a `postgres://` / `postgresql://` URI into discrete connection fields.
 * Query params used by managed providers (`sslmode`, `supa*`) are ignored here;
 * TLS is decided by `DATABASE_SSL` / host heuristics (same as Nest + admin).
 */
export function parseDatabaseUrl(databaseUrl: string): Omit<PostgresConnectionOptions, "ssl"> {
  const normalized = databaseUrl.trim().replace(/^postgres:\/\//i, "postgresql://");
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
 * Resolve Postgres options for TypeORM from either `DATABASE_URL` or discrete
 * `DATABASE_*` vars. Prefer `DATABASE_URL` when set (same URI as admin/marketing).
 *
 * On Vercel builds, loopback defaults are rejected with a clear error instead of
 * `ECONNREFUSED 127.0.0.1:5432`.
 */
export function resolvePostgresConnection(
  env: NodeJS.ProcessEnv = process.env,
): PostgresConnectionOptions {
  const url = env.DATABASE_URL?.trim();
  const fromUrl = url ? parseDatabaseUrl(url) : null;

  const host = fromUrl?.host ?? env.DATABASE_HOST?.trim() ?? "localhost";
  const port = fromUrl?.port ?? parsePort(env.DATABASE_PORT, 5432);
  const username = fromUrl?.username ?? env.DATABASE_USER?.trim() ?? "postgres";
  const password = fromUrl?.password ?? env.DATABASE_PASSWORD ?? "postgres";
  const database = fromUrl?.database ?? env.DATABASE_NAME?.trim() ?? "munib_tracker";

  if (env.VERCEL && isLoopbackHost(host)) {
    throw new Error(
      "Postgres resolved to localhost during a Vercel build/deploy. " +
        "Set DATABASE_URL (Supabase Session pooler URI) or DATABASE_HOST / DATABASE_PORT / " +
        "DATABASE_USER / DATABASE_PASSWORD / DATABASE_NAME on the API Vercel project " +
        "(available to Production builds). See apps/api/.env.example.",
    );
  }

  const sslEnabled =
    envFlagTrue(env.DATABASE_SSL) ||
    hostRequiresDatabaseSsl(host) ||
    (typeof url === "string" && /[?&]sslmode=require\b/i.test(url));

  return {
    host,
    port,
    username,
    password,
    database,
    ssl: resolveDatabaseSsl({
      enabled: sslEnabled,
      rejectUnauthorized: !envFlagFalse(env.DATABASE_SSL_REJECT_UNAUTHORIZED),
      ca: env.DATABASE_CA_CERT,
    }),
  };
}
