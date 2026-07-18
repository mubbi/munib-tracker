#!/usr/bin/env node
/**
 * Seed the first super_admin allowlist row.
 *
 * Usage (from repo root):
 *   node apps/admin/scripts/seed-admin.mjs you@example.com
 *
 * Loads DATABASE_URL from apps/admin/.env.local (or .env), then process.env.
 * Falls back to building a URL from apps/api DATABASE_* vars if needed.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const adminRoot = resolve(scriptDir, "..");
const apiRoot = resolve(adminRoot, "../api");
const supabaseCaPath = resolve(adminRoot, "../../packages/db/certs/supabase-root-2021.crt");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
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
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(resolve(adminRoot, ".env.local"));
loadEnvFile(resolve(adminRoot, ".env"));
loadEnvFile(resolve(apiRoot, ".env"));
loadEnvFile(resolve(apiRoot, ".env.local"));

function resolveDatabaseUrl() {
  const direct = process.env.DATABASE_URL?.trim();
  if (direct) return direct;

  const host = process.env.DATABASE_HOST?.trim();
  const name = process.env.DATABASE_NAME?.trim();
  if (!host || !name) return undefined;

  const user = encodeURIComponent(process.env.DATABASE_USER?.trim() || "postgres");
  const password = encodeURIComponent(process.env.DATABASE_PASSWORD ?? "");
  const port = process.env.DATABASE_PORT?.trim() || "5432";
  const auth = password ? `${user}:${password}` : user;
  return `postgresql://${auth}@${host}:${port}/${name}`;
}

function poolSslOptions(url) {
  try {
    const hostname = new URL(
      url.replace(/^postgres:\/\//i, "postgresql://"),
    ).hostname.toLowerCase();
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
      return undefined;
    }
    if (hostname.includes("supabase") && existsSync(supabaseCaPath)) {
      return { rejectUnauthorized: true, ca: readFileSync(supabaseCaPath, "utf8") };
    }
    if (
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false" ||
      process.env.DATABASE_SSL_NO_VERIFY === "1"
    ) {
      return { rejectUnauthorized: false };
    }
    return { rejectUnauthorized: true };
  } catch {
    return undefined;
  }
}

const email = process.argv[2]?.trim().toLowerCase();
if (!email?.includes("@")) {
  console.error("Usage: node apps/admin/scripts/seed-admin.mjs you@example.com");
  process.exit(1);
}

const url = resolveDatabaseUrl();
if (!url) {
  console.error(
    "DATABASE_URL is required (set in apps/admin/.env.local) or DATABASE_HOST/NAME in apps/api/.env",
  );
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: url, ssl: poolSslOptions(url) });
try {
  const existing = await pool.query(`SELECT id, role, enabled FROM admin_users WHERE email = $1`, [
    email,
  ]);
  if (existing.rows[0]) {
    console.log("Already exists:", existing.rows[0]);
  } else {
    const inserted = await pool.query(
      `INSERT INTO admin_users (email, role, enabled) VALUES ($1, 'super_admin', true)
       RETURNING id, email, role, enabled`,
      [email],
    );
    console.log("Created:", inserted.rows[0]);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Seed failed:", message);
  if (/relation ["']?admin_users["']? does not exist/i.test(message)) {
    console.error("Run migrations first: pnpm migration:run");
  }
  process.exit(1);
} finally {
  await pool.end();
}
