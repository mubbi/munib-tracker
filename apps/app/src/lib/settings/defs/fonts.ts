import type { FontPreferences, ReadingSurface } from "@munib-tracker/shared/types";

import {
  ARABIC_FONT_OPTIONS,
  DEFAULT_ARABIC_FONT_ID,
  nextReadingDelta,
} from "@/lib/reading-typography";
import { preferencesStore } from "@/stores/preferences-store";

import { editor } from "../editors";
import {
  readingDisplayOf,
  SHOW_TRANSLATION_SETTING,
  SHOW_TRANSLITERATION_SETTING,
  setReadingDisplay,
} from "../reading-display";
import { type AnySettingDef, defineSetting } from "../types";
import { NO_VALUE, onOff, updatePrefs } from "./helpers";

const ArabicTypefacePicker = editor("ArabicTypefacePicker");
const FontPreview = editor("FontPreview");
const ReadingSizeOverrides = editor("ReadingSizeOverrides");

const G = "fonts" as const;
const READING_DISPLAY = "settingsPanel.section.readingDisplay";
const TYPE = "settingsPanel.section.typeface";
const SIZES = "settingsPanel.section.sizes";
const PER_SCREEN = "settingsPanel.section.perScreen";

/** Discrete sizes the Fonts screen has always offered (points). */
export const ARABIC_SIZES = { s: 22, m: 28, l: 36 } as const;
export const TEXT_SIZES = { s: 14, m: 16, l: 18 } as const;
type SizeId = "s" | "m" | "l";

const SIZE_OPTIONS = [
  { value: "s" as const, labelKey: "fonts.small" },
  { value: "m" as const, labelKey: "fonts.medium" },
  { value: "l" as const, labelKey: "fonts.large" },
];

function sizeId(table: Record<SizeId, number>, value: number | undefined): SizeId {
  const hit = (Object.keys(table) as SizeId[]).find((id) => table[id] === value);
  return hit ?? "m";
}

function patchFonts(patch: (current: FontPreferences) => Partial<FontPreferences>) {
  const current = preferencesStore.getState().prefs.fontPrefs;
  return updatePrefs({ fontPrefs: { ...current, ...patch(current) } });
}

/** Surfaces whose A−/A+ delta differs from the global size. */
export function customSurfaceCount(fontPrefs: FontPreferences): number {
  return Object.values(fontPrefs.readingOverrides ?? {}).filter(
    (o) => !!o && ((o.arabicDelta ?? 0) !== 0 || (o.textDelta ?? 0) !== 0),
  ).length;
}

export function clearAllReadingOverrides(): Promise<void> {
  return patchFonts(() => ({ readingOverrides: {} }));
}

export function clearReadingOverride(surface: ReadingSurface): Promise<void> {
  return patchFonts((c) => {
    const next = { ...c.readingOverrides };
    delete next[surface];
    return { readingOverrides: next };
  });
}

/**
 * In-context A−/A+ (`ReadingFontControls`): one step bigger / smaller for one
 * surface. A shortcut to Text & fonts › Per-screen text sizes (same field).
 */
export function stepReadingOverride(surface: ReadingSurface, direction: 1 | -1): Promise<void> {
  return patchFonts((c) => ({
    readingOverrides: {
      ...c.readingOverrides,
      [surface]: nextReadingDelta(c, surface, direction),
    },
  }));
}

/** i18n title key per reading surface (Text & fonts › Per-screen text sizes). */
export const READING_SURFACE_TITLE_KEYS: Record<ReadingSurface, string> = {
  quran: "quran.title",
  hadith: "hadith.title",
  dua_zikr: "settingsPanel.surfaceDuaZikr",
  salah_guide: "salahGuide.title",
  jannah: "jannah.title",
  jahannam: "jahannam.title",
  battles: "battles.title",
  taharah: "taharah.title",
  prophets: "prophets.title",
  aqeedah: "aqeedah.title",
  last_day: "lastDay.title",
  learn_dua: "learnDua.title",
  learn_quran: "learnQuran.title",
};

/** Every reading surface with an in-context A−/A+ (13 today). */
export const READING_SURFACES = Object.keys(READING_SURFACE_TITLE_KEYS) as ReadingSurface[];

/** Every reader whose toolbar chip is a shortcut to the app-wide pair (D13). */
const READING_DISPLAY_SHORTCUTS = [
  "/quran/[surah]",
  "/quran/page/[page]",
  "/quran/practice/session",
  "/hadith/[collection]",
  "ScriptureReadingFilters",
  "ReadingTypographyContext",
];

export const FONT_SETTINGS: AnySettingDef[] = [
  // ── Translation & transliteration (one app-wide pair, D13) ────────────────
  defineSetting<boolean>({
    id: SHOW_TRANSLATION_SETTING,
    group: G,
    section: READING_DISPLAY,
    titleKey: "reading.showTranslation",
    subtitleKey: "settingsPanel.readingDisplaySub",
    keywordsKey: "settingsPanel.kw.readingDisplay",
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => readingDisplayOf(s.prefs).showTranslation,
    write: (v) => setReadingDisplay({ showTranslation: v }),
    defaultValue: true,
    summary: onOff,
    shortcuts: READING_DISPLAY_SHORTCUTS,
    fields: ["prefs.readingDisplay"],
  }),
  defineSetting<boolean>({
    id: SHOW_TRANSLITERATION_SETTING,
    group: G,
    section: READING_DISPLAY,
    titleKey: "reading.showTransliteration",
    subtitleKey: "settingsPanel.readingDisplaySub",
    keywordsKey: "settingsPanel.kw.readingDisplay",
    scope: "account",
    control: { kind: "toggle" },
    read: (s) => readingDisplayOf(s.prefs).showTransliteration,
    write: (v) => setReadingDisplay({ showTransliteration: v }),
    defaultValue: true,
    summary: onOff,
    shortcuts: READING_DISPLAY_SHORTCUTS,
    fields: ["prefs.readingDisplay"],
  }),
  defineSetting<string>({
    id: "fonts.arabicTypeface",
    group: G,
    section: TYPE,
    titleKey: "fonts.arabicFamilyTitle",
    subtitleKey: "fonts.arabicFamilyHint",
    keywordsKey: "settingsPanel.kw.font",
    scope: "account",
    control: { kind: "custom", Component: ArabicTypefacePicker },
    read: (s) => s.prefs.fontPrefs.arabic.family ?? DEFAULT_ARABIC_FONT_ID,
    write: (v) => patchFonts((c) => ({ arabic: { ...c.arabic, family: v } })),
    defaultValue: DEFAULT_ARABIC_FONT_ID,
    summary: (v, t) => {
      const option = ARABIC_FONT_OPTIONS.find((o) => o.id === v);
      return option ? t(option.labelKey) : v;
    },
    fields: ["prefs.fontPrefs.arabic"],
  }),
  defineSetting<SizeId>({
    id: "fonts.arabicSize",
    group: G,
    section: SIZES,
    titleKey: "fonts.arabicText",
    keywordsKey: "settingsPanel.kw.textSize",
    scope: "account",
    control: { kind: "choice", presentation: "segmented", options: SIZE_OPTIONS },
    read: (s) => sizeId(ARABIC_SIZES, s.prefs.fontPrefs.arabic.size ?? ARABIC_SIZES.m),
    write: (v) => patchFonts((c) => ({ arabic: { ...c.arabic, size: ARABIC_SIZES[v] } })),
    defaultValue: "m",
    summary: (v, t) => t(SIZE_OPTIONS.find((o) => o.value === v)?.labelKey ?? "fonts.medium"),
    fields: ["prefs.fontPrefs.arabic"],
  }),
  defineSetting<SizeId>({
    id: "fonts.translationSize",
    group: G,
    section: SIZES,
    titleKey: "fonts.translationText",
    subtitleKey: "settingsPanel.translationSizeSub",
    keywordsKey: "settingsPanel.kw.textSize",
    scope: "account",
    control: { kind: "choice", presentation: "segmented", options: SIZE_OPTIONS },
    read: (s) => sizeId(TEXT_SIZES, s.prefs.fontPrefs.translation.size ?? TEXT_SIZES.m),
    write: (v) => patchFonts((c) => ({ translation: { ...c.translation, size: TEXT_SIZES[v] } })),
    defaultValue: "m",
    summary: (v, t) => t(SIZE_OPTIONS.find((o) => o.value === v)?.labelKey ?? "fonts.medium"),
    fields: ["prefs.fontPrefs.translation"],
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "fonts.preview",
    group: G,
    section: SIZES,
    titleKey: "fonts.preview",
    scope: "account",
    control: { kind: "custom", Component: FontPreview },
  }),
  defineSetting<number>({
    id: "fonts.perScreen",
    group: G,
    section: PER_SCREEN,
    titleKey: "settingsPanel.perScreenSizes",
    subtitleKey: "settingsPanel.perScreenSizesSub",
    keywordsKey: "settingsPanel.kw.textSize",
    scope: "account",
    control: { kind: "custom", Component: ReadingSizeOverrides },
    // Value = how many surfaces carry a custom size (the summary).
    read: (s) => customSurfaceCount(s.prefs.fontPrefs),
    write: async (v) => {
      if (v === 0) await clearAllReadingOverrides();
    },
    defaultValue: 0,
    summary: (v, t) =>
      v === 0 ? t("settingsPanel.allDefault") : t("settingsPanel.customCount", { count: v }),
    shortcuts: ["ReadingFontControls"],
    fields: ["prefs.fontPrefs.readingOverrides"],
  }),
  defineSetting<null>({
    ...NO_VALUE,
    id: "fonts.resetAllSizes",
    group: G,
    section: PER_SCREEN,
    titleKey: "settingsPanel.resetAllSizes",
    scope: "account",
    control: {
      kind: "action",
      run: clearAllReadingOverrides,
      confirmKey: "settingsPanel.resetAllSizesConfirm",
    },
  }),
];
