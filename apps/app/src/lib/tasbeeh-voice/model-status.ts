import type { ListenerState } from "@/lib/quran-companion/model/download-job";
import { FASTCONFORMER_ENGINE } from "@/lib/speech/fastconformer";

/**
 * What the hands-free sheet shows about the (shared) listener model. Voice
 * counting needs the FastConformer files; Qur'an practice keeps ONE listener
 * on the device, so a user who has Zipformer installed is offered FastConformer
 * (which practice can use too, as follow-along).
 */
export type VoiceModelStatus =
  | "unsupported"
  | "ready"
  | "missing"
  | "other-engine"
  | "downloading"
  | "failed";

export function voiceModelStatus(listener: ListenerState): VoiceModelStatus {
  if (listener.status === "unsupported") return "unsupported";
  if (listener.status === "downloading" || listener.status === "verifying") {
    return listener.engine === FASTCONFORMER_ENGINE ? "downloading" : "other-engine";
  }
  const manifest = listener.manifest;
  if (manifest?.engine === FASTCONFORMER_ENGINE) {
    // An older FastConformer pin keeps working until updated, but the phrase
    // tokens are locked to the pinned version — ask for the update.
    return listener.status === "ready"
      ? "ready"
      : listener.status === "failed"
        ? "failed"
        : "missing";
  }
  if (manifest) return "other-engine";
  return listener.status === "failed" && listener.engine === FASTCONFORMER_ENGINE
    ? "failed"
    : "missing";
}

export function downloadFraction(listener: ListenerState): number {
  if (!listener.bytesTotal) return 0;
  return Math.max(0, Math.min(1, listener.bytesDone / listener.bytesTotal));
}
