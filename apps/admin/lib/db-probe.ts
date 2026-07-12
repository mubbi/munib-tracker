import { adminUsersTable } from "@munib-tracker/db/schema";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  classifyAdminDatabaseError,
  extractPgError,
  sanitizeDatabaseErrorDetail,
} from "@/lib/db-errors";
import { getAdminEnv } from "@/lib/env";

export type AdminDbProbeResult = {
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

function describeDatabaseUrl(url: string): { host: string; port: string; database: string } {
  const normalized = url.replace(/^postgres:\/\//i, "postgresql://");
  try {
    const parsed = new URL(normalized);
    const database = parsed.pathname.replace(/^\//, "") || "postgres";
    return { host: parsed.hostname, port: parsed.port || "5432", database };
  } catch {
    return { host: "invalid", port: "?", database: "?" };
  }
}

export async function probeAdminDatabase(): Promise<AdminDbProbeResult> {
  const { DATABASE_URL } = getAdminEnv();
  if (!DATABASE_URL) {
    return {
      configured: false,
      connected: false,
      adminTables: false,
      database: "",
      host: "",
      port: "",
      errorCode: "not_configured",
      errorDetail: "DATABASE_URL is not set on this deployment.",
    };
  }

  const { host, port, database: urlDatabase } = describeDatabaseUrl(DATABASE_URL);

  try {
    const db = getDb();
    const ping = await db.execute(sql`select 1 as ok`);
    if (!ping.rows.length) {
      throw new Error("Postgres ping returned no rows");
    }

    const identity = await db.execute(sql`select current_database() as database_name`);
    const connectedDatabase = String(identity.rows[0]?.database_name ?? urlDatabase);

    await db.select({ id: adminUsersTable.id }).from(adminUsersTable).limit(1);

    return {
      configured: true,
      connected: true,
      adminTables: true,
      database: connectedDatabase,
      host,
      port,
    };
  } catch (error) {
    const pg = extractPgError(error);
    const detail = sanitizeDatabaseErrorDetail(error);
    const errorCode = classifyAdminDatabaseError(error);

    let connected = false;
    let connectedDatabase = urlDatabase;

    try {
      const db = getDb();
      const identity = await db.execute(sql`select current_database() as database_name`);
      connectedDatabase = String(identity.rows[0]?.database_name ?? urlDatabase);
      connected = true;
    } catch {
      connected = false;
    }

    return {
      configured: true,
      connected,
      adminTables: false,
      database: connectedDatabase,
      host,
      port,
      pgCode: pg?.code,
      errorCode,
      errorDetail: detail,
    };
  }
}
