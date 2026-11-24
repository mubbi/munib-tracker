import type { ColumnType } from "typeorm";

// SQLite (unit/e2e tests + `DATABASE_TYPE=sqlite`) uses `datetime`/`simple-json`;
// Postgres uses `timestamp`/`jsonb`. Mirrors the driver choice in
// `database.module.ts` so the same entities validate under both drivers.
export const usingSqlite =
  process.env.DATABASE_TYPE === "sqlite" || process.env.NODE_ENV === "test";
export const TIMESTAMP_TYPE: ColumnType = usingSqlite ? "datetime" : "timestamp";
export const JSON_COLUMN_TYPE: ColumnType = usingSqlite ? "simple-json" : "jsonb";
