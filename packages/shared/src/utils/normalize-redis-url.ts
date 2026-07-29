/**
 * Normalize REDIS_URL for managed Redis providers.
 *
 * Redis Cloud may expose either plaintext (`redis://`) or TLS (`rediss://`)
 * depending on whether TLS is enabled in the console. Never rewrite the scheme
 * automatically — a forced `rediss://` against a non-TLS endpoint fails with
 * SSL "wrong version number" / connection timeout.
 *
 * Optional override: `REDIS_TLS=true|false` forces the scheme regardless of
 * what was pasted from the dashboard.
 */

const REDIS_CLOUD_HOST_RE = /(?:^|\.)(?:db\.redis\.io|redislabs\.com|redis-cloud\.com)$/i;

export function isRedisCloudHost(host: string | undefined | null): boolean {
  if (!host) return false;
  return REDIS_CLOUD_HOST_RE.test(host.trim());
}

export type NormalizeRedisUrlOptions = {
  /**
   * When `true`, force `rediss://`. When `false`, force `redis://`.
   * When omitted, keep the URL scheme as written.
   */
  forceTls?: boolean;
};

/**
 * Returns a URL safe to pass to `node-redis` `createClient({ url })`.
 */
export function normalizeRedisUrl(rawUrl: string, options: NormalizeRedisUrlOptions = {}): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return trimmed;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return trimmed;
  }

  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== "redis:" && protocol !== "rediss:") {
    return trimmed;
  }

  if (options.forceTls === true) {
    parsed.protocol = "rediss:";
    return parsed.toString();
  }
  if (options.forceTls === false) {
    parsed.protocol = "redis:";
    return parsed.toString();
  }

  return trimmed;
}

/** Parse `REDIS_TLS` / similar env flags into a forceTls option. */
export function parseRedisTlsEnvFlag(value: string | undefined): boolean | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  const v = value.trim().toLowerCase();
  if (v === "true" || v === "1" || v === "yes") return true;
  if (v === "false" || v === "0" || v === "no") return false;
  return undefined;
}
