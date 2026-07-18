/**
 * Standalone Postgres probe — same SSL rules as createPgDatabase / preparePgConnection.
 * Usage (from apps/admin): pnpm test:db
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminRoot = path.join(__dirname, "..");
const supabaseCaPath = path.resolve(adminRoot, "../../packages/db/certs/supabase-root-2021.crt");

config({ path: path.join(adminRoot, ".env.local"), override: false });

const rawUrl = process.env.DATABASE_URL?.trim();
if (!rawUrl) {
  console.error("DATABASE_URL is not set. Add it to apps/admin/.env.local");
  process.exit(1);
}

function redactUrl(url) {
  try {
    const parsed = new URL(url.replace(/^postgres:\/\//i, "postgresql://"));
    return `${parsed.protocol}//***@${parsed.hostname}:${parsed.port || "5432"}${parsed.pathname}`;
  } catch {
    return "(invalid url)";
  }
}

function prepareSsl(url) {
  try {
    const hostname = new URL(
      url.replace(/^postgres:\/\//i, "postgresql://"),
    ).hostname.toLowerCase();
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
      return undefined;
    }
    if (
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false" ||
      process.env.DATABASE_SSL_NO_VERIFY === "1" ||
      process.env.DATABASE_SSL_NO_VERIFY === "true"
    ) {
      return { rejectUnauthorized: false };
    }
    if (hostname.includes("supabase") && fs.existsSync(supabaseCaPath)) {
      return { rejectUnauthorized: true, ca: fs.readFileSync(supabaseCaPath, "utf8") };
    }
    return { rejectUnauthorized: true };
  } catch {
    return undefined;
  }
}

const ssl = prepareSsl(rawUrl);
console.log("DATABASE_URL target:", redactUrl(rawUrl));
console.log("SSL enabled:", Boolean(ssl));
console.log("SSL CA pinned:", Boolean(ssl?.ca));

const pool = new pg.Pool({
  connectionString: rawUrl,
  ssl,
  max: 1,
  connectionTimeoutMillis: 15_000,
});

try {
  const ping = await pool.query("select current_database() as database_name, 1 as ok");
  console.log("Ping OK:", ping.rows[0]);

  const table = await pool.query("select to_regclass('public.admin_users') as admin_users_table");
  console.log("admin_users:", table.rows[0]?.admin_users_table ?? "missing");

  const sample = await pool.query('select count(*)::int as n from "admin_users"');
  console.log("admin_users row count:", sample.rows[0]?.n);
} catch (error) {
  const err = error;
  console.error("Connection failed:", err instanceof Error ? err.message : err);
  const cause = err instanceof Error ? err.cause : undefined;
  if (cause instanceof Error) {
    console.error("Cause:", cause.message);
    if ("code" in cause && typeof cause.code === "string") {
      console.error("Postgres code:", cause.code);
    }
  }
  process.exit(1);
} finally {
  await pool.end();
}
