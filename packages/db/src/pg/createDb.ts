import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../schema";

const { Pool } = pg;

function prepareSsl(url: string): {
  connectionString: string;
  ssl?: { rejectUnauthorized: boolean };
} {
  try {
    const usesPostgresScheme = /^postgres:\/\//i.test(url);
    const normalized = url.replace(/^postgres:\/\//i, "postgresql://");
    const parsed = new URL(normalized);
    const sslMode = parsed.searchParams.get("sslmode");
    for (const key of [...parsed.searchParams.keys()]) {
      if (key.startsWith("supa") || key === "sslmode") {
        parsed.searchParams.delete(key);
      }
    }
    let connectionString = parsed.toString();
    if (usesPostgresScheme) {
      connectionString = connectionString.replace(/^postgresql:/i, "postgres:");
    }

    const host = parsed.hostname;
    const needsSsl =
      process.env.DATABASE_SSL === "true" ||
      sslMode === "require" ||
      host.includes("supabase") ||
      host.includes("neon.tech") ||
      host.includes("amazonaws.com");

    if (!needsSsl) {
      return { connectionString };
    }

    return {
      connectionString,
      ssl: {
        rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
      },
    };
  } catch {
    return { connectionString: url };
  }
}

export function createPgDatabase(options?: { databaseUrl?: string; max?: number }) {
  const rawUrl = (options?.databaseUrl ?? process.env.DATABASE_URL)?.trim();
  if (!rawUrl) {
    throw new Error(
      "DATABASE_URL must be set (apps/admin or apps/marketing-web .env.local — see each app's .env.example).",
    );
  }

  const pgConnection = prepareSsl(rawUrl);
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
