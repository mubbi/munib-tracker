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
  | "not_configured"
  /** SDK 4: the key needs a newer SDK — the app must be updated. */
  | "sdk_too_old"
  /** SDK 4: a downloaded file did not match its signed manifest. */
  | "checksum_mismatch"
  /** Android SDK 4: another client still had the model open after 3 s. */
  | "session_open"
  /** Sharing switched on while Quran Lab has paused sharing for everyone. */
  | "sharing_unavailable";

/**
 * SDK 4.0.2 `errorCause.needs` on `needs_connection`: `model` = the model files
 * are not on the device yet (connect to download); `lease` = the model is here but
 * Quran Lab must renew this install's permission once (connect to continue).
 */
export type QuranLabNeeds = "model" | "lease";

/** The app's colours for the SDK's own sharing sheet (`#RRGGBB`). Words never change. */
export type SharingThemeColors = {
  accent: string;
  background: string;
  text: string;
  secondaryText: string;
  dark: boolean;
};

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
  /**
   * Colours for the SDK's own recitation-sharing sheet (SDK 4 asks every learner
   * itself). Applied when the client is next configured; colours only.
   */
  setSharingTheme(theme: SharingThemeColors | null): void;
  configure(): Promise<void>;
  prefetch(onProgress: (done: number, total: number) => void): Promise<void>;
  openModel(): Promise<PronunciationModelInfo>;
  /**
   * Warm the engine for these heads before the first take (best effort, never
   * throws). iOS: lets the first take start on the Neural Engine when the install
   * is attested; Android / web: opens the model.
   */
  prepareTake(heads: string[]): Promise<void>;
  /** The SDK's own `diagnose()` report as text for a support request, or null. */
  diagnose(): Promise<string | null>;
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
  readonly needs: QuranLabNeeds | null;
  constructor(code: QuranLabErrorCode, message?: string, needs: QuranLabNeeds | null = null) {
    super(message ?? code);
    this.code = code;
    this.needs = needs;
  }
}

/**
 * `errorCause.needs` from the web SDK (an object on the error), or the
 * `[needs=model|lease …]` token the native bridges put at the start of the message.
 */
export function quranLabNeeds(error: unknown): QuranLabNeeds | null {
  if (error instanceof QuranLabError) return error.needs;
  const cause = (error as { errorCause?: { needs?: unknown } } | null)?.errorCause;
  if (cause?.needs === "model" || cause?.needs === "lease") return cause.needs;
  const message = (error as { message?: unknown } | null)?.message;
  if (typeof message === "string") {
    const match = /^\[[^\]]*\bneeds=(model|lease)\b/.exec(message);
    if (match) return match[1] as QuranLabNeeds;
  }
  return null;
}

/** Any SDK / bridge failure → a {@link QuranLabError} with its code and `needs`. */
export function toQuranLabError(error: unknown): QuranLabError {
  if (error instanceof QuranLabError) return error;
  return new QuranLabError(
    toQuranLabCode(error),
    (error as Error | null)?.message,
    quranLabNeeds(error),
  );
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
    "sdk_too_old",
    "checksum_mismatch",
    "session_open",
    "sharing_unavailable",
  ];
  if (typeof code === "string" && (known as string[]).includes(code))
    return code as QuranLabErrorCode;
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
