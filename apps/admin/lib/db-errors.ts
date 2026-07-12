export type AdminDbErrorCode = "db_connect" | "db_schema" | "db_unavailable";

const PG_UNDEFINED_TABLE = "42P01";
const PG_CONNECTION_CODES = new Set([
  "08000",
  "08001",
  "08003",
  "08004",
  "08006",
  "08007",
  "57P01",
  "57P02",
  "57P03",
  "53300",
]);

type PgErrorLike = {
  code?: string;
  message?: string;
};

export function extractPgError(error: unknown): PgErrorLike | null {
  let current: unknown = error;
  for (let depth = 0; depth < 6 && current; depth += 1) {
    if (typeof current === "object" && current !== null) {
      const candidate = current as PgErrorLike;
      if (typeof candidate.code === "string" && typeof candidate.message === "string") {
        return candidate;
      }
    }
    if (current instanceof Error && current.cause) {
      current = current.cause;
      continue;
    }
    break;
  }
  return null;
}

export function classifyAdminDatabaseError(error: unknown): AdminDbErrorCode {
  const pg = extractPgError(error);
  if (pg?.code === PG_UNDEFINED_TABLE) {
    return "db_schema";
  }
  if (pg?.code && PG_CONNECTION_CODES.has(pg.code)) {
    return "db_connect";
  }

  const text = flattenError(error).toLowerCase();
  const pgMessage = pg?.message?.toLowerCase() ?? "";

  if (
    (text.includes("does not exist") || pgMessage.includes("does not exist")) &&
    (text.includes("relation") || text.includes("admin_") || pgMessage.includes("relation"))
  ) {
    return "db_schema";
  }

  if (
    text.includes("econnrefused") ||
    text.includes("etimedout") ||
    text.includes("enotfound") ||
    text.includes("connection terminated") ||
    text.includes("connection timeout") ||
    text.includes("password authentication failed") ||
    text.includes("certificate") ||
    text.includes("self_signed") ||
    text.includes("ssl") ||
    text.includes("getaddrinfo") ||
    pgMessage.includes("timeout") ||
    pgMessage.includes("terminated")
  ) {
    return "db_connect";
  }

  return "db_unavailable";
}

function flattenError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const parts = [error.message];
  const cause = (error as Error & { cause?: unknown }).cause;
  if (cause instanceof Error) {
    parts.push(cause.message);
  } else if (cause && typeof cause === "object" && "message" in cause) {
    const message = (cause as { message?: unknown }).message;
    if (typeof message === "string") parts.push(message);
  }
  return parts.join(" ");
}

export function adminDbErrorMessage(code: AdminDbErrorCode): string {
  switch (code) {
    case "db_schema":
      return "Admin tables were not found in the database this deployment connected to. Copy DATABASE_URL verbatim from the API Vercel project (same Supabase project and database name), redeploy admin, then check /api/health/db?iAmAdmin=1.";
    case "db_connect":
      return "Could not connect to Postgres. Set DATABASE_URL on the admin Vercel project to the exact same value as the API project.";
    default:
      return "Database error during sign-in. Open /api/health/db?iAmAdmin=1 for diagnostics and check Vercel function logs for the underlying Postgres error.";
  }
}

export function sanitizeDatabaseErrorDetail(error: unknown): string {
  const pg = extractPgError(error);
  const base = pg?.message ?? (error instanceof Error ? error.message : String(error));
  const code = pg?.code ? ` [${pg.code}]` : "";
  return `${base}${code}`
    .replace(/postgresql:\/\/[^\s]+/gi, "postgresql://***")
    .replace(/postgres:\/\/[^\s]+/gi, "postgres://***")
    .slice(0, 280);
}
