import { NAMES_OF_ALLAH } from "@munib-tracker/shared/content";
import type { Href } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";

import {
  buildKnowledgeCardPool,
  type KnowledgeCardEntry,
  MOTIVATION_QUOTES,
  type MotivationTopic,
} from "@/lib/knowledge-card-data";
import { hadithCollectionId, hadithExcerpt, resolveHadithItem } from "@/lib/prayer-info";
import { getBundledEdition, getSurahAyahs, getSurahByNumber } from "@/lib/quran";

export type KnowledgeCardKind = "quran" | "hadith" | "name" | "friday" | "motivation";

export type KnowledgeCardIcon = SymbolViewProps["name"];

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
): ResolvedKnowledgeCard | null {
  const meta = getSurahByNumber(surah);
  const ayahs = getSurahAyahs(surah);
  const item = ayahs[ayah - 1];
  if (!meta || !item) return null;

  const translation =
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
    icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
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

  return {
    key: `motivation:${id}`,
    kind: "motivation",
    topic: quote.topic,
    titleKey: `home.knowledgeTopic.${quote.topic}`,
    body: quote.text,
    reference: quote.source,
    icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
    palette: paletteByTopic[quote.topic],
  };
}

export function resolveKnowledgeCardEntry(entry: KnowledgeCardEntry): ResolvedKnowledgeCard | null {
  switch (entry.kind) {
    case "quran":
      return resolveQuran(entry.surah, entry.ayah, "quran");
    case "friday-quran":
      return resolveQuran(entry.surah, entry.ayah, "friday");
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
export function pickKnowledgeCard(seed: number, date = new Date()): ResolvedKnowledgeCard {
  const pool = buildKnowledgeCardPool(date);
  const start = pickIndex(pool, seed);

  for (let offset = 0; offset < pool.length; offset += 1) {
    const entry = pool[(start + offset) % pool.length];
    const resolved = resolveKnowledgeCardEntry(entry);
    if (resolved) return resolved;
  }

  return {
    key: "fallback",
    kind: "motivation",
    topic: "steadfastness",
    titleKey: "home.knowledgeKind.motivation",
    body: MOTIVATION_QUOTES[0]?.text ?? "",
    icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
    palette: "accent",
  };
}
