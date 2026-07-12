import { createPgDatabase } from "@munib-tracker/db/pg/createDb";
import type * as schema from "@munib-tracker/db/schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type pg from "pg";

type MarketingDb = NodePgDatabase<typeof schema>;

let pool: pg.Pool | null = null;
let db: MarketingDb | null = null;
let activeDatabaseUrl: string | null = null;

/** Serverless-friendly pool size — one connection per Vercel function instance. */
const SERVERLESS_POOL_MAX = 1;

export function getDb(): MarketingDb {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  if (db && activeDatabaseUrl === databaseUrl) {
    return db;
  }

  if (pool) {
    void pool.end();
    pool = null;
    db = null;
  }

  const client = createPgDatabase({ databaseUrl, max: SERVERLESS_POOL_MAX });
  pool = client.pool;
  db = client.db as MarketingDb;
  activeDatabaseUrl = databaseUrl;
  return db;
}
