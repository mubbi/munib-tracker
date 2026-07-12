import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type PgSslOption = { rejectUnauthorized: boolean; ca?: string };

export type PreparedPgConnection = {
  connectionString: string;
  ssl?: PgSslOption;
};

const SUPABASE_CA_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../certs/supabase-root-2021.crt",
);

let supabaseCaCache: string | null | undefined;

function getSupabaseCa(): string | undefined {
  if (supabaseCaCache !== undefined) {
    return supabaseCaCache ?? undefined;
  }
  try {
    supabaseCaCache = readFileSync(SUPABASE_CA_PATH, "utf8");
  } catch {
    supabaseCaCache = null;
  }
  return supabaseCaCache ?? undefined;
}

export function isLocalHost(hostname: string): boolean {
  const h = hostname.trim().toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1";
}

export function isSupabaseHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h.endsWith(".supabase.com") || h.endsWith(".supabase.co") || h.includes("supabase");
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

/**
 * Drop dashboard artifacts (`supa*`) and `sslmode` when the pg `ssl` option
 * supplies verification (avoids pg-connection-string v2 mapping require→verify-full).
 */
export function sanitizeDatabaseUrl(url: string, options?: { stripSslMode?: boolean }): string {
  const usesPostgresScheme = /^postgres:\/\//i.test(url);
  try {
    const parsed = new URL(normalizePgUrl(url));
    for (const key of [...parsed.searchParams.keys()]) {
      if (key.startsWith("supa") || (options?.stripSslMode && key === "sslmode")) {
        parsed.searchParams.delete(key);
      }
    }
    let out = parsed.toString();
    if (usesPostgresScheme) {
      out = out.replace(/^postgresql:/i, "postgres:");
    }
    return out;
  } catch {
    return url;
  }
}

/** Transaction poolers (Supabase :6543 / pgbouncer=true) cannot run DDL reliably. */
export function isTransactionPoolerUrl(url: string): boolean {
  try {
    const parsed = new URL(normalizePgUrl(url));
    if (parsed.port === "6543") return true;
    if (parsed.searchParams.get("pgbouncer") === "true") return true;
    return false;
  } catch {
    return false;
  }
}

/** Upgrade transaction-pooler URLs to session mode (port 5432) for migrations. */
export function toSessionPoolerUrl(url: string): string {
  const parsed = new URL(normalizePgUrl(url));
  if (parsed.port === "6543") parsed.port = "5432";
  parsed.searchParams.delete("pgbouncer");
  return restorePgScheme(parsed.toString(), url);
}

/**
 * URL for schema migrations: `DATABASE_MIGRATE_URL`, else `DATABASE_URL` with
 * transaction→session pooler upgrade (same pattern as Expense Trail).
 */
export function resolveMigrateDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  const explicit = env.DATABASE_MIGRATE_URL?.trim();
  const runtime = env.DATABASE_URL?.trim();
  const candidate = explicit || runtime;
  if (!candidate) return undefined;
  if (!isTransactionPoolerUrl(candidate)) return candidate;
  return toSessionPoolerUrl(candidate);
}

function envFlagTrue(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

function envFlagFalse(value: string | undefined): boolean {
  return value === "false" || value === "0";
}

function shouldRelaxSsl(url: string, env: NodeJS.ProcessEnv): boolean {
  if (
    envFlagTrue(env.DATABASE_SSL_NO_VERIFY) ||
    envFlagFalse(env.DATABASE_SSL_REJECT_UNAUTHORIZED)
  ) {
    return true;
  }
  try {
    const { searchParams } = new URL(normalizePgUrl(url));
    return searchParams.get("sslmode") === "no-verify";
  } catch {
    return false;
  }
}

function requiresSsl(url: string, env: NodeJS.ProcessEnv): boolean {
  try {
    const parsed = new URL(normalizePgUrl(url));
    if (isLocalHost(parsed.hostname)) return false;
    const mode = parsed.searchParams.get("sslmode");
    if (mode === "disable") return false;
    if (mode === "require" || mode === "verify-full" || mode === "verify-ca") return true;
    if (envFlagTrue(env.DATABASE_SSL)) return true;
    return (
      isSupabaseHost(parsed.hostname) ||
      parsed.hostname.includes("neon.tech") ||
      parsed.hostname.includes("amazonaws.com")
    );
  } catch {
    return false;
  }
}

function resolveCa(url: string, env: NodeJS.ProcessEnv): string | undefined {
  const inline = env.DATABASE_CA_CERT?.trim() || env.DATABASE_SSL_CA?.trim();
  if (inline) {
    // Inline PEM (literal \n) or a filesystem path.
    if (inline.includes("BEGIN CERTIFICATE")) {
      return inline.replace(/\\n/g, "\n");
    }
    try {
      return readFileSync(inline, "utf8");
    } catch {
      return inline.replace(/\\n/g, "\n");
    }
  }

  try {
    const { hostname } = new URL(normalizePgUrl(url));
    if (isSupabaseHost(hostname)) {
      return getSupabaseCa();
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/**
 * Build a `pg` Pool-friendly connection string + SSL options (Expense Trail pattern).
 * Strips invalid `supa*` query params that break node-postgres.
 */
export function preparePgConnection(
  url: string,
  env: NodeJS.ProcessEnv = process.env,
): PreparedPgConnection {
  const relaxed = shouldRelaxSsl(url, env);
  const needsSsl = requiresSsl(url, env) || relaxed;

  if (!needsSsl) {
    return { connectionString: sanitizeDatabaseUrl(url, { stripSslMode: false }) };
  }

  if (relaxed) {
    return {
      connectionString: sanitizeDatabaseUrl(url, { stripSslMode: true }),
      ssl: { rejectUnauthorized: false },
    };
  }

  const ca = resolveCa(url, env);
  return {
    connectionString: sanitizeDatabaseUrl(url, { stripSslMode: true }),
    ssl: {
      rejectUnauthorized: true,
      ...(ca ? { ca } : {}),
    },
  };
}
