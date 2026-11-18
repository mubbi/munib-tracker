import { requireOptionalNativeModule } from "expo";

/**
 * Native bridge to the Quran Lab TajweedFormer SDKs (Phase 6 pronunciation drills).
 *
 * - Android: `ai.quranlab:tajweedformer:3.1.5` (Maven Central), API 26+.
 * - iOS: SwiftPM `Quran-Lab/tajweedformer-apple` from 3.1.4, product `TajweedFormer`, iOS 15+.
 * - Web uses the npm package `@quran-lab/tajweedformer` directly (not this module).
 * - TV: excluded from autolinking (`plugins/withTvExpoModuleExcludes.cjs`), so this is `null`.
 *
 * The module never offers recitation sharing: it does not call `sharing.ask()` and
 * hosts no SDK sharing sheet. It only exposes the learner's off switch, "Delete what
 * I shared" and the recovery code, in case Quran Lab's config ever offered sharing.
 *
 * Every rejection is an Expo `CodedException` whose `code` is the SDK's stable
 * `TajweedError.code` ("needs_connection", "invalid_key", "server_rejected",
 * "microphone_denied", "storage_full", "cancelled", …), or "engine_failed" when
 * the error did not come from the SDK.
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
  configure(key: string): Promise<void>;
  prefetch(): Promise<void>;
  openModel(): Promise<TajweedModelInfo>;
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
