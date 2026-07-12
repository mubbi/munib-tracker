/**
 * Standalone Postgres probe — same stack as createPgDatabase (preparePgConnection + pg.Pool).
 * Usage (from apps/admin): pnpm test:db
 */

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adminRoot = path.join(__dirname, "..");
const supabaseCaPath = path.resolve(adminRoot, "../api/db/certs/supabase-root-2021.crt");

config({ path: path.join(adminRoot, ".env.local"), override: false });

if (!process.env.DATABASE_SSL_CA && fs.existsSync(supabaseCaPath)) {
  process.env.DATABASE_SSL_CA = supabaseCaPath;
}

const require = createRequire(import.meta.url);
const { preparePgConnection } = require("../../api/db/connection-ssl.cjs");
const pg = require("pg");

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

function sanitizeDatabaseUrl(url) {
  const usesPostgresScheme = /^postgres:\/\//i.test(url);
  const normalized = url.replace(/^postgres:\/\//i, "postgresql://");
  try {
    const parsed = new URL(normalized);
    for (const key of [...parsed.searchParams.keys()]) {
      if (key.startsWith("supa")) parsed.searchParams.delete(key);
    }
    let out = parsed.toString();
    if (usesPostgresScheme) out = out.replace(/^postgresql:/i, "postgres:");
    return out;
  } catch {
    return url;
  }
}

const runtimeUrl = sanitizeDatabaseUrl(rawUrl);
const { connectionString, ssl } = preparePgConnection(runtimeUrl);
console.log("DATABASE_URL target:", redactUrl(runtimeUrl));
console.log("SSL enabled:", Boolean(ssl));

const pool = new pg.Pool({
  connectionString,
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
