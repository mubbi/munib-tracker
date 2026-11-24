/**
 * Step 1 of the NF-3.12 timetable parser: text normalisation (pure).
 *
 * - Eastern Arabic (٠–٩) and Persian/Urdu (۰–۹) digits → ASCII.
 * - `٫ ٬ ، . h ; ,` separators → `:` (Arabic decimal / thousands separators and
 *   the Arabic comma U+060C included; plus `O`/`l` OCR confusions inside a time).
 * - `am/pm/ص/م` are stripped and kept as a meridiem flag.
 */

export type Meridiem = "am" | "pm";

export interface ParsedClock {
  hour: number;
  minute: number;
  meridiem: Meridiem | null;
}

const EASTERN_ARABIC_ZERO = 0x0660;
const PERSIAN_ZERO = 0x06f0;

/** Maps Eastern Arabic and Persian/Urdu digits to ASCII; other characters are kept. */
export function normaliseDigits(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= EASTERN_ARABIC_ZERO && code <= EASTERN_ARABIC_ZERO + 9) {
      out += String(code - EASTERN_ARABIC_ZERO);
    } else if (code >= PERSIAN_ZERO && code <= PERSIAN_ZERO + 9) {
      out += String(code - PERSIAN_ZERO);
    } else {
      out += ch;
    }
  }
  return out;
}

const MERIDIEM_SUFFIX = /(a\.?\s?m\.?|p\.?\s?m\.?|ص|م)$/i;
const MERIDIEM_ONLY = /^(a\.?\s?m\.?|p\.?\s?m\.?|ص|م|صباحا|مساء|مساءا)$/i;
const EDGE_PUNCTUATION = /^[\s()[\]{}*|,،"'`“”‘’•·–—_~]+|[\s()[\]{}*|,،"'`“”‘’•·–—_~]+$/g;
/**
 * Separators read as `:` — Arabic decimal ٫ (U+066B) and thousands ٬ (U+066C),
 * the Arabic comma ، (U+060C), dot, French "h", OCR'd semicolon / comma.
 */
export const TIME_SEPARATORS = /\s*[٫٬،.hH;,]\s*/g;
const TIME_SHAPE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

function meridiemOf(raw: string): Meridiem {
  const lower = raw.toLowerCase();
  if (lower.startsWith("a") || raw === "ص" || raw.startsWith("صباح")) return "am";
  return "pm";
}

/** A token that is only a meridiem marker ("PM", "a.m.", "م"). */
export function parseMeridiemToken(text: string): Meridiem | null {
  const clean = text.replace(EDGE_PUNCTUATION, "").trim();
  if (!clean || !MERIDIEM_ONLY.test(clean)) return null;
  return meridiemOf(clean);
}

/**
 * Parses one token's text as a wall-clock time. Returns null unless the whole
 * token is a time (after normalisation) — `12` or `1st` are not times.
 */
export function parseClockText(text: string): ParsedClock | null {
  let s = normaliseDigits(text).replace(EDGE_PUNCTUATION, "").trim();
  if (!s) return null;
  let meridiem: Meridiem | null = null;
  const suffix = s.match(MERIDIEM_SUFFIX);
  if (suffix && suffix.index !== undefined && suffix.index > 0) {
    meridiem = meridiemOf(suffix[0]);
    s = s.slice(0, suffix.index).trim();
  }
  s = s.replace(TIME_SEPARATORS, ":").replace(/\s*:\s*/g, ":");
  // OCR confusions are only fixed when the token is otherwise time-shaped.
  if (/^[\dOoIl|]{1,2}:[\dOoIl|]{2}$/.test(s)) {
    s = s.replace(/[Oo]/g, "0").replace(/[Il|]/g, "1");
  }
  const match = s.match(TIME_SHAPE);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (meridiem && (hour === 0 || hour > 12)) meridiem = null;
  return { hour, minute, meridiem };
}

/** Plain integer token (day numbers, years). */
export function parseIntegerText(text: string): number | null {
  const s = normaliseDigits(text)
    .replace(EDGE_PUNCTUATION, "")
    .replace(/(st|nd|rd|th)$/i, "")
    .trim();
  if (!/^\d{1,4}$/.test(s)) return null;
  return Number(s);
}

/**
 * Label normalisation for header matching: case, diacritics, tatweel, alef /
 * ya / ha / kaf forms (Arabic + Urdu), and all punctuation and spaces.
 */
export function normaliseLabel(text: string): string {
  return normaliseDigits(text)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[ً-ٰٟۖ-ۭـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/[ىیے]/g, "ي")
    .replace(/[ةۃہھ]/g, "ه")
    .replace(/ک/g, "ك")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

/** "HH:mm" from minutes since midnight (wraps past 24h). */
export function formatClock(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** Minutes since midnight from "HH:mm" (null when malformed). */
export function clockMinutes(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}
