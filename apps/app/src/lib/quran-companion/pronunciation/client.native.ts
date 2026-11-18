import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

import NativeTajweedformer from "./native-module";
import {
  type PronunciationClient,
  QuranLabError,
  quranLabKeyFor,
  type TakeResult,
  toQuranLabCode,
} from "./types";

/**
 * iOS / Android: the `munib-tajweedformer` Expo module wrapping Quran Lab's
 * Kotlin and Swift SDKs. Analytics are off; the module never asks for or hosts
 * the SDK's recitation-sharing sheet. The SDK needs Android 8.0 (API 26) and
 * iOS 15 — older devices report `runtime_unsupported`.
 */

type NativeModule = NonNullable<typeof NativeTajweedformer>;

function osSupported(): boolean {
  if (Platform.OS === "android") return Number(Platform.Version) >= 26;
  if (Platform.OS === "ios") return Number.parseInt(String(Platform.Version), 10) >= 15;
  return false;
}

function call<T>(fn: (m: NativeModule) => Promise<T>): Promise<T> {
  const m = NativeTajweedformer;
  if (!m) return Promise.reject(new QuranLabError("runtime_unsupported"));
  return fn(m).catch((error: unknown) => {
    throw new QuranLabError(toQuranLabCode(error), (error as Error)?.message);
  });
}

export function createPronunciationClient(): PronunciationClient {
  const key =
    Platform.OS === "ios" || Platform.OS === "android" ? quranLabKeyFor(Platform.OS) : null;
  const available = !isTV() && NativeTajweedformer != null && key != null && osSupported();
  let configured = false;
  let heardSpeech = false;
  let subscriptions: { remove: () => void }[] = [];

  const clearSubs = () => {
    for (const s of subscriptions) s.remove();
    subscriptions = [];
  };

  const ensure = async () => {
    if (!available || !key) throw new QuranLabError(key ? "runtime_unsupported" : "not_configured");
    if (!configured) {
      await call((m) => m.configure(key));
      configured = true;
    }
  };

  return {
    available,
    configure: ensure,

    async prefetch(onProgress) {
      await ensure();
      const sub = NativeTajweedformer?.addListener(
        "onProgress",
        (e: { done: number; total: number }) => onProgress(e.done, e.total),
      );
      try {
        await call((m) => m.prefetch());
      } finally {
        sub?.remove();
      }
    },

    async openModel() {
      await ensure();
      const info = await call((m) => m.openModel());
      let calibration: unknown = null;
      try {
        calibration = info.calibrationJson ? JSON.parse(info.calibrationJson) : null;
      } catch {
        calibration = null;
      }
      return {
        version: info.version,
        build: info.build,
        defaultContext: info.defaultContext,
        calibration,
      };
    },

    async startTake(heads, onSpeech, onEnded) {
      await ensure();
      clearSubs();
      heardSpeech = false;
      const m = NativeTajweedformer;
      if (m) {
        subscriptions.push(
          m.addListener("onChunk", (e: { speech: boolean }) => {
            if (e.speech) heardSpeech = true;
            onSpeech(e.speech);
          }),
          m.addListener("onEnded", (e: { reason: string }) => onEnded(e.reason)),
        );
      }
      // The take never runs forever: a stop button plus a 1.5 s silence end (Quran Lab default).
      await call((mod) => mod.startTake(heads, 1500));
    },

    async finishTake(): Promise<TakeResult> {
      try {
        const result = await call((m) => m.finishTake());
        return { heads: result.heads, heardSpeech };
      } finally {
        clearSubs();
      }
    },

    async cancelTake() {
      clearSubs();
      if (!NativeTajweedformer) return;
      await NativeTajweedformer.cancelTake().catch(() => {});
    },

    async removeModels() {
      if (!available) return;
      await ensure();
      await call((m) => m.removeModels());
    },

    async storageBytes() {
      if (!available) return 0;
      try {
        await ensure();
        return await call((m) => m.storageBytes());
      } catch {
        return 0;
      }
    },

    async sharingState() {
      if (!available) return { isAvailable: false, isOn: false, recoveryCode: null };
      await ensure();
      return call((m) => m.sharingState());
    },

    async setSharingOn(on) {
      await ensure();
      await call((m) => m.setSharingOn(on));
    },

    async deleteShared() {
      await ensure();
      return call((m) => m.deleteShared());
    },

    async close() {
      clearSubs();
      if (!configured || !NativeTajweedformer) return;
      await NativeTajweedformer.close().catch(() => {});
      configured = false;
    },
  };
}
