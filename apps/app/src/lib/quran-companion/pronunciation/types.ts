import type { HeadValues } from "./judge";

/** Stable Quran Lab error codes the app maps to copy (subset of TajweedError.code). */
export type QuranLabErrorCode =
  | "invalid_key"
  | "server_rejected"
  | "needs_connection"
  | "download_failed"
  | "storage_full"
  | "model_unavailable"
  | "microphone_denied"
  | "microphone_unavailable"
  | "runtime_unsupported"
  | "cancelled"
  | "engine_failed"
  | "not_configured";

export type PronunciationModelInfo = {
  version: string;
  build: string;
  defaultContext: string;
  /** Parsed calibration.json, or null when the build has none. */
  calibration: unknown;
};

export type SharingState = { isAvailable: boolean; isOn: boolean; recoveryCode: string | null };

export type TakeResult = { heads: HeadValues[]; heardSpeech: boolean };

/**
 * The app's view of the Quran Lab SDK (Phase 6). Three implementations:
 * native (Expo module wrapping Kotlin/Swift), web (`@quran-lab/tajweedformer`),
 * and unavailable (TV, missing key). Tilawa and Quran Lab never run in the same
 * session (§1 Out of scope).
 */
export interface PronunciationClient {
  readonly available: boolean;
  configure(): Promise<void>;
  prefetch(onProgress: (done: number, total: number) => void): Promise<void>;
  openModel(): Promise<PronunciationModelInfo>;
  /** Start a take on the SDK's own microphone (`listen()` owns capture). */
  startTake(
    heads: string[],
    onSpeech: (speech: boolean) => void,
    onEnded: (reason: string) => void,
  ): Promise<void>;
  finishTake(): Promise<TakeResult>;
  cancelTake(): Promise<void>;
  removeModels(): Promise<void>;
  storageBytes(): Promise<number>;
  sharingState(): Promise<SharingState>;
  setSharingOn(on: boolean): Promise<void>;
  deleteShared(): Promise<boolean>;
  close(): Promise<void>;
}

export class QuranLabError extends Error {
  readonly code: QuranLabErrorCode;
  constructor(code: QuranLabErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
  }
}

/** Normalise anything the SDK throws into a code the UI understands. */
export function toQuranLabCode(error: unknown): QuranLabErrorCode {
  const code = (error as { code?: unknown })?.code;
  const known: QuranLabErrorCode[] = [
    "invalid_key",
    "server_rejected",
    "needs_connection",
    "download_failed",
    "storage_full",
    "model_unavailable",
    "microphone_denied",
    "microphone_unavailable",
    "runtime_unsupported",
    "cancelled",
    "engine_failed",
    "not_configured",
  ];
  if (typeof code === "string" && (known as string[]).includes(code))
    return code as QuranLabErrorCode;
  if (code === "client_exists" || code === "session_open") return "engine_failed";
  return "engine_failed";
}

/** The key for this platform. A client key ships inside the binary: treat it as public. */
export function quranLabKeyFor(platform: "ios" | "android" | "web"): string | null {
  const key =
    platform === "ios"
      ? process.env.EXPO_PUBLIC_QURANLAB_KEY_IOS
      : platform === "android"
        ? process.env.EXPO_PUBLIC_QURANLAB_KEY_ANDROID
        : process.env.EXPO_PUBLIC_QURANLAB_KEY_WEB;
  const trimmed = key?.trim();
  return trimmed ? trimmed : null;
}
