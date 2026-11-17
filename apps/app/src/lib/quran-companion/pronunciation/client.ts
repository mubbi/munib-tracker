import { type PronunciationClient, QuranLabError } from "./types";

/** TV and tests: no Quran Lab SDK. Metro resolves the `.native` / `.web` files elsewhere. */
export function createPronunciationClient(): PronunciationClient {
  const unavailable = () => Promise.reject(new QuranLabError("runtime_unsupported"));
  return {
    available: false,
    configure: unavailable,
    prefetch: unavailable,
    openModel: unavailable,
    startTake: unavailable,
    finishTake: unavailable,
    async cancelTake() {},
    async removeModels() {},
    async storageBytes() {
      return 0;
    },
    async sharingState() {
      return { isAvailable: false, isOn: false, recoveryCode: null };
    },
    async setSharingOn() {},
    async deleteShared() {
      return false;
    },
    async close() {},
  };
}
