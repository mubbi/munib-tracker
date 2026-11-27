import { normalizePassphrase, VAULT_MIN_PASSPHRASE_LENGTH } from "./keyring";

export type PassphraseStrength = "tooShort" | "weak" | "fair" | "good" | "strong";

export interface PassphraseAssessment {
  length: number;
  meetsMinimum: boolean;
  /** 0 (too short) … 4 (strong) — drives the meter's filled segments. */
  score: 0 | 1 | 2 | 3 | 4;
  strength: PassphraseStrength;
  /** Rough guessing-entropy estimate in bits (meter only, not a security claim). */
  bits: number;
}

/** Passphrases people pick first; seen here they count as "weak" whatever their length. */
const COMMON = new Set([
  "password",
  "password1",
  "password123",
  "1234567890",
  "12345678910",
  "qwertyuiop",
  "iloveyou",
  "bismillah",
  "allahuakbar",
  "alhamdulillah",
  "subhanallah",
  "mashallah",
  "inshallah",
  "lailahaillallah",
]);

function poolSize(chars: string[]): number {
  let pool = 0;
  if (chars.some((c) => /[a-z]/.test(c))) pool += 26;
  if (chars.some((c) => /[A-Z]/.test(c))) pool += 26;
  if (chars.some((c) => /[0-9]/.test(c))) pool += 10;
  if (chars.some((c) => /[^A-Za-z0-9\s]/.test(c) && c.charCodeAt(0) < 128)) pool += 33;
  if (chars.some((c) => /\s/.test(c))) pool += 1;
  // Any non-ASCII script (Arabic, Urdu, Cyrillic…) widens the alphabet a lot.
  if (chars.some((c) => c.charCodeAt(0) >= 128)) pool += 64;
  return Math.max(pool, 1);
}

/** Length-and-variety estimate with penalties for repeats and runs ("aaaa", "abcd", "1234"). */
export function assessPassphrase(passphrase: string): PassphraseAssessment {
  const normalized = normalizePassphrase(passphrase);
  const chars = [...normalized];
  const length = chars.length;
  const meetsMinimum = length >= VAULT_MIN_PASSPHRASE_LENGTH;

  let effective = 0;
  for (let i = 0; i < chars.length; i += 1) {
    const prev = chars[i - 1]?.codePointAt(0);
    const cur = chars[i]?.codePointAt(0) ?? 0;
    const repeat = prev === cur;
    const run = prev != null && Math.abs(cur - prev) === 1;
    effective += repeat ? 0.1 : run ? 0.4 : 1;
  }
  const unique = new Set(chars).size;
  effective = Math.min(effective, unique * 2.5);
  const words = normalized
    .trim()
    .split(/\s+/)
    .filter((w) => w.length >= 3).length;
  let bits = effective * Math.log2(poolSize(chars)) + (words >= 3 ? 10 : 0);
  if (
    COMMON.has(
      normalized
        .toLowerCase()
        .replace(/[\s\d!.]+$/u, "")
        .replace(/\s+/g, ""),
    )
  ) {
    bits = Math.min(bits, 20);
  }
  bits = Math.round(bits);

  let score: PassphraseAssessment["score"];
  if (!meetsMinimum) score = 0;
  else if (bits < 45) score = 1;
  else if (bits < 60) score = 2;
  else if (bits < 80) score = 3;
  else score = 4;
  const strength: PassphraseStrength = (["tooShort", "weak", "fair", "good", "strong"] as const)[
    score
  ];
  return { length, meetsMinimum, score, strength, bits };
}
