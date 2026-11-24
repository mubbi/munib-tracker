import type { OcrResult } from "@munib-tracker/shared/timetable-parser";
import { requireOptionalNativeModule } from "expo";
import { Platform } from "react-native";

import { isTV } from "@/lib/platform/is-tv";

/**
 * NF-3.12 on-device text recognition (D3 — permanently on-device). Native
 * builds use the local Expo module `modules/munib-text-recognition`:
 * - iOS: Apple Vision `VNRecognizeTextRequest` (`.accurate`, no language
 *   correction, en-US + ar-SA when supported);
 * - Android: ML Kit Text Recognition v2, bundled Latin model.
 * Web uses `recognize.web.ts` (Tesseract.js WASM, lazy-loaded). TV, Expo Go and
 * builds without the module return `unavailable`: the screen offers manual
 * entry only. The image never leaves the device.
 */

export type OcrAvailability = "native" | "wasm" | "unavailable";

interface TextRecognitionModule {
  isSupported(): boolean;
  recognize(uri: string): Promise<OcrResult>;
}

function loadModule(): TextRecognitionModule | null {
  if (isTV()) return null;
  if (Platform.OS !== "ios" && Platform.OS !== "android") return null;
  try {
    return requireOptionalNativeModule<TextRecognitionModule>("MunibTextRecognition");
  } catch {
    return null;
  }
}

// Resolved once at import, like the other local modules (see lib/focus-lock/native.ts).
const module_ = loadModule();
function nativeModule(): TextRecognitionModule | null {
  return module_;
}

export function ocrAvailability(): OcrAvailability {
  try {
    return nativeModule()?.isSupported() ? "native" : "unavailable";
  } catch {
    return "unavailable";
  }
}

/** One-time download the web engine needs (0 on native: the model ships in the app). */
export function ocrDownloadBytes(_options: { arabic?: boolean } = {}): number {
  return 0;
}

/** Whether the one-time download has already been accepted (always true on native). */
export function ocrDownloadAccepted(): boolean {
  return true;
}

export async function recognizeImage(
  uri: string,
  _options: { arabic?: boolean } = {},
): Promise<OcrResult> {
  const native = nativeModule();
  if (!native) throw new Error("Text recognition is not available on this device");
  const result = await native.recognize(uri);
  return {
    tokens: Array.isArray(result?.tokens) ? result.tokens : [],
    width: Number(result?.width) || 0,
    height: Number(result?.height) || 0,
  };
}
