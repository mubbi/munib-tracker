import { QAZA_PRAYERS } from "../constants";
import type { PrayerStatus, QazaPrayer } from "../types/prayer";

/**
 * Bulk historical prayer import (NF-0.8). Pure, dependency-free parser + validator
 * for pasted JSON or CSV, so the app can preview counts + per-row errors before
 * writing anything. The app layer turns each {@link ImportedPrayerRow} into a
 * `PrayerLog` with `source: "bulk_import"`.
 */

/** A single validated row ready to be written as a bulk-import prayer log. */
export interface ImportedPrayerRow {
  /** ISO date YYYY-MM-DD (user's local calendar day). */
  date: string;
  prayerId: QazaPrayer;
  status: PrayerStatus;
}

export interface ImportError {
  /** 1-based index of the offending row (array element or CSV data line). */
  row: number;
  message: string;
  raw?: string;
}

export interface ParsedPrayerImport {
  /** Valid rows, de-duplicated per (date, prayerId) with the last occurrence winning. */
  rows: ImportedPrayerRow[];
  errors: ImportError[];
  /** Inclusive date span of the valid rows, or null when there are none. */
  dateRange: { from: string; to: string } | null;
  /** Number of duplicate (date, prayerId) rows collapsed away. */
  duplicates: number;
}

/** Prayers accepted for import — the five fard plus Witr (the make-up-relevant set). */
const IMPORTABLE_PRAYERS = new Set<string>(QAZA_PRAYERS);
/** Statuses accepted for import — "pending" is excluded (it means "not logged"). */
const IMPORTABLE_STATUSES = new Set<PrayerStatus>(["completed", "missed", "delayed", "qaza"]);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** True when `value` is a real calendar date in strict YYYY-MM-DD form. */
function isValidIsoDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false;
  const parts = value.split("-");
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

type RawRow = { date?: unknown; prayerId?: unknown; status?: unknown };

/** Validates one raw row, returning either a normalized row or an error. */
function validateRow(
  raw: RawRow,
  rowNumber: number,
  today: string,
): { ok: true; value: ImportedPrayerRow } | { ok: false; error: ImportError } {
  const date = typeof raw.date === "string" ? raw.date.trim() : "";
  const prayerId = typeof raw.prayerId === "string" ? raw.prayerId.trim().toLowerCase() : "";
  const status = typeof raw.status === "string" ? raw.status.trim().toLowerCase() : "";
  const rawText = `${date},${prayerId},${status}`;

  if (!isValidIsoDate(date)) {
    return {
      ok: false,
      error: { row: rowNumber, message: `Invalid date "${date}"`, raw: rawText },
    };
  }
  if (date > today) {
    return {
      ok: false,
      error: { row: rowNumber, message: `Future date "${date}" is not allowed`, raw: rawText },
    };
  }
  if (!IMPORTABLE_PRAYERS.has(prayerId)) {
    return {
      ok: false,
      error: { row: rowNumber, message: `Unknown prayer "${prayerId}"`, raw: rawText },
    };
  }
  if (!IMPORTABLE_STATUSES.has(status as PrayerStatus)) {
    return {
      ok: false,
      error: { row: rowNumber, message: `Unknown status "${status}"`, raw: rawText },
    };
  }
  return {
    ok: true,
    value: { date, prayerId: prayerId as QazaPrayer, status: status as PrayerStatus },
  };
}

/** Splits CSV text into raw rows, skipping a leading header row when present. */
function parseCsv(text: string): { rows: RawRow[]; lineNumbers: number[] } {
  const lines = text.split(/\r?\n/);
  const rows: RawRow[] = [];
  const lineNumbers: number[] = [];
  let dataIndex = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const cols = line.split(",").map((c) => c.trim());
    const col0 = cols[0] ?? "";
    const col1 = cols[1] ?? "";
    const col2 = cols[2] ?? "";
    // Skip a header row (first non-empty line that names the columns).
    if (dataIndex === 0 && /date/i.test(col0) && [col1, col2].some((c) => /prayer/i.test(c))) {
      continue;
    }
    dataIndex += 1;
    rows.push({ date: col0, prayerId: col1, status: col2 });
    lineNumbers.push(dataIndex);
  }
  return { rows, lineNumbers };
}

/**
 * Parses pasted JSON (array of `{ date, prayerId, status }`) or CSV
 * (`date,prayerId,status`, optional header) into validated rows + per-row errors.
 * Nothing is written — the caller previews the result and commits on confirm.
 * `today` (YYYY-MM-DD) bounds "no future dates"; defaults to the current day.
 */
export function parsePrayerImport(
  text: string,
  today: string = new Date().toISOString().slice(0, 10),
): ParsedPrayerImport {
  const trimmed = text.trim();
  const empty: ParsedPrayerImport = { rows: [], errors: [], dateRange: null, duplicates: 0 };
  if (!trimmed) return empty;

  let rawRows: RawRow[];
  let rowNumbers: number[];

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return { ...empty, errors: [{ row: 0, message: "Invalid JSON" }] };
    }
    const list = Array.isArray(parsed) ? parsed : [parsed];
    rawRows = list as RawRow[];
    rowNumbers = list.map((_, i) => i + 1);
  } else {
    const csv = parseCsv(trimmed);
    rawRows = csv.rows;
    rowNumbers = csv.lineNumbers;
  }

  const errors: ImportError[] = [];
  // Dedupe by (date, prayerId); a later row overrides an earlier one.
  const byKey = new Map<string, ImportedPrayerRow>();
  let duplicates = 0;

  rawRows.forEach((raw, i) => {
    const result = validateRow(raw ?? {}, rowNumbers[i] ?? i + 1, today);
    if (!result.ok) {
      errors.push(result.error);
      return;
    }
    const key = `${result.value.date}::${result.value.prayerId}`;
    if (byKey.has(key)) duplicates += 1;
    byKey.set(key, result.value);
  });

  const rows = [...byKey.values()].sort((a, b) =>
    a.date === b.date ? a.prayerId.localeCompare(b.prayerId) : a.date.localeCompare(b.date),
  );

  const first = rows[0];
  const last = rows[rows.length - 1];
  const dateRange = first && last ? { from: first.date, to: last.date } : null;

  return { rows, errors, dateRange, duplicates };
}
