/**
 * Storage format of taught zikr voice patterns (NF-3.20, D48). Pure.
 *
 * What is kept, per taught zikr, on THIS device only (`DB_KEYS.tasbeehVoiceTemplates`,
 * `deviceLocal`: never synced, uploaded or backed up, cleared by Reset app data
 * and by Settings › Tasbeeh counter › "Forget taught zikr voices"):
 * - 1–3 templates: the normalised feature matrix of each sample (`features.ts`),
 *   quantised to one signed byte per number and base64-encoded — a few KB, and
 *   never audio;
 * - the acceptance threshold the samples implied, and when it was taught.
 *
 * Capped at `MAX_TAUGHT_ZIKRS` (the oldest taught zikr is dropped first).
 */
import type { Matrix } from "./dtw";
import { FEATURE_DIM, FEATURE_VERSION } from "./features";
import { MAX_TEMPLATES, type TaughtPattern } from "./matcher";

export const MAX_TAUGHT_ZIKRS = 20;
/** One quantisation step: normalised features mostly sit within ±4. */
const SCALE = 16;
/** Longest template kept (frames of 10 ms). */
const MAX_FRAMES = 1000;

export type StoredTemplate = { frames: number; q: string };
export type StoredPattern = { templates: StoredTemplate[]; threshold: number; at: string };
export type StoredPatterns = Record<string, StoredPattern>;
export type StoredTemplatesFile = { fv: number; zikrs: StoredPatterns };

/* -------------------------------------------------------------- base64 */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const LOOKUP = (() => {
  const table = new Int16Array(128).fill(-1);
  for (let i = 0; i < ALPHABET.length; i++) table[ALPHABET.charCodeAt(i)] = i;
  return table;
})();

export function bytesToBase64(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i];
    const b = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const c = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const n = (a << 16) | (b << 8) | c;
    out += ALPHABET[(n >> 18) & 63] + ALPHABET[(n >> 12) & 63];
    out += i + 1 < bytes.length ? ALPHABET[(n >> 6) & 63] : "=";
    out += i + 2 < bytes.length ? ALPHABET[n & 63] : "=";
  }
  return out;
}

export function base64ToBytes(value: string): Uint8Array | null {
  const clean = value.replace(/=+$/, "");
  if (clean.length % 4 === 1) return null;
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let bits = 0;
  let buffer = 0;
  let at = 0;
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    const v = code < 128 ? LOOKUP[code] : -1;
    if (v < 0) return null;
    buffer = (buffer << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[at++] = (buffer >> bits) & 0xff;
    }
  }
  return out.subarray(0, at);
}

/* ----------------------------------------------------------- templates */

export function encodeTemplate(template: Matrix): StoredTemplate {
  const frames = Math.min(template.frames, MAX_FRAMES);
  const bytes = new Int8Array(frames * FEATURE_DIM);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.max(-127, Math.min(127, Math.round(template.data[i] * SCALE)));
  }
  return { frames, q: bytesToBase64(new Uint8Array(bytes.buffer)) };
}

export function decodeTemplate(stored: StoredTemplate): Matrix | null {
  const bytes = base64ToBytes(stored.q);
  if (!bytes || bytes.length !== stored.frames * FEATURE_DIM || stored.frames <= 0) return null;
  const signed = new Int8Array(bytes.buffer, bytes.byteOffset, bytes.length);
  const data = new Float32Array(signed.length);
  for (let i = 0; i < signed.length; i++) data[i] = signed[i] / SCALE;
  return { frames: stored.frames, dim: FEATURE_DIM, data };
}

export function encodePattern(pattern: TaughtPattern, at: string): StoredPattern {
  return {
    templates: pattern.templates.slice(0, MAX_TEMPLATES).map(encodeTemplate),
    threshold: pattern.threshold,
    at,
  };
}

export function decodePattern(stored: StoredPattern | undefined): TaughtPattern | null {
  if (!stored) return null;
  const templates = stored.templates.map(decodeTemplate).filter((t): t is Matrix => t != null);
  if (templates.length === 0) return null;
  return { templates, threshold: stored.threshold };
}

function isStoredPattern(value: unknown): value is StoredPattern {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<StoredPattern>;
  return (
    Array.isArray(v.templates) &&
    v.templates.length > 0 &&
    v.templates.length <= MAX_TEMPLATES &&
    v.templates.every(
      (t) =>
        t != null &&
        typeof t === "object" &&
        typeof (t as StoredTemplate).frames === "number" &&
        typeof (t as StoredTemplate).q === "string",
    ) &&
    typeof v.threshold === "number" &&
    Number.isFinite(v.threshold) &&
    typeof v.at === "string"
  );
}

/** Parse what is on disk; patterns from another feature recipe are dropped (re-teach). */
export function sanitizeStoredPatterns(raw: unknown): StoredPatterns {
  if (!raw || typeof raw !== "object") return {};
  const file = raw as Partial<StoredTemplatesFile>;
  if (file.fv !== FEATURE_VERSION || !file.zikrs || typeof file.zikrs !== "object") return {};
  const out: StoredPatterns = {};
  for (const [key, value] of Object.entries(file.zikrs)) {
    if (isStoredPattern(value)) out[key] = value;
  }
  return capPatterns(out);
}

/** Keep the most recently taught `MAX_TAUGHT_ZIKRS`. */
export function capPatterns(patterns: StoredPatterns): StoredPatterns {
  const entries = Object.entries(patterns);
  if (entries.length <= MAX_TAUGHT_ZIKRS) return patterns;
  entries.sort((a, b) => b[1].at.localeCompare(a[1].at));
  return Object.fromEntries(entries.slice(0, MAX_TAUGHT_ZIKRS));
}

export function toStoredFile(patterns: StoredPatterns): StoredTemplatesFile {
  return { fv: FEATURE_VERSION, zikrs: patterns };
}
