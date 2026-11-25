import { requireOptionalNativeModule } from "expo";

/**
 * Native bridge to the Quran Lab TajweedFormer SDKs (pronunciation drills, SDK 4.x — D66).
 *
 * - Android: `ai.quranlab:tajweedformer:4.0.3` (Maven Central), API 26+; phones with an
 *   unlocked bootloader are refused a lease by Quran Lab (`server_rejected`).
 * - iOS: SwiftPM `Quran-Lab/tajweedformer-apple` from 4.0.3, product `TajweedFormer`
 *   (+ the closed `QuranLabCore.xcframework`), iOS 15+, App Attest entitlement.
 * - Web uses the npm package `@quran-lab/tajweedformer` 4.x (hosted loader) directly.
 * - TV: excluded from autolinking (`plugins/withTvExpoModuleExcludes.cjs`), so this is `null`.
 *
 * SDK 4 keeps anonymous analytics and error reports always on, and asks every learner
 * itself (its own sheet, at most three times) whether to share recordings. The module
 * never calls `sharing.ask()`; `configure` themes that sheet, and the learner's switch,
 * "Delete what I shared" and the recovery code are exposed for Settings.
 *
 * Every rejection is an Expo `CodedException` whose `code` is the SDK's stable
 * `TajweedError.code` ("needs_connection", "invalid_key", "server_rejected",
 * "microphone_denied", "storage_full", "cancelled", …), or "engine_failed" when
 * the error did not come from the SDK. The message starts with
 * `[needs=model|lease stage=… reason=…]` when the SDK gave an `errorCause`.
 */

export type TajweedProgressEvent = { done: number; total: number };

export type TajweedChunkEvent = { speech: boolean; text: string; index: number };

export type TajweedEndReason =
  | "silence"
  | "background"
  | "interrupted"
  | "sourceend"
  | "limit"
  | "error";

export type TajweedEndedEvent = { reason: TajweedEndReason | string; errorCode: string | null };

export type TajweedModelInfo = {
  version: string;
  build: string;
  defaultContext: string;
  /** `calibration.json` exactly as shipped, or null when the build has none. */
  calibrationJson: string | null;
};

export type TajweedHeadData = {
  name: string;
  frameMs: number;
  frames: number;
  classes: number;
  /** `frames * classes` values, row major. */
  values: number[];
};

export type TajweedTakeResult = { heads: TajweedHeadData[] };

export type TajweedSharingState = {
  isAvailable: boolean;
  isOn: boolean;
  recoveryCode: string | null;
};

export type TajweedformerEvents = {
  onProgress: (event: TajweedProgressEvent) => void;
  onChunk: (event: TajweedChunkEvent) => void;
  onEnded: (event: TajweedEndedEvent) => void;
};

export type NativeTajweedformerModule = {
  configure(key: string, theme: Record<string, string> | null): Promise<void>;
  prefetch(): Promise<void>;
  openModel(): Promise<TajweedModelInfo>;
  /** Warm the engine for these heads before the first take; resolves the backend kind. */
  prepareTake(heads: string[]): Promise<string>;
  /** The SDK's `diagnose()` report as text (no audio, text or identifiers); null before configure. */
  diagnose(): Promise<string | null>;
  startTake(heads: string[], endOnSilenceMs: number): Promise<void>;
  finishTake(): Promise<TajweedTakeResult>;
  cancelTake(): Promise<void>;
  removeModels(): Promise<void>;
  storageBytes(): Promise<number>;
  sharingState(): Promise<TajweedSharingState>;
  setSharingOn(on: boolean): Promise<void>;
  deleteShared(): Promise<boolean>;
  close(): Promise<void>;
  addListener<K extends keyof TajweedformerEvents>(
    eventName: K,
    listener: TajweedformerEvents[K],
  ): { remove: () => void };
};

const MunibTajweedformer =
  requireOptionalNativeModule<NativeTajweedformerModule>("MunibTajweedformer");

export default MunibTajweedformer;
