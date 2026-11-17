import type { PracticeErrorCode } from "../types";

/** One chunk of 16 kHz mono float32 PCM, already resampled. */
export type CaptureChunkListener = (pcm16kMono: Float32Array) => void;

export type CaptureStatusListener = (event: {
  /** Capture stopped without our `stop()` (call, Siri, another app took the mic). */
  interrupted?: boolean;
  /** Delivered hardware rate, recorded for the §17 proof log. */
  sampleRate?: number;
}) => void;

export type MicPermission = "granted" | "denied" | "undetermined";

/** §7: one capture owner per session; a file per platform behind this interface. */
export interface RecitationCapture {
  readonly available: boolean;
  getPermission(): Promise<MicPermission>;
  requestPermission(): Promise<MicPermission>;
  start(onChunk: CaptureChunkListener, onStatus?: CaptureStatusListener): Promise<void>;
  stop(): Promise<void>;
}

export class CaptureError extends Error {
  readonly code: PracticeErrorCode;
  constructor(code: PracticeErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
  }
}
