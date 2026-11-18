import { syncRecordsTable } from "@munib-tracker/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";
import { getDb } from "../db";
import {
  PRACTICE_ENTITIES,
  type PracticePrefsStats,
  type PracticeSessionStats,
  summarizePrefs,
  summarizeSessions,
} from "../quran-practice-stats";

/**
 * Qur'an practice (module 15): aggregates from the three synced practice blobs.
 * Only signed-in users sync, and each keeps their newest 30 session summaries.
 *
 * `sync_records.data` is declared `jsonb` in Drizzle but is `text` in the real
 * DDL (TypeORM `simple-json`), so JSON reads cast with `::text::jsonb` — safe for
 * either column type. Prefs and sessions are small and summarised in TypeScript
 * (`quran-practice-stats.ts`); memorization maps can hold 6,236 records per user,
 * so they are summarised in SQL and never leave the database.
 */

export type MemorizationStats = {
  users: number;
  ayahsTracked: number;
  dueToday: number;
  needsRevision: number;
  /** Records at the top of the review ladder (30-day interval). */
  atTopOfLadder: number;
};

export type QuranPracticeOverview = {
  sessions: PracticeSessionStats;
  prefs: PracticePrefsStats;
  memorization: MemorizationStats;
  generatedAt: Date;
};

async function liveBlobs(entity: string): Promise<string[]> {
  const db = getDb();
  const rows = await db
    .select({ data: sql<string>`${syncRecordsTable.data}::text` })
    .from(syncRecordsTable)
    .where(and(eq(syncRecordsTable.entity, entity), isNull(syncRecordsTable.deletedAt)));
  return rows.map((r) => r.data);
}

/** `today` is a `YYYY-MM-DD` day; `nextReviewAt` (`n`) uses the same format. */
async function memorizationStats(today: string): Promise<MemorizationStats> {
  const db = getDb();
  const result = await db.execute(sql`
    with maps as (
      select (${syncRecordsTable.data})::text::jsonb -> 'value' -> 'records' as records
      from ${syncRecordsTable}
      where ${syncRecordsTable.entity} = ${PRACTICE_ENTITIES.memorization}
        and ${syncRecordsTable.deletedAt} is null
    ),
    usable as (
      select records from maps where jsonb_typeof(records) = 'object'
    ),
    entries as (
      select e.value as r from usable, jsonb_each(usable.records) as e
    )
    select
      (select count(*) from usable where records <> '{}'::jsonb) as users,
      (select count(*) from entries) as ayahs_tracked,
      (select count(*) from entries where r ->> 'n' <= ${today}) as due_today,
      (select count(*) from entries where r ->> 's' = 'r') as needs_revision,
      (select count(*) from entries
        where (r ->> 'i') ~ '^[0-9]+$' and (r ->> 'i')::int >= 30) as at_top
  `);
  const row = (result.rows[0] ?? {}) as Record<string, unknown>;
  return {
    users: Number(row.users ?? 0),
    ayahsTracked: Number(row.ayahs_tracked ?? 0),
    dueToday: Number(row.due_today ?? 0),
    needsRevision: Number(row.needs_revision ?? 0),
    atTopOfLadder: Number(row.at_top ?? 0),
  };
}

function utcDay(now: Date): string {
  return now.toISOString().slice(0, 10);
}

export async function getQuranPracticeOverview(now = new Date()): Promise<QuranPracticeOverview> {
  const [sessionBlobs, prefBlobs, memorization] = await Promise.all([
    liveBlobs(PRACTICE_ENTITIES.sessions),
    liveBlobs(PRACTICE_ENTITIES.prefs),
    // Users are spread across time zones; a UTC day is close enough for a backlog count.
    memorizationStats(utcDay(now)),
  ]);
  return {
    sessions: summarizeSessions(sessionBlobs, now),
    prefs: summarizePrefs(prefBlobs),
    memorization,
    generatedAt: now,
  };
}
