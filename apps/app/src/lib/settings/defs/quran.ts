import type {
  QuranReaderLayout,
  QuranRepeatMode,
  QuranTranslationAudio,
} from "@munib-tracker/shared/types";

import type { Href } from "expo-router";

import { DEFAULT_QURAN_PREFS, type QuranPrefs } from "@/db/repositories/quran-repository";
import { DEFAULT_RECITER_DIR, RECITERS } from "@/lib/quran-audio";
import { DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import type { PracticeView, QuranCompanionPrefs, RangePreset } from "@/lib/quran-companion/types";
import { pronunciationCalibrationStore } from "@/stores/pronunciation-calibration-store";
import { quranCompanionPrefsStore } from "@/stores/quran-companion-prefs-store";
import { quranStore } from "@/stores/quran-store";

import { editor } from "../editors";
import { type AnySettingDef, defineSetting, type SettingDef } from "../types";
import { NO_VALUE, onOff } from "./helpers";

const QuranEditionControl = editor("QuranEditionControl");
const PronunciationSettingsEditor = editor("PronunciationSettingsEditor");
const MicrophoneStatusRow = editor("MicrophoneStatusRow");

const G = "quran" as const;
const READING = "settingsPanel.section.reading";
const RECITATION = "settingsPanel.section.recitation";
const PRACTICE = "settingsPanel.section.practice";
const PRACTICE_HREF = "/settings/quran-practice" as const;
const NOTES = "settingsIntegration.section.notes";

const updateQuran = (patch: Partial<QuranPrefs>) => quranStore.getState().updatePrefs(patch);
const updateCompanion = (patch: Partial<QuranCompanionPrefs>) =>
  quranCompanionPrefsStore.getState().update(patch);

type QuranBoolKey = "showWordByWord" | "showTajweed";

function quranToggle(
  id: string,
  key: QuranBoolKey,
  titleKey: string,
  extra: Partial<SettingDef<boolean>> = {},
): SettingDef<boolean> {
  return {
    id,
    group: G,
    section: READING,
    titleKey,
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => s.quran[key] ?? (DEFAULT_QURAN_PREFS[key] as boolean),
    write: (v) => updateQuran({ [key]: v }),
    defaultValue: DEFAULT_QURAN_PREFS[key] as boolean,
    summary: onOff,
    shortcuts: ["/quran/[surah]", "/quran/page/[page]"],
    fields: [`quran.${key}`],
    ...extra,
  };
}

/**
 * Practice options edited on `/settings/quran-practice` (rich screen with the
 * listener models). Listed once via the "Practice settings" link row; each
 * remains searchable and resettable here.
 */
function practiceField<K extends keyof QuranCompanionPrefs>(
  key: K,
  titleKey: string,
): SettingDef<QuranCompanionPrefs[K]> {
  return {
    id: `quran.practice.${String(key)}`,
    group: G,
    section: PRACTICE,
    titleKey,
    scope: "account",
    control: { kind: "link", href: PRACTICE_HREF },
    read: (s) => s.companion[key],
    write: (v) => updateCompanion({ [key]: v } as Partial<QuranCompanionPrefs>),
    defaultValue: DEFAULT_COMPANION_PREFS[key],
    listed: false,
    shortcuts: [PRACTICE_HREF, "/quran/practice/session"],
    fields: [`companion.${String(key)}`],
  };
}

export const QURAN_SETTINGS: AnySettingDef[] = [
  // ── Reading ───────────────────────────────────────────────────────────────
  defineSetting<QuranReaderLayout>({
    id: "quran.reader.layout",
    group: G,
    section: READING,
    titleKey: "quran.readerLayout",
    keywordsKey: "settingsPanel.kw.readerLayout",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: [
        { value: "ayah", labelKey: "quran.layoutAyah" },
        { value: "page", labelKey: "quran.layoutPage" },
        { value: "mushaf", labelKey: "quran.layoutMushaf" },
      ],
    },
    read: (s) => s.quran.readerLayout ?? "ayah",
    write: (v) => updateQuran({ readerLayout: v }),
    defaultValue: "ayah",
    summary: (v, t) =>
      t(
        v === "page"
          ? "quran.layoutPage"
          : v === "mushaf"
            ? "quran.layoutMushaf"
            : "quran.layoutAyah",
      ),
    shortcuts: ["/quran/[surah]", "/quran/page/[page]"],
    fields: ["quran.readerLayout"],
  }),
  defineSetting<string>({
    id: "quran.reader.translation",
    group: G,
    section: READING,
    titleKey: "quran.translation",
    keywordsKey: "settingsPanel.kw.translation",
    scope: "account",
    control: { kind: "custom", Component: QuranEditionControl },
    read: (s) =>
      s.quran.preferredTranslationIds[0] ?? DEFAULT_QURAN_PREFS.preferredTranslationIds[0],
    write: (v) => updateQuran({ preferredTranslationIds: [v] }),
    defaultValue: DEFAULT_QURAN_PREFS.preferredTranslationIds[0],
    shortcuts: ["/quran/[surah]"],
    fields: ["quran.preferredTranslationIds"],
  }),
  defineSetting<string>({
    id: "quran.reader.secondTranslation",
    group: G,
    section: READING,
    titleKey: "settingsPanel.secondTranslation",
    keywordsKey: "settingsPanel.kw.translation",
    scope: "account",
    control: { kind: "custom", Component: QuranEditionControl },
    read: (s) => s.quran.secondaryTranslationId ?? "",
    write: (v) => updateQuran({ secondaryTranslationId: v || undefined }),
    defaultValue: "",
    shortcuts: ["/quran/[surah]"],
    fields: ["quran.secondaryTranslationId"],
  }),
  defineSetting<string>({
    id: "quran.reader.tafsir",
    group: G,
    section: READING,
    titleKey: "quran.tafsir",
    keywordsKey: "settingsPanel.kw.tafsir",
    scope: "account",
    control: { kind: "custom", Component: QuranEditionControl },
    read: (s) => s.quran.preferredTafsirId ?? "",
    write: (v) => updateQuran({ preferredTafsirId: v || undefined }),
    defaultValue: "",
    shortcuts: ["/quran/[surah]"],
    fields: ["quran.preferredTafsirId"],
  }),
  // Translation / transliteration visibility is app-wide under Text & fonts (D13).
  quranToggle("quran.reader.wordByWord", "showWordByWord", "quran.wordByWord.title", {
    keywordsKey: "settingsPanel.kw.wordByWord",
  }),
  quranToggle("quran.reader.tajweed", "showTajweed", "quran.showTajweed", {
    keywordsKey: "settingsPanel.kw.tajweed",
  }),

  // ── Recitation ────────────────────────────────────────────────────────────
  defineSetting<string>({
    id: "quran.recitation.reciter",
    group: G,
    section: RECITATION,
    titleKey: "quran.reciter",
    keywordsKey: "settingsPanel.kw.reciter",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "sheet",
      options: RECITERS.map((r) => ({ value: r.dir, label: r.name })),
    },
    read: (s) => s.quran.preferredReciterDir,
    write: (v) => updateQuran({ preferredReciterDir: v }),
    defaultValue: DEFAULT_RECITER_DIR,
    summary: (v) => RECITERS.find((r) => r.dir === v)?.name ?? v,
    shortcuts: ["/quran/[surah]"],
    fields: ["quran.preferredReciterDir"],
  }),
  defineSetting<QuranTranslationAudio>({
    id: "quran.recitation.translationAudio",
    group: G,
    section: RECITATION,
    titleKey: "quran.playback.translationAudio",
    subtitleKey: "quran.playback.translationAudioHint",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: [
        { value: "off", labelKey: "quran.playback.translationOff" },
        { value: "after", labelKey: "quran.playback.translationAfter" },
      ],
    },
    read: (s) => s.quran.translationAudio ?? "off",
    write: (v) => updateQuran({ translationAudio: v }),
    defaultValue: "off",
    summary: (v, t) =>
      t(v === "after" ? "quran.playback.translationAfter" : "quran.playback.translationOff"),
    available: (ctx) => !ctx.tv,
    shortcuts: ["PlaybackSettingsSheet"],
    fields: ["quran.translationAudio"],
  }),
  defineSetting<QuranRepeatMode>({
    id: "quran.recitation.repeat",
    group: G,
    section: RECITATION,
    titleKey: "quran.playback.repeatMode",
    keywordsKey: "settingsPanel.kw.repeat",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      // "range" needs an ayah range, so it is only offered inside the player sheet.
      options: [
        { value: "off", labelKey: "quran.playback.repeatOff" },
        { value: "verse", labelKey: "quran.playback.repeatVerse" },
        { value: "surah", labelKey: "quran.playback.repeatSurah" },
      ],
    },
    read: (s) => s.quran.repeatMode ?? "off",
    write: (v) => updateQuran({ repeatMode: v }),
    defaultValue: "off",
    summary: (v, t) =>
      t(
        v === "verse"
          ? "quran.playback.repeatVerse"
          : v === "surah"
            ? "quran.playback.repeatSurah"
            : v === "range"
              ? "quran.playback.repeatRange"
              : "quran.playback.repeatOff",
      ),
    shortcuts: ["PlaybackSettingsSheet", "MiniPlayer"],
    fields: ["quran.repeatMode", "quran.repeatRange"],
  }),
  // The ayah range for "Repeat range" only makes sense inside the player sheet
  // (it needs the open surah), so it is never listed, searched or reset — it is
  // registered only so the sheet writes it through the same single path.
  defineSetting<{ start: number; end: number } | undefined>({
    id: "quran.recitation.repeatRange",
    group: G,
    section: RECITATION,
    titleKey: "quran.playback.repeatRange",
    scope: "account",
    control: { kind: "link", href: "/settings/quran" },
    read: (s) => s.quran.repeatRange,
    write: (v) => updateQuran({ repeatRange: v }),
    defaultValue: undefined,
    available: () => false,
    listed: false,
    resettable: false,
    shortcuts: ["PlaybackSettingsSheet"],
    fields: ["quran.repeatRange"],
  }),

  // ── Practice ──────────────────────────────────────────────────────────────
  defineSetting<PracticeView>({
    id: "quran.practice.practiceView",
    group: G,
    section: PRACTICE,
    titleKey: "quranCompanion.view.title",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: [
        { value: "ayah", labelKey: "quran.layoutAyah" },
        { value: "page", labelKey: "quran.layoutPage" },
        { value: "mushaf", labelKey: "quran.layoutMushaf" },
      ],
    },
    read: (s) => s.companion.practiceView,
    write: (v) => updateCompanion({ practiceView: v }),
    defaultValue: DEFAULT_COMPANION_PREFS.practiceView,
    summary: (v, t) =>
      t(
        v === "page"
          ? "quran.layoutPage"
          : v === "mushaf"
            ? "quran.layoutMushaf"
            : "quran.layoutAyah",
      ),
    available: (ctx) => !ctx.tv,
    shortcuts: ["/quran/practice/session"],
    fields: ["companion.practiceView"],
  }),
  defineSetting<RangePreset>({
    id: "quran.practice.rangePreset",
    group: G,
    section: PRACTICE,
    titleKey: "settingsPanel.practiceRange",
    scope: "account",
    control: {
      kind: "choice",
      presentation: "segmented",
      options: [
        { value: "ayah", labelKey: "quranCompanion.range.ayah" },
        { value: "next5", labelKey: "quranCompanion.range.next5" },
        { value: "surah", labelKey: "quranCompanion.range.surah" },
        { value: "page", labelKey: "quranCompanion.range.page" },
      ],
    },
    read: (s) => s.companion.rangePreset,
    write: (v) => updateCompanion({ rangePreset: v }),
    defaultValue: DEFAULT_COMPANION_PREFS.rangePreset,
    summary: (v, t) => t(`quranCompanion.range.${v}`),
    available: (ctx) => !ctx.tv,
    shortcuts: ["/quran/practice"],
    fields: ["companion.rangePreset"],
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "quran.practice.open",
    group: G,
    section: PRACTICE,
    titleKey: "settingsPanel.practiceSettings",
    subtitleKey: "settingsPanel.practiceSettingsSub",
    keywordsKey: "settingsPanel.kw.practice",
    icon: { ios: "waveform.and.mic", android: "record_voice_over", web: "record_voice_over" },
    scope: "account",
    control: { kind: "link", href: PRACTICE_HREF },
    available: (ctx) => !ctx.tv,
  }),
  ...[
    practiceField("defaultMode", "quranCompanion.settings.defaultMode"),
    practiceField("feedbackTiming", "quranCompanion.settings.feedbackTiming"),
    practiceField("hearBeforeRecite", "quranCompanion.settings.hearBeforeRecite"),
    practiceField("startFrom", "quranCompanion.settings.startFromTitle"),
    practiceField("autoAdvance", "quranCompanion.settings.autoAdvance"),
    practiceField("keepAwake", "quranCompanion.settings.keepAwake"),
    practiceField("showTajweedColors", "quranCompanion.settings.showTajweed"),
    practiceField("dailyRevisionLimit", "quranCompanion.settings.dailyLimit"),
    practiceField("includeHifzReview", "quranCompanion.settings.includeHifz"),
    practiceField("engineChoice", "quranCompanion.listener.advanced"),
    practiceField("wifiOnlyDownload", "quranCompanion.listener.wifiOnly"),
  ].map((def) => ({ ...def, available: (ctx: { tv: boolean }) => !ctx.tv }) as AnySettingDef),
  // NF-3.24 (D20): pronunciation-check "Listen again" words feed NF-3.15 coaching.
  defineSetting<boolean>({
    id: "quran.practice.feedCoachingFromAssessment",
    group: G,
    section: PRACTICE,
    titleKey: "quranPronunciation.settings.feedCoaching",
    subtitleKey: "quranPronunciation.settings.feedCoachingSub",
    keywordsKey: "quranPronunciation.settings.keywords",
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => s.companion.feedCoachingFromAssessment ?? true,
    write: (v) => updateCompanion({ feedCoachingFromAssessment: v }),
    defaultValue: DEFAULT_COMPANION_PREFS.feedCoachingFromAssessment,
    summary: onOff,
    available: (ctx) => !ctx.tv,
    shortcuts: ["/quran/practice/session"],
    fields: ["companion.feedCoachingFromAssessment"],
  }),
  // NF-3.15: the revision reminder also names a due tajweed coaching sound.
  defineSetting<boolean>({
    id: "quran.practice.tajweedInRevisionReminder",
    group: G,
    section: PRACTICE,
    titleKey: "tajweedCoaching.settings.reminderTitle",
    subtitleKey: "tajweedCoaching.settings.reminderSub",
    keywordsKey: "tajweedCoaching.settings.keywords",
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => s.companion.tajweedInRevisionReminder ?? true,
    write: (v) => updateCompanion({ tajweedInRevisionReminder: v }),
    defaultValue: DEFAULT_COMPANION_PREFS.tajweedInRevisionReminder,
    summary: onOff,
    sideEffects: ["reschedule-reminders"],
    available: (ctx) => !ctx.tv,
    shortcuts: ["/learn-quran/tajweed"],
    fields: ["companion.tajweedInRevisionReminder"],
  }),
  // D68: ayahs recited in practice count toward today's reading log + personal khatm.
  defineSetting<boolean>({
    id: "quran.practice.logToReadingLog",
    group: G,
    section: PRACTICE,
    titleKey: "practiceReadingCredit.settings.title",
    subtitleKey: "practiceReadingCredit.settings.sub",
    keywordsKey: "practiceReadingCredit.settings.keywords",
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => s.companion.logToReadingLog ?? true,
    write: (v) => updateCompanion({ logToReadingLog: v }),
    defaultValue: DEFAULT_COMPANION_PREFS.logToReadingLog,
    summary: onOff,
    available: (ctx) => !ctx.tv,
    shortcuts: [PRACTICE_HREF],
    fields: ["companion.logToReadingLog"],
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "quran.practice.pronunciationCalibration",
    group: G,
    section: PRACTICE,
    titleKey: "quranPronunciation.settings.calibrationTitle",
    subtitleKey: "quranPronunciation.settings.calibrationSub",
    keywordsKey: "quranPronunciation.settings.keywords",
    // Device-local (DB_KEYS.quranPronunciationCalibration): this device's voice only.
    scope: "device",
    control: {
      kind: "action",
      run: () => pronunciationCalibrationStore.getState().clear(),
      confirmKey: "quranPronunciation.settings.calibrationResetConfirm",
      doneKey: "settings.done.calibration",
    },
    available: (ctx) => !ctx.tv,
  }),
  // §4.5.3: the Quran Lab pronunciation card (listener state + recitation
  // sharing) and the microphone status, inline here so they're ≤ 2 taps and
  // searchable (they also stay on /settings/quran-practice).
  defineSetting<null>({
    ...NO_VALUE,
    id: "quran.practice.pronunciation",
    group: G,
    section: PRACTICE,
    titleKey: "quranCompanion.pronunciation.title",
    keywordsKey: "quranPronunciation.settings.keywords",
    scope: "device",
    control: { kind: "custom", Component: PronunciationSettingsEditor },
    available: (ctx) => !ctx.tv,
    shortcuts: [PRACTICE_HREF],
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "quran.practice.microphone",
    group: G,
    section: PRACTICE,
    titleKey: "quranCompanion.privacy.microphone",
    scope: "device",
    control: { kind: "custom", Component: MicrophoneStatusRow },
    available: (ctx) => !ctx.tv,
    shortcuts: [PRACTICE_HREF, "/settings/privacy"],
  }),

  // ── Notes (NF-3.4, optional rows: the notes live on /quran/notes) ─────────
  defineSetting<null>({
    ...NO_VALUE,
    id: "quran.notes.manage",
    group: G,
    section: NOTES,
    titleKey: "quranNotes.title",
    subtitleKey: "quranNotes.subtitle",
    icon: { ios: "note.text", android: "sticky_note_2", web: "sticky_note_2" },
    scope: "account",
    control: { kind: "link", href: "/quran/notes" as Href },
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "quran.notes.export",
    group: G,
    section: NOTES,
    titleKey: "quranNotes.export.open",
    scope: "account",
    // Opens the notes screen with its export sheet (scope / format choices live there).
    control: { kind: "link", href: "/quran/notes?export=1" as Href },
    // TV is read-only for notes (no export).
    available: (ctx) => !ctx.tv,
  }),
];
