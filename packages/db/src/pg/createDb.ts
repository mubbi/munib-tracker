import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../schema";
import { preparePgConnection } from "./preparePgConnection";

const { Pool } = pg;

export function createPgDatabase(options?: { databaseUrl?: string; max?: number }) {
  const rawUrl = (options?.databaseUrl ?? process.env.DATABASE_URL)?.trim();
  if (!rawUrl) {
    throw new Error(
      "DATABASE_URL must be set (apps/admin or apps/marketing-web .env.local — see each app's .env.example). " +
        "On Vercel use the same Session pooler URI as the API project (name it DATABASE_URL, not POSTGRES_URL).",
    );
  }

  const pgConnection = preparePgConnection(rawUrl);
  const pool = new Pool({
    connectionString: pgConnection.connectionString,
    ssl: pgConnection.ssl,
    max: options?.max ?? 10,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 20_000,
  });
  const db = drizzle(pool, { schema });
  return { db, pool };
}
