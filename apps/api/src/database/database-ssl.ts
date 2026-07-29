import { SUPABASE_ROOT_CA_2021 } from "./supabase-ca";

/** TLS options passed to the Postgres driver. */
export type DatabaseSslOption = false | { rejectUnauthorized: boolean; ca?: string };

export interface DatabaseSslInput {
  /** Whether SSL/TLS is enabled at all (`DATABASE_SSL`). */
  enabled: boolean;
  /** Whether to verify the server certificate chain (`DATABASE_SSL_REJECT_UNAUTHORIZED`). */
  rejectUnauthorized: boolean;
  /** Optional PEM CA bundle (`DATABASE_CA_CERT`), literal `\n` between lines. */
  ca?: string;
  /** Hostname — when Supabase, pin the bundled prod-ca-2021 if no explicit CA. */
  host?: string;
}

/**
 * Managed Postgres hosts that require TLS even when `DATABASE_SSL` is unset.
 * Matches admin Drizzle (`packages/db`) so Nest and admin share the same rule.
 */
export function hostRequiresDatabaseSsl(host: string | undefined | null): boolean {
  if (!host) return false;
  const h = host.toLowerCase();
  return h.includes("supabase") || h.includes("neon.tech") || h.includes("amazonaws.com");
}

export function isSupabaseHost(host: string | undefined | null): boolean {
  if (!host) return false;
  const h = host.toLowerCase();
  return h.includes("supabase");
}

/**
 * Builds the TypeORM/pg `ssl` option from validated config.
 *
 * When SSL is off we return `false` (plaintext, e.g. a local dev database on
 * `localhost`). When SSL is on we verify the certificate chain by default —
 * `rejectUnauthorized: false` silently accepts any certificate and defeats the
 * point of TLS by allowing an active MITM (CWE-295). For Supabase hosts we pin
 * the bundled prod-ca-2021 so Vercel builds don't fail with
 * `SELF_SIGNED_CERT_IN_CHAIN` (same pattern as Expense Trail / admin Drizzle).
 */
export function resolveDatabaseSsl({
  enabled,
  rejectUnauthorized,
  ca,
  host,
}: DatabaseSslInput): DatabaseSslOption {
  if (!enabled) {
    return false;
  }

  const expandedCa = ca?.trim()
    ? ca.replace(/\\n/g, "\n")
    : isSupabaseHost(host)
      ? SUPABASE_ROOT_CA_2021
      : undefined;

  return {
    rejectUnauthorized,
    ...(expandedCa ? { ca: expandedCa } : {}),
  };
}
