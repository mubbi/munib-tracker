/**
 * Device voice per language (`ttsVoiceByLang`, Settings › Audio & voice, B4).
 * Used by every Listen button: the Qur'an playback sheet, the mini-player, the
 * reading Listen button, Learn TTS and the voice control. All five pick and
 * store voices through this module so they can never disagree.
 */
import { setDevicePreferences } from "@/stores/device-preferences-store";

import { getSettingsSnapshot } from "./snapshot";
import type { SettingsSnapshot } from "./types";
import { useSettingsSelector } from "./use-setting";

const EMPTY: Readonly<Record<string, string>> = Object.freeze({});

/** Device value first, then the legacy synced Qur'an prefs value. */
export function ttsVoicesOf(s: SettingsSnapshot): Readonly<Record<string, string>> {
  return s.device.ttsVoiceByLang ?? s.quran.ttsVoiceByLang ?? EMPTY;
}

/** Chosen voice id for a BCP-47 language (undefined = the system default). */
export function useTtsVoice(lang: string): string | undefined {
  return useSettingsSelector((s) => ttsVoicesOf(s)[lang]);
}

/** Every chosen voice (language → voice id). */
export function useTtsVoices(): Readonly<Record<string, string>> {
  return useSettingsSelector(ttsVoicesOf);
}

/** Choose (or clear with `undefined`) the voice for one language. */
export function setTtsVoice(lang: string, voiceId: string | undefined): Promise<void> {
  const next = { ...ttsVoicesOf(getSettingsSnapshot()) };
  if (voiceId) next[lang] = voiceId;
  else delete next[lang];
  return setDevicePreferences({ ttsVoiceByLang: next });
}
