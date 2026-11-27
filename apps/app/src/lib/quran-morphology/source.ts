import { sha256 } from "@noble/hashes/sha2.js";

/**
 * The pinned Quranic Arabic Corpus morphology file (NF-3.22, decision D22).
 * Used unmodified, fetched cache-first from two public GitHub copies that are
 * byte-identical once line endings are normalised to LF. No self-hosting.
 * Provenance + licence review: docs/proofs/root-word-search.md.
 */
export const QAC_MORPHOLOGY = {
  version: "0.4",
  fileName: "quranic-corpus-morphology-0.4.txt",
  /** sha256 of the file with every `\r` removed (LF endings). */
  sha256: "910b721a8f04f4334ac5d4c62b19e858f5d720c525bb975f2e750ea2c6bb532d",
  /** Byte length with LF endings. */
  bytes: 6_181_227,
  /** Pinned commits; `Access-Control-Allow-Origin: *` on GitHub's media host. */
  sources: [
    "https://media.githubusercontent.com/media/AhmedSaadi0/quran-words/a6d4217a9e1422978c367eadc833ff4883db77fb/data/quranic-corpus-morphology-0.4.txt",
    // Second verified mirror: a CRLF copy that hashes identically after `\r` is stripped.
    "https://media.githubusercontent.com/media/ezAldinWaez/quran-etl/6539e2de6cdbdb5ff5a97abb1666a7585540c2c3/reports/resources/quranic-corpus/quranic-corpus-morphology-0.4.txt",
  ],
  homepage: "https://corpus.quran.com",
} as const;

/** Host shown in credit lines (the terms require a link to it). */
export const QAC_SITE = "corpus.quran.com";

/** Rounded download size for copy ("6 MB"). */
export const QAC_DOWNLOAD_MB = Math.round(QAC_MORPHOLOGY.bytes / 1_000_000);

/** Typed, Sentry-safe failure codes (no user content in any of them). */
export type MorphologyErrorCode =
  | "morphology-hash"
  | "no-connection"
  | "download-failed"
  | "download-cancelled"
  | "storage-failed"
  | "parse-failed";

export class MorphologyError extends Error {
  readonly code: MorphologyErrorCode;

  constructor(code: MorphologyErrorCode, detail?: string) {
    super(detail ? `${code}: ${detail}` : code);
    this.name = "MorphologyError";
    this.code = code;
  }
}

export function toMorphologyErrorCode(error: unknown): MorphologyErrorCode {
  return error instanceof MorphologyError ? error.code : "download-failed";
}

/** Remove every carriage return — CRLF and LF copies normalise to the same text. */
export function normalizeLineEndings(text: string): string {
  return text.includes("\r") ? text.replace(/\r/g, "") : text;
}

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) out += b.toString(16).padStart(2, "0");
  return out;
}

/** sha256 (hex) of the LF-normalised UTF-8 text. */
export function morphologyTextHash(text: string): string {
  return toHex(sha256(new TextEncoder().encode(normalizeLineEndings(text))));
}

/**
 * Verify a downloaded copy and return its LF-normalised text. Throws
 * `MorphologyError("morphology-hash")` for anything other than the pinned file.
 */
export function verifyMorphologyText(text: string, expected = QAC_MORPHOLOGY.sha256): string {
  const normalized = normalizeLineEndings(text);
  const hash = toHex(sha256(new TextEncoder().encode(normalized)));
  if (hash !== expected) throw new MorphologyError("morphology-hash");
  return normalized;
}

const HASH_CHUNK_CHARS = 512 * 1024;

/**
 * {@link verifyMorphologyText} in 512 KB slices with `yieldToUi` between them,
 * so hashing 6 MB never blocks a frame for long (native has no WebCrypto).
 */
export async function verifyMorphologyTextChunked(
  text: string,
  yieldToUi: () => Promise<void>,
  expected: string = QAC_MORPHOLOGY.sha256,
): Promise<string> {
  const normalized = normalizeLineEndings(text);
  const hasher = sha256.create();
  const encoder = new TextEncoder();
  for (let i = 0; i < normalized.length; i += HASH_CHUNK_CHARS) {
    hasher.update(encoder.encode(normalized.slice(i, i + HASH_CHUNK_CHARS)));
    await yieldToUi();
  }
  if (toHex(hasher.digest()) !== expected) throw new MorphologyError("morphology-hash");
  return normalized;
}
