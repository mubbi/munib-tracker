import synonyms from "./header-synonyms.json";
import { normaliseLabel } from "./normalise";
import type { TimetablePrayer } from "./types";

/**
 * Step 4 of the parser: header / qualifier recognition from the multilingual
 * synonym table (`header-synonyms.json` — data, extendable without code).
 */

export type QualifierKind = "adhan" | "iqamah" | "khutbah";

export type LabelInfo =
  | { type: "prayer"; prayer: TimetablePrayer | "jumuah"; kind?: QualifierKind }
  | { type: "qualifier"; kind: QualifierKind }
  | { type: "other" };

const PRAYER_KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha", "jumuah"] as const;
const QUALIFIER_KEYS = ["adhan", "iqamah", "khutbah"] as const;

const PRAYER_LABELS = new Map<string, TimetablePrayer | "jumuah">();
const QUALIFIER_LABELS = new Map<string, QualifierKind>();
const OTHER_LABELS = new Set<string>();

for (const prayer of PRAYER_KEYS) {
  for (const word of synonyms.prayers[prayer]) PRAYER_LABELS.set(normaliseLabel(word), prayer);
}
for (const kind of QUALIFIER_KEYS) {
  for (const word of synonyms.qualifiers[kind]) QUALIFIER_LABELS.set(normaliseLabel(word), kind);
}
for (const word of synonyms.other) OTHER_LABELS.add(normaliseLabel(word));

/** Arabic article / conjunction prefixes that may precede a label ("الفجر", "والعصر"). */
const ARABIC_PREFIXES = ["وال", "ال", "و"];

function lookup(key: string): LabelInfo | null {
  const prayer = PRAYER_LABELS.get(key);
  if (prayer) return { type: "prayer", prayer };
  const kind = QUALIFIER_LABELS.get(key);
  if (kind) return { type: "qualifier", kind };
  if (OTHER_LABELS.has(key)) return { type: "other" };
  return null;
}

/** Classifies a word (or a joined pair of words) as a prayer, a begins/iqamah qualifier, or an ignored column label. */
export function classifyLabel(text: string): LabelInfo | null {
  const key = normaliseLabel(text);
  if (key.length < 2 || /^\d+$/.test(key)) return null;
  const direct = lookup(key);
  if (direct) return direct;
  for (const prefix of ARABIC_PREFIXES) {
    if (key.startsWith(prefix) && key.length > prefix.length + 1) {
      const hit = lookup(key.slice(prefix.length));
      if (hit) return hit;
    }
  }
  // "Fajr-Begins", "ZuhrJamaat": a prayer glued to its qualifier.
  for (const [word, prayer] of PRAYER_LABELS) {
    if (word.length < 3) continue;
    if (key.startsWith(word)) {
      const kind = QUALIFIER_LABELS.get(key.slice(word.length));
      if (kind) return { type: "prayer", prayer, kind };
    } else if (key.endsWith(word)) {
      const kind = QUALIFIER_LABELS.get(key.slice(0, key.length - word.length));
      if (kind) return { type: "prayer", prayer, kind };
    }
  }
  return null;
}

export type DateColumnRole = "gregorian" | "hijri";

const DATE_COLUMN_LABELS = new Map<string, DateColumnRole>();
for (const role of ["gregorian", "hijri"] as const) {
  for (const word of synonyms.dateColumns[role]) DATE_COLUMN_LABELS.set(normaliseLabel(word), role);
}

/** What a header word says about a column of day numbers ("Date" vs "Ramadan" / "Hijri"). */
export function dateColumnRole(text: string): DateColumnRole | null {
  const key = normaliseLabel(text);
  if (key.length < 2) return null;
  const direct = DATE_COLUMN_LABELS.get(key);
  if (direct) return direct;
  for (const prefix of ARABIC_PREFIXES) {
    if (key.startsWith(prefix) && key.length > prefix.length + 1) {
      const hit = DATE_COLUMN_LABELS.get(key.slice(prefix.length));
      if (hit) return hit;
    }
  }
  return null;
}

const MONTHS = [
  ["january", "jan"],
  ["february", "feb"],
  ["march", "mar"],
  ["april", "apr"],
  ["may"],
  ["june", "jun"],
  ["july", "jul"],
  ["august", "aug"],
  ["september", "sep", "sept"],
  ["october", "oct"],
  ["november", "nov"],
  ["december", "dec"],
] as const;

/** Gregorian month number (1–12) for an English month name, else null. */
export function monthFromText(text: string): number | null {
  const key = normaliseLabel(text);
  const index = MONTHS.findIndex((names) => (names as readonly string[]).includes(key));
  return index >= 0 ? index + 1 : null;
}
