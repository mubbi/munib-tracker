import { userMediaTable, usersTable } from "@munib-tracker/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../db";

export async function listUserMedia(limit = 50, offset = 0) {
  const db = getDb();
  return db
    .select({
      id: userMediaTable.id,
      userId: userMediaTable.userId,
      userEmail: usersTable.email,
      mimeType: userMediaTable.mimeType,
      filename: userMediaTable.filename,
      sizeBytes: userMediaTable.sizeBytes,
      storagePath: userMediaTable.storagePath,
      createdAt: userMediaTable.createdAt,
    })
    .from(userMediaTable)
    .leftJoin(usersTable, eq(userMediaTable.userId, usersTable.id))
    .orderBy(desc(userMediaTable.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function countUserMedia(): Promise<number> {
  const db = getDb();
  const [row] = await db.select({ count: count() }).from(userMediaTable);
  return row?.count ?? 0;
}

export async function getSyncEntityCounts() {
  const db = getDb();
  const { syncRecordsTable } = await import("@munib-tracker/db/schema");
  return db
    .select({
      entity: syncRecordsTable.entity,
      count: count(),
      latest: sql<Date>`max(${syncRecordsTable.updatedAt})`,
    })
    .from(syncRecordsTable)
    .groupBy(syncRecordsTable.entity)
    .orderBy(desc(count()));
}
