/**
 * Qur'an reader / player shortcuts (§4.5.2): the reader toolbars, filter card,
 * edition pickers and the playback sheet patch Qur'an prefs through the
 * registered settings, so the reader and Settings › Qur'an share one write path
 * (validation + side effects). Unknown keys are a programming error.
 */
import type { QuranPrefs } from "@/db/repositories/quran-repository";

import { setSetting } from "./shortcuts";
import { setTtsVoice } from "./tts-voice";

type QuranPatch = Partial<QuranPrefs>;

const ROUTES: {
  [K in keyof QuranPrefs]?: (value: QuranPrefs[K]) => Promise<void>;
} = {
  readerLayout: (v) => setSetting("quran.reader.layout", v ?? "ayah"),
  preferredTranslationIds: (v) => setSetting("quran.reader.translation", v[0]),
  secondaryTranslationId: (v) => setSetting("quran.reader.secondTranslation", v ?? ""),
  preferredTafsirId: (v) => setSetting("quran.reader.tafsir", v ?? ""),
  showWordByWord: (v) => setSetting("quran.reader.wordByWord", v === true),
  showTajweed: (v) => setSetting("quran.reader.tajweed", v === true),
  preferredReciterDir: (v) => setSetting("quran.recitation.reciter", v),
  translationAudio: (v) => setSetting("quran.recitation.translationAudio", v ?? "off"),
  repeatMode: (v) => setSetting("quran.recitation.repeat", v ?? "off"),
  repeatRange: (v) => setSetting("quran.recitation.repeatRange", v),
};

/** Drop-in for `useQuranActions().updatePrefs` in reader UI. */
export async function updateQuranPrefs(patch: QuranPatch): Promise<void> {
  for (const key of Object.keys(patch) as (keyof QuranPrefs)[]) {
    if (key === "ttsVoiceByLang") {
      throw new Error("Use setTtsVoice(lang, voiceId) for device voices");
    }
    const route = ROUTES[key] as ((value: unknown) => Promise<void>) | undefined;
    if (!route) throw new Error(`Qur'an pref "${String(key)}" has no registered setting`);
    await route(patch[key]);
  }
}

export { setTtsVoice };
