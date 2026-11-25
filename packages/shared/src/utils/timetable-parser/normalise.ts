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

/** Zero code points of the digit sets boards print: Eastern Arabic, Persian/Urdu, Devanagari, Bengali. */
const DIGIT_ZEROS = [0x0660, 0x06f0, 0x0966, 0x09e6] as const;

/** Maps Eastern Arabic, Persian/Urdu, Devanagari and Bengali digits to ASCII; other characters are kept. */
export function normaliseDigits(text: string): string {
  let out = "";
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    const zero = DIGIT_ZEROS.find((z) => code >= z && code <= z + 9);
    out += zero === undefined ? ch : String(code - zero);
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

/** Common OCR letter-for-digit confusions on LED / dot-matrix glyphs (only inside a numeric token). */
const OCR_DIGITS: Record<string, string> = {
  O: "0",
  o: "0",
  D: "0",
  Q: "0",
  I: "1",
  l: "1",
  "|": "1",
  "!": "1",
  S: "5",
  s: "5",
  Z: "2",
  z: "2",
  B: "8",
};
const NUMERIC_TEXT = /^[\d:.\-–—;,٫\s]+$/;

/**
 * Digits-and-separators text of a token with OCR letter confusions fixed
 * ("S:OO" → "5:00"); null when it is a word, not a number.
 */
export function numericText(text: string): string | null {
  const s = normaliseDigits(text).trim();
  if (!/\d/.test(s)) return null;
  const mapped = [...s].map((ch) => OCR_DIGITS[ch] ?? ch).join("");
  return NUMERIC_TEXT.test(mapped) ? mapped : null;
}

/**
 * Lenient clock for text known to be a time (an LED board line, an area the
 * user marked): a strict time first, else 3–4 bare digits as H:MM / HH:MM —
 * LED boards often have no colon, and OCR drops or mirrors it ("500", "5 20",
 * "5-30", ":5 00"). Never use this on free text: "120" is a time only here.
 */
export function parseLooseClockText(text: string): (ParsedClock & { loose: boolean }) | null {
  const strict = parseClockText(text) ?? parseClockText(text.replace(/\s+/g, ""));
  if (strict) return { ...strict, loose: false };
  const numeric = numericText(text);
  if (!numeric) return null;
  const digits = numeric.replace(/\D/g, "");
  if (digits.length !== 3 && digits.length !== 4) return null;
  const hour = Number(digits.slice(0, -2));
  const minute = Number(digits.slice(-2));
  if (hour > 23 || minute > 59) return null;
  return { hour, minute, meridiem: null, loose: true };
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
