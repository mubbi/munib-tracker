import { requireOptionalNativeModule } from "expo";

/**
 * Optional binding to the local Expo module in `modules/munib-tajweedformer`
 * (Quran Lab TajweedFormer Kotlin + Swift SDKs). `null` on web, TV, Expo Go,
 * and any build without the module — every caller must tolerate that.
 */
export type NativeHead = {
  name: string;
  frameMs: number;
  frames: number;
  classes: number;
  values: number[];
};

type Subscription = { remove: () => void };

export interface NativeTajweedformerModule {
  /** `theme`: `#RRGGBB` colours (+ `dark: "true"|"false"`) for the SDK's own sharing sheet. */
  configure(key: string, theme: Record<string, string> | null): Promise<void>;
  prefetch(): Promise<void>;
  openModel(): Promise<{
    version: string;
    build: string;
    defaultContext: string;
    calibrationJson: string | null;
  }>;
  prepareTake(heads: string[]): Promise<string>;
  diagnose(): Promise<string | null>;
  startTake(heads: string[], endOnSilenceMs: number): Promise<void>;
  finishTake(): Promise<{ heads: NativeHead[] }>;
  cancelTake(): Promise<void>;
  removeModels(): Promise<void>;
  storageBytes(): Promise<number>;
  sharingState(): Promise<{ isAvailable: boolean; isOn: boolean; recoveryCode: string | null }>;
  setSharingOn(on: boolean): Promise<void>;
  deleteShared(): Promise<boolean>;
  close(): Promise<void>;
  addListener(event: "onProgress", fn: (e: { done: number; total: number }) => void): Subscription;
  addListener(
    event: "onChunk",
    fn: (e: { speech: boolean; text: string; index: number }) => void,
  ): Subscription;
  addListener(
    event: "onEnded",
    fn: (e: { reason: string; errorCode: string | null }) => void,
  ): Subscription;
}

const NativeTajweedformer =
  requireOptionalNativeModule<NativeTajweedformerModule>("MunibTajweedformer");

export default NativeTajweedformer;
