import type { EngineId } from "@/lib/quran-companion/types";

import data from "./recitation-models.json";

/**
 * Pinned on-device listener files (§4.1, decision D5). The data lives in
 * `recitation-models.json` — one source of truth shared with the web build
 * script (`scripts/fetch-recitation-models.mjs`). There is no remote catalogue:
 * a newer model reaches people only through an app release that changes it.
 * "Update available" (§9.5) means the stored manifest's `version` differs.
 *
 * Every URL points at a GitHub release tag, never `latest` or a branch. SHA-256
 * values are GitHub's published digests; MD5 values were computed from the same
 * verified downloads so native code can verify with
 * `File.digest("MD5")` (lowercase hex) without reading the file into JS.
 *
 * Where the files come from:
 * - iOS / Android download straight from the GitHub release.
 * - The web cannot: GitHub release assets send no CORS headers, so a browser
 *   `fetch` is blocked. Zipformer (`webHosted`, no `webUrl`) is downloaded and
 *   checksum-verified at web build time and served from this app's own origin
 *   under {@link WEB_MODEL_BASE}. NPL-1.2 allows that non-commercial
 *   redistribution with the licence text alongside (`NPL-1.2.txt`).
 * - FastConformer on the web (D18): no self-hosting and no CDN of our own — each
 *   file carries a `webUrl` on the public CC-BY-4.0 Hugging Face mirror
 *   `acibZ/tilawa-quran-onnx`, pinned to commit 0cd79471… (CORS `*`). The
 *   mirror's bytes were checked against these same SHA-256 values (2026-11-23).
 *
 * Licences: Zipformer weights and the phoneme corpus are NPL-1.2 (non-commercial,
 * share-alike — practice must stay free, with no ads and no paywall). FastConformer
 * weights are NVIDIA CC-BY-4.0; its text assets come from the MIT Tilawa release.
 */

export const TILAWA_CORE_VERSION: string = data.tilawaCoreVersion;
export const ORT_WEB_VERSION: string = data.ortWebVersion;

/** The release host the privacy card names for native downloads (§10 Privacy). */
export const RECITATION_MODEL_HOST = "github.com/yazinsai/tilawa";

/** Same-origin folder the web build serves listener files from. */
export const WEB_MODEL_BASE = "/recitation-models/";

export type RecitationModelFile = {
  /** Stored file name under `recitation-models/` (native) or the cache key (web). */
  fileName: string;
  url: string;
  /**
   * Browser source for a file this app does not self-host (D18): a public,
   * CORS-enabled mirror pinned to an immutable commit. Absent → same-origin copy.
   */
  webUrl?: string;
  bytes: number;
  sha256: string;
  md5: string;
  /** Loaded by the engine as JSON (corpus, assets) rather than handed to ORT as a model. */
  kind: "model" | "json" | "text";
};

export type RecitationModelSpec = {
  engine: EngineId;
  /** Pinned @tilawa/core + asset revision. Changing any file changes this. */
  version: string;
  files: RecitationModelFile[];
  /**
   * Whether this engine build's correction issues may paint a word "try again".
   * Zipformer a0w: proven on desktop against real recitation (§17). FastConformer
   * has no correction mode, so it can only follow along.
   */
  confirmedMismatchEnabled: boolean;
  /** Whether the engine supports Tilawa's correction mode at all. */
  supportsCorrection: boolean;
  /** Served from this app's origin on the web (see the module comment). */
  webHosted: boolean;
};

type EngineData = Omit<RecitationModelSpec, "engine">;

function spec(engine: EngineId): RecitationModelSpec {
  const raw = (data.engines as Record<EngineId, EngineData>)[engine];
  return { ...raw, engine, files: raw.files as RecitationModelFile[] };
}

export const RECITATION_MODELS: Record<EngineId, RecitationModelSpec> = {
  "tilawa-zipformer": spec("tilawa-zipformer"),
  "tilawa-fastconformer": spec("tilawa-fastconformer"),
};

/** Same-origin URL of a listener file on the web, versioned so a new pin never reuses a stale copy. */
export function webModelUrl(engine: EngineId, file: RecitationModelFile): string {
  return `${WEB_MODEL_BASE}${engine}/${file.sha256.slice(0, 12)}/${file.fileName}`;
}

/**
 * Where the browser downloads a listener file: the pinned public mirror when the
 * file has one (D18 — FastConformer, from the CC-BY-4.0 Hugging Face mirror
 * `acibZ/tilawa-quran-onnx` at an immutable commit), else the same-origin copy.
 * Either way the bytes are SHA-256-checked against this pin before use.
 */
export function webSourceUrl(engine: EngineId, file: RecitationModelFile): string {
  return file.webUrl ?? webModelUrl(engine, file);
}

/** Public mirror credited for the web FastConformer files (D18). */
export const FASTCONFORMER_WEB_MIRROR = "huggingface.co/acibZ/tilawa-quran-onnx";

/** Total download size of an engine, in bytes. */
export function engineDownloadBytes(engine: EngineId): number {
  return RECITATION_MODELS[engine].files.reduce((sum, f) => sum + f.bytes, 0);
}

/** Size shown in copy, in whole MB. */
export function engineDownloadMb(engine: EngineId): number {
  return Math.round(engineDownloadBytes(engine) / (1024 * 1024));
}

export const DEFAULT_ENGINE: EngineId = "tilawa-zipformer";
