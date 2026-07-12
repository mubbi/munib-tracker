import { randomUUID } from "node:crypto";
import { contactMessagesTable } from "@munib-tracker/db/schema";
import { and, count, eq, gte } from "drizzle-orm";
import { getDb } from "./db";

/** Max contact submissions per email address within the rolling window. */
export const CONTACT_RATE_LIMIT = 2;
/** Rolling window for contact rate limiting. */
export const CONTACT_RATE_WINDOW_MS = 24 * 60 * 60 * 1000;

export type InsertContactMessageInput = {
  name: string;
  email: string;
  message: string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function countRecentContactMessagesByEmail(email: string): Promise<number> {
  const db = getDb();
  const since = new Date(Date.now() - CONTACT_RATE_WINDOW_MS);
  const [row] = await db
    .select({ count: count() })
    .from(contactMessagesTable)
    .where(and(eq(contactMessagesTable.email, email), gte(contactMessagesTable.createdAt, since)));
  return row?.count ?? 0;
}

export async function insertContactMessage(input: InsertContactMessageInput): Promise<string> {
  const db = getDb();
  const id = randomUUID();
  const now = new Date();
  await db.insert(contactMessagesTable).values({
    id,
    name: input.name,
    email: input.email,
    message: input.message,
    status: "new",
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}
