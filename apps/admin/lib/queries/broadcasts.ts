import { adminBroadcastsTable } from "@munib-tracker/db/schema";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";

export async function listAdminBroadcasts(limit = 20) {
  const db = getDb();
  return db
    .select()
    .from(adminBroadcastsTable)
    .orderBy(desc(adminBroadcastsTable.createdAt))
    .limit(limit);
}

export type AdminBroadcastRow = Awaited<ReturnType<typeof listAdminBroadcasts>>[number];

export async function getAdminBroadcast(id: number) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(adminBroadcastsTable)
    .where(eq(adminBroadcastsTable.id, id))
    .limit(1);
  return row ?? null;
}
