import { NAMES_OF_ALLAH } from "@munib-tracker/shared/content/names";
import type { UserPreferences } from "@munib-tracker/shared/types";
import type { Href } from "expo-router";

import i18n from "@/i18n";
import {
  buildKnowledgeCardPool,
  type KnowledgeCardEntry,
  MOTIVATION_QUOTES,
  type MotivationTopic,
} from "@/lib/knowledge-card-data";
import { type AppIcon, NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { hadithCollectionId, hadithExcerpt, resolveHadithItem } from "@/lib/prayer-info";
import { getBundledEdition, getSurahAyahs, getSurahByNumber } from "@/lib/quran";
import { resolveQuranEditionId } from "@/lib/translation-locale";

export type KnowledgeCardKind = "quran" | "hadith" | "name" | "friday" | "motivation";

export type KnowledgeCardIcon = AppIcon;

export type KnowledgeCardPalette = "accent" | "info" | "success" | "warning" | "danger";

export type ResolvedKnowledgeCard = {
  key: string;
  kind: KnowledgeCardKind;
  topic?: MotivationTopic;
  titleKey: string;
  arabic?: string;
  body: string;
  reference?: string;
  href?: Href;
  icon: KnowledgeCardIcon;
  palette: KnowledgeCardPalette;
  actionKey?: string;
};

const MAX_HADITH_EXCERPT = 180;
const MAX_QURAN_TRANSLATION = 220;

const DEFAULT_PREFS: Pick<UserPreferences, "locale" | "translationLocale"> = {
  locale: "en",
  translationLocale: "en",
};

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pickIndex(pool: KnowledgeCardEntry[], seed: number): number {
  if (pool.length === 0) return 0;
  const rand = mulberry32(seed);
  return Math.floor(rand() * pool.length);
}

function truncate(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trim()}…`;
}

function resolveQuran(
  surah: number,
  ayah: number,
  kind: "quran" | "friday",
  prefs: Pick<UserPreferences, "locale" | "translationLocale">,
): ResolvedKnowledgeCard | null {
  const meta = getSurahByNumber(surah);
  const ayahs = getSurahAyahs(surah);
  const item = ayahs[ayah - 1];
  if (!meta || !item) return null;

  const editionId = resolveQuranEditionId(prefs);
  const translation =
    getBundledEdition(editionId, surah)[String(ayah)] ??
    getBundledEdition("en-pickthall", surah)[String(ayah)] ??
    getBundledEdition("en-transliteration", surah)[String(ayah)] ??
    "";

  return {
    key: `${kind}:${surah}:${ayah}`,
    kind,
    titleKey: kind === "friday" ? "home.knowledgeKind.friday" : "home.knowledgeKind.quran",
    arabic: item.arabic,
    body: truncate(translation, MAX_QURAN_TRANSLATION),
    reference: `${meta.nameTransliteration} ${surah}:${ayah}`,
    href: {
      pathname: "/quran/[surah]",
      params: { surah: String(surah), ayah: String(ayah) },
    },
    icon: {
      ios: kind === "friday" ? "sun.max.fill" : "book.fill",
      android: kind === "friday" ? "wb_sunny" : "menu_book",
      web: kind === "friday" ? "wb_sunny" : "menu_book",
    },
    palette: kind === "friday" ? "warning" : "accent",
    actionKey: "home.knowledgeAction.quran",
  };
}

function resolveHadith(id: string, kind: "hadith" | "friday"): ResolvedKnowledgeCard | null {
  const item = resolveHadithItem(id);
  if (!item) return null;

  return {
    key: `${kind}:${id}`,
    kind,
    titleKey: kind === "friday" ? "home.knowledgeKind.friday" : "home.knowledgeKind.hadith",
    body: hadithExcerpt(item, MAX_HADITH_EXCERPT),
    reference: item.reference,
    href: {
      pathname: "/hadith/[collection]",
      params: {
        collection: hadithCollectionId(id),
        q: item.reference,
      },
    },
    icon: {
      ios: kind === "friday" ? "sun.max.fill" : "text.book.closed.fill",
      android: kind === "friday" ? "wb_sunny" : "auto_stories",
      web: kind === "friday" ? "wb_sunny" : "auto_stories",
    },
    palette: kind === "friday" ? "warning" : "info",
    actionKey: "home.knowledgeAction.hadith",
  };
}

function resolveName(id: string): ResolvedKnowledgeCard | null {
  const name = NAMES_OF_ALLAH.find((entry) => entry.id === id);
  if (!name) return null;

  return {
    key: `name:${id}`,
    kind: "name",
    titleKey: "home.knowledgeKind.name",
    arabic: name.arabic,
    body: name.meaning ?? name.translation,
    reference: name.transliteration,
    href: "/names-of-allah",
    icon: NAMES_OF_ALLAH_ICON,
    palette: "accent",
    actionKey: "home.knowledgeAction.name",
  };
}

function resolveMotivation(id: string): ResolvedKnowledgeCard | null {
  const quote = MOTIVATION_QUOTES.find((entry) => entry.id === id);
  if (!quote) return null;

  const paletteByTopic: Record<MotivationTopic, KnowledgeCardPalette> = {
    prayer: "info",
    qaza: "warning",
    zikr: "danger",
    fasting: "success",
    steadfastness: "accent",
    general: "success",
  };

  const body = i18n.t(`home.knowledgeMotivation.${id}.text`, { defaultValue: quote.text });
  const source = i18n.t(`home.knowledgeMotivation.${id}.source`, {
    defaultValue: quote.source ?? "",
  });

  return {
    key: `motivation:${id}`,
    kind: "motivation",
    topic: quote.topic,
    titleKey: `home.knowledgeTopic.${quote.topic}`,
    body,
    reference: source || undefined,
    icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
    palette: paletteByTopic[quote.topic],
  };
}

export function resolveKnowledgeCardEntry(
  entry: KnowledgeCardEntry,
  prefs: Pick<UserPreferences, "locale" | "translationLocale"> = DEFAULT_PREFS,
): ResolvedKnowledgeCard | null {
  switch (entry.kind) {
    case "quran":
      return resolveQuran(entry.surah, entry.ayah, "quran", prefs);
    case "friday-quran":
      return resolveQuran(entry.surah, entry.ayah, "friday", prefs);
    case "hadith":
      return resolveHadith(entry.id, "hadith");
    case "friday-hadith":
      return resolveHadith(entry.id, "friday");
    case "name":
      return resolveName(entry.id);
    case "motivation":
      return resolveMotivation(entry.id);
    default:
      return null;
  }
}

/** Pick a random resolved card; retries if a pool entry fails to resolve. */
export function pickKnowledgeCard(
  seed: number,
  date = new Date(),
  prefs: Pick<UserPreferences, "locale" | "translationLocale"> = DEFAULT_PREFS,
): ResolvedKnowledgeCard {
  const pool = buildKnowledgeCardPool(date);
  const start = pickIndex(pool, seed);

  for (let offset = 0; offset < pool.length; offset += 1) {
    const entry = pool[(start + offset) % pool.length];
    const resolved = resolveKnowledgeCardEntry(entry, prefs);
    if (resolved) return resolved;
  }

  return {
    key: "fallback",
    kind: "motivation",
    topic: "steadfastness",
    titleKey: "home.knowledgeKind.motivation",
    body: i18n.t("home.knowledgeMotivation.steady-steps.text"),
    icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
    palette: "accent",
  };
}
