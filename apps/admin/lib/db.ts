import { createPgDatabase } from "@munib-tracker/db/pg/createDb";
import type * as schema from "@munib-tracker/db/schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type pg from "pg";
import { getAdminEnv } from "./env";

type AdminDb = NodePgDatabase<typeof schema>;

let pool: pg.Pool | null = null;
let db: AdminDb | null = null;
let activeDatabaseUrl: string | null = null;

/** Serverless-friendly pool size — one connection per Vercel function instance. */
const SERVERLESS_POOL_MAX = 1;

export function getDb(): AdminDb {
  const { DATABASE_URL } = getAdminEnv();
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const runtimeUrl = DATABASE_URL.trim();

  if (db && activeDatabaseUrl === runtimeUrl) {
    return db;
  }

  if (pool) {
    void pool.end();
    pool = null;
    db = null;
  }

  const client = createPgDatabase({ databaseUrl: runtimeUrl, max: SERVERLESS_POOL_MAX });
  pool = client.pool;
  db = client.db as AdminDb;
  activeDatabaseUrl = runtimeUrl;
  return db;
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    db = null;
    activeDatabaseUrl = null;
  }
}
