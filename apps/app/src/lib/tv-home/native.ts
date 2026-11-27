import { requireOptionalNativeModule } from "expo";

/**
 * Bridge to `modules/munib-tv-home` (Apple TV / Android TV only).
 *
 * The module is linked only into `EXPO_TV=1` builds (react-native.config.js drops
 * it from phone builds), so it is optional everywhere: on phone / web these
 * wrappers report "unsupported" and no-op.
 *
 * - Android TV: a "Munib Tracker" preview channel on the launcher (TvProvider).
 * - tvOS: the payload is written to the shared App Group for the Top Shelf
 *   extension (`tv-targets/top-shelf`), then the system reloads the shelf.
 * - Android TV voice: the system speech prompt (`RecognizerIntent`). The
 *   recognizer app owns the microphone, so this app needs no RECORD_AUDIO.
 */
type NativeTvHome = {
  isChannelSupported(): boolean;
  publishChannel(payloadJson: string): Promise<boolean>;
  clearChannel(): Promise<void>;
  isTopShelfSupported(): boolean;
  publishTopShelf(payloadJson: string, appGroup: string): Promise<boolean>;
  isVoiceSearchAvailable(): boolean;
  startVoiceSearch(prompt: string | null, language: string | null): Promise<string | null>;
};

const native = requireOptionalNativeModule<NativeTvHome>("MunibTvHome");

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

async function safeAsync<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export function isTvHomeChannelSupported(): boolean {
  return native ? safe(() => native.isChannelSupported(), false) : false;
}

export function publishTvHomeChannel(payloadJson: string): Promise<boolean> {
  return native
    ? safeAsync(() => native.publishChannel(payloadJson), false)
    : Promise.resolve(false);
}

export function clearTvHomeChannel(): Promise<void> {
  return native ? safeAsync(() => native.clearChannel(), undefined) : Promise.resolve();
}

export function isTopShelfSupported(): boolean {
  return native ? safe(() => native.isTopShelfSupported(), false) : false;
}

export function publishTopShelf(payloadJson: string, appGroup: string): Promise<boolean> {
  return native
    ? safeAsync(() => native.publishTopShelf(payloadJson, appGroup), false)
    : Promise.resolve(false);
}

export function isTvVoiceSearchAvailable(): boolean {
  return native ? safe(() => native.isVoiceSearchAvailable(), false) : false;
}

/**
 * Opens the system speech prompt. Resolves the recognized text, or null when the
 * user cancels / nothing was heard. Rejects only when no recognizer exists.
 */
export async function startTvVoiceSearch(options: {
  prompt?: string;
  language?: string;
}): Promise<string | null> {
  if (!native) return null;
  return native.startVoiceSearch(options.prompt ?? null, options.language ?? null);
}
