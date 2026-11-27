import type { TFunction } from "i18next";

import { createFuzzyIndex, type FuzzyIndex } from "@/lib/search-fuse";

import { getSettingsGroup, isGroupAvailable } from "./groups";
import { isSettingAvailable, SETTINGS_REGISTRY } from "./registry";
import type { AnySettingDef, PlatformCtx } from "./types";

export interface SettingSearchEntry {
  def: AnySettingDef;
  title: string;
  subtitle: string;
  /** "Reminders & notifications › Salah & adhan" in the current locale. */
  path: string;
  groupTitle: string;
  sectionTitle: string;
  keywords: string;
  en: { title: string; subtitle: string; path: string; keywords: string };
}

function texts(def: AnySettingDef, t: TFunction) {
  const groupTitle = t(getSettingsGroup(def.group).titleKey);
  const sectionTitle = t(def.section);
  return {
    title: t(def.titleKey),
    subtitle: def.subtitleKey ? t(def.subtitleKey) : "",
    groupTitle,
    sectionTitle,
    path: `${groupTitle} › ${sectionTitle}`,
    keywords: def.keywordsKey ? t(def.keywordsKey) : "",
  };
}

/** Entries for every setting available on this platform (title/path in both locales). */
export function buildSettingsEntries(
  t: TFunction,
  tEnglish: TFunction,
  ctx: PlatformCtx,
): SettingSearchEntry[] {
  return SETTINGS_REGISTRY.filter(
    (def) => isSettingAvailable(def, ctx) && isGroupAvailable(getSettingsGroup(def.group), ctx),
  ).map((def) => {
    const local = texts(def, t);
    const en = texts(def, tEnglish);
    return {
      def,
      ...local,
      en: { title: en.title, subtitle: en.subtitle, path: en.path, keywords: en.keywords },
    };
  });
}

/**
 * Fuzzy index over each setting's title, synonyms, subtitle, section and group —
 * in the current locale AND English, so "azan" finds the adhan settings in every
 * language (§4.5.6). Project Fuse defaults via `createFuzzyIndex`.
 */
export function createSettingsIndex(entries: SettingSearchEntry[]): FuzzyIndex<SettingSearchEntry> {
  return createFuzzyIndex(entries, [
    { key: "title", weight: 3, get: (e) => e.title },
    { key: "keywords", weight: 2, get: (e) => e.keywords },
    { key: "enTitle", weight: 2, get: (e) => e.en.title },
    { key: "enKeywords", weight: 1.5, get: (e) => e.en.keywords },
    { key: "path", weight: 1, get: (e) => e.path },
    { key: "enPath", weight: 0.8, get: (e) => e.en.path },
    { key: "subtitle", weight: 0.6, get: (e) => e.subtitle },
    { key: "enSubtitle", weight: 0.4, get: (e) => e.en.subtitle },
  ]);
}

/** One-shot search (tests, universal search). Screens should memoise the index. */
export function searchSettings(
  query: string,
  t: TFunction,
  tEnglish: TFunction,
  ctx: PlatformCtx,
  limit?: number,
): SettingSearchEntry[] {
  return createSettingsIndex(buildSettingsEntries(t, tEnglish, ctx)).search(query, limit);
}
