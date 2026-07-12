import {
  CONTACT_MESSAGE_STATUSES,
  type ContactMessageStatus,
  contactMessagesTable,
} from "@munib-tracker/db/schema";
import { count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { getDb } from "../db";
import { dateRangeOn, whereAll } from "../query-conditions";

export type ContactMessageFilters = {
  status?: string;
  q?: string;
  from?: Date;
  to?: Date;
};

function contactWhere(filters: ContactMessageFilters): SQL | undefined {
  const trimmedQ = filters.q?.trim();
  return whereAll([
    filters.status ? eq(contactMessagesTable.status, filters.status) : undefined,
    dateRangeOn(contactMessagesTable.createdAt, filters.from, filters.to),
    trimmedQ
      ? or(
          ilike(contactMessagesTable.name, `%${trimmedQ}%`),
          ilike(contactMessagesTable.email, `%${trimmedQ}%`),
          ilike(contactMessagesTable.message, `%${trimmedQ}%`),
          eq(contactMessagesTable.id, trimmedQ),
        )
      : undefined,
  ]);
}

export async function listContactMessages(
  limit = 50,
  offset = 0,
  filters: ContactMessageFilters = {},
) {
  const db = getDb();
  const where = contactWhere(filters);
  return db
    .select({
      id: contactMessagesTable.id,
      name: contactMessagesTable.name,
      email: contactMessagesTable.email,
      message: contactMessagesTable.message,
      status: contactMessagesTable.status,
      adminNotes: contactMessagesTable.adminNotes,
      createdAt: contactMessagesTable.createdAt,
      updatedAt: contactMessagesTable.updatedAt,
    })
    .from(contactMessagesTable)
    .where(where)
    .orderBy(desc(contactMessagesTable.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getContactMessage(id: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(contactMessagesTable)
    .where(eq(contactMessagesTable.id, id))
    .limit(1);
  return row ?? null;
}

export async function getContactMessageStatusCounts() {
  const db = getDb();
  return db
    .select({ status: contactMessagesTable.status, count: count() })
    .from(contactMessagesTable)
    .groupBy(contactMessagesTable.status)
    .orderBy(desc(count()));
}

export async function updateContactMessageTriage(
  id: string,
  input: { status: ContactMessageStatus; adminNotes?: string | null },
) {
  const db = getDb();
  const [row] = await db
    .update(contactMessagesTable)
    .set({
      status: input.status,
      adminNotes: input.adminNotes === undefined ? undefined : input.adminNotes,
      updatedAt: new Date(),
    })
    .where(eq(contactMessagesTable.id, id))
    .returning({ id: contactMessagesTable.id });
  return row ?? null;
}

export type { ContactMessageStatus };
export { CONTACT_MESSAGE_STATUSES };
