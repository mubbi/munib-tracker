/** Probe fields; kept structural so this module stays free of DB imports. */
export type DbProbeLike = {
  configured: boolean;
  connected: boolean;
  adminTables: boolean;
  database: string;
  host: string;
  port: string;
  pgCode?: string;
  errorCode?: string;
  errorDetail?: string;
};

/**
 * Shape `/api/health/db` output. `?iAmAdmin=1` is a public UI reveal, not a secret,
 * so anonymous callers only learn coarse booleans + a stable error code; DB host,
 * port, database name, pg code and driver detail need an admin session or the
 * cron bearer secret.
 */
export function dbProbeResponseBody(
  probe: DbProbeLike,
  detailed: boolean,
): Record<string, unknown> {
  const ok = probe.connected && probe.adminTables;
  if (detailed) {
    return { ok, ...probe };
  }
  return {
    ok,
    configured: probe.configured,
    connected: probe.connected,
    adminTables: probe.adminTables,
    ...(probe.errorCode ? { errorCode: probe.errorCode } : {}),
  };
}
