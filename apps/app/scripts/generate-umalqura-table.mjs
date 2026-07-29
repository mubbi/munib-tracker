#!/usr/bin/env node
/**
 * Regenerates `src/lib/hijri-umalqura-data.ts` from ICU's official Umm al-Qura
 * table (Node ships full-icu, calendar `islamic-umalqura`, years 1300–1600 AH).
 *
 * Usage: node apps/app/scripts/generate-umalqura-table.mjs
 *
 * Each Hijri year is encoded as a 12-bit mask (bit i set ⇒ month i+1 has 30
 * days). Month lengths in Umm al-Qura are always 29 or 30 days, so the mask
 * plus the epoch JDN of 1 Muharram 1300 reconstructs every month start.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const START_YEAR = 1300;
const END_YEAR = 1600;

/** Gregorian calendar day → integer Julian Day Number (matches hijri.ts). */
function gregorianToJDN(gy, gm, gd) {
  const a = Math.floor((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  return (
    gd +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

const fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function hijriOf(ms) {
  const parts = fmt.formatToParts(ms);
  const get = (type) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

const DAY_MS = 86_400_000;
// 1300-01-01 AH = 1882-11-12 CE (probed from ICU, verified below).
const startMs = Date.UTC(1882, 10, 12, 12);
{
  const h = hijriOf(startMs);
  if (h.year !== START_YEAR || h.month !== 1 || h.day !== 1) {
    throw new Error(`Epoch mismatch: expected 1300-01-01, got ${h.year}-${h.month}-${h.day}`);
  }
  const prev = hijriOf(startMs - DAY_MS);
  if (prev.year !== START_YEAR - 1) throw new Error("Day before epoch is not 1299 AH");
}

// Walk day by day collecting the length of every month in [START_YEAR, END_YEAR].
const monthLengths = []; // flat: (year - START_YEAR) * 12 + (month - 1)
let ms = startMs;
let current = { year: START_YEAR, month: 1 };
let count = 0;
for (;;) {
  count += 1;
  ms += DAY_MS;
  const h = hijriOf(ms);
  if (h.year !== current.year || h.month !== current.month) {
    if (count !== 29 && count !== 30) {
      throw new Error(`Month ${current.year}-${current.month} has ${count} days`);
    }
    monthLengths.push(count);
    count = 0;
    if (current.year === END_YEAR && current.month === 12) break;
    current = { year: h.year, month: h.month };
    if (h.day !== 1) throw new Error(`Discontinuity at ${h.year}-${h.month}-${h.day}`);
  }
}

const yearCount = END_YEAR - START_YEAR + 1;
if (monthLengths.length !== yearCount * 12) {
  throw new Error(`Expected ${yearCount * 12} months, got ${monthLengths.length}`);
}

const masks = [];
for (let y = 0; y < yearCount; y += 1) {
  let mask = 0;
  for (let m = 0; m < 12; m += 1) {
    if (monthLengths[y * 12 + m] === 30) mask |= 1 << m;
  }
  masks.push(mask);
}

const epochJDN = gregorianToJDN(1882, 11, 12);
const totalDays = monthLengths.reduce((a, b) => a + b, 0);

const lines = [];
for (let i = 0; i < masks.length; i += 16) {
  lines.push(`  ${masks.slice(i, i + 16).join(", ")},`);
}

const out = `/**
 * Umm al-Qura month-length table, generated from ICU (calendar
 * \`islamic-umalqura\`) by \`scripts/generate-umalqura-table.mjs\`.
 * Do not edit by hand — re-run the script to regenerate.
 *
 * Covers ${START_YEAR}–${END_YEAR} AH (1882-11-12 – 2174-11-25 CE). Each entry is a
 * 12-bit mask for one Hijri year: bit i set ⇒ month i+1 has 30 days
 * (otherwise 29).
 */

/** First Hijri year covered by the table. */
export const UMALQURA_START_YEAR = ${START_YEAR};

/** Last Hijri year covered by the table (inclusive). */
export const UMALQURA_END_YEAR = ${END_YEAR};

/** Julian Day Number of 1 Muharram ${START_YEAR} AH (1882-11-12 CE). */
export const UMALQURA_EPOCH_JDN = ${epochJDN};

/** Total days covered by the table. */
export const UMALQURA_TOTAL_DAYS = ${totalDays};

/** Per-year 12-bit month-length masks for ${START_YEAR}–${END_YEAR} AH. */
export const UMALQURA_MONTH_MASKS: readonly number[] = [
${lines.join("\n")}
];
`;

const target = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "lib",
  "hijri-umalqura-data.ts",
);
writeFileSync(target, out);
console.log(`Wrote ${target}`);
console.log(`years=${yearCount} epochJDN=${epochJDN} totalDays=${totalDays}`);
console.log(`ICU version: ${process.versions.icu}`);
