import { useMemo } from "react";

import type { RecitationCapture } from "./types";
import { CaptureError } from "./types";

/**
 * Fallback capture (TV and any platform without a mic path). Metro picks
 * `capture.native.ts` / `capture.web.ts` first; this file is what the TV bundle
 * and tests resolve. It never touches a microphone.
 */
export function createRecitationCapture(): RecitationCapture {
  return {
    available: false,
    async getPermission() {
      return "denied";
    },
    async requestPermission() {
      return "denied";
    },
    async start() {
      throw new CaptureError("mic-unavailable");
    },
    async stop() {},
  };
}

/** One capture per mounted practice session (same shape as the native hook). */
export function useRecitationCapture(): RecitationCapture {
  return useMemo(() => createRecitationCapture(), []);
}
