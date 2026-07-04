import type { DuaItem, HadithItem, ZikrItem } from "@munib-tracker/shared/types";
import type { Href } from "expo-router";

import { getSurahByNumber } from "@/lib/quran";

export type ContinueKind = "quran" | "hadith" | "dua" | "zikr" | "durood" | "names" | "audio";

export interface ContinueActivity {
  kind: ContinueKind;
  href: string;
  title: string;
  subtitle?: string;
  preview?: string;
  isAudio?: boolean;
  updatedAt: string;
}

export type ContinueActivityInput = Omit<ContinueActivity, "updatedAt">;

const CONTENT_PREFIXES = [
  "/quran",
  "/hadith",
  "/dua",
  "/zikr",
  "/duroods",
  "/names-of-allah",
] as const;

function truncate(text: string, max = 120): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trim()}…`;
}

export function isContinueContentHref(href: string | null | undefined): boolean {
  if (!href) return false;
  return CONTENT_PREFIXES.some((prefix) => href.startsWith(prefix));
}

export function buildQuranActivity(
  surah: number,
  ayah: number,
  options?: { isAudio?: boolean },
): ContinueActivityInput {
  const meta = getSurahByNumber(surah);

  return {
    kind: "quran",
    href: ayah > 1 ? `/quran/${surah}?ayah=${ayah}` : `/quran/${surah}`,
    title: meta?.nameTransliteration ?? `Surah ${surah}`,
    subtitle: meta ? `${meta.nameEnglish} · ${surah}:${ayah}` : `Ayah ${ayah}`,
    preview: meta?.nameArabic,
    isAudio: options?.isAudio,
  };
}

export function buildHadithActivity(
  item: HadithItem,
  collectionName?: string,
  options?: { isAudio?: boolean },
): ContinueActivityInput {
  return {
    kind: "hadith",
    href: `/hadith/${item.collection}?q=${encodeURIComponent(item.reference)}`,
    title: item.reference,
    subtitle: collectionName ?? item.narrator,
    preview: truncate(item.arabic || item.english),
    isAudio: options?.isAudio,
  };
}

export function buildHadithCollectionActivity(
  collectionId: string,
  collectionName: string,
): ContinueActivityInput {
  return {
    kind: "hadith",
    href: `/hadith/${collectionId}`,
    title: collectionName,
    subtitle: undefined,
  };
}

export function buildDuaActivity(
  item: DuaItem,
  options?: { isAudio?: boolean },
): ContinueActivityInput {
  return {
    kind: "dua",
    href: `/dua/detail/${item.id}`,
    title: item.title,
    preview: truncate(item.arabic),
    isAudio: options?.isAudio,
  };
}

export function buildZikrActivity(
  item: ZikrItem,
  options?: { isAudio?: boolean },
): ContinueActivityInput {
  return {
    kind: "zikr",
    href: `/zikr/detail/${item.id}`,
    title: item.title,
    preview: truncate(item.arabic),
    isAudio: options?.isAudio,
  };
}

export function buildDuroodActivity(
  item: { id?: string; title?: string; arabic: string },
  options?: { isAudio?: boolean },
): ContinueActivityInput {
  return {
    kind: "durood",
    href: "/duroods",
    title: item.title ?? "Durood",
    preview: truncate(item.arabic),
    isAudio: options?.isAudio,
  };
}

export function buildNamesActivity(
  name: { id: string; transliteration: string; meaning?: string; arabic?: string },
  options?: { isAudio?: boolean },
): ContinueActivityInput {
  return {
    kind: "names",
    href: "/names-of-allah",
    title: name.transliteration,
    subtitle: name.meaning,
    preview: name.arabic,
    isAudio: options?.isAudio,
  };
}

export function buildAudioActivity(
  sourceHref: string,
  track: { title: string; subtitle?: string },
): ContinueActivityInput | null {
  if (!isContinueContentHref(sourceHref)) return null;

  const kind: ContinueKind = sourceHref.startsWith("/quran")
    ? "quran"
    : sourceHref.startsWith("/hadith")
      ? "hadith"
      : sourceHref.startsWith("/dua")
        ? "dua"
        : sourceHref.startsWith("/zikr")
          ? "zikr"
          : sourceHref.startsWith("/duroods")
            ? "durood"
            : sourceHref.startsWith("/names-of-allah")
              ? "names"
              : "audio";

  return {
    kind,
    href: sourceHref,
    title: track.title,
    subtitle: track.subtitle,
    isAudio: true,
  };
}

export function navigateToContinue(
  router: { push: (href: Href) => void },
  activity: ContinueActivity,
): void {
  const href = activity.href;

  const quranMatch = href.match(/^\/quran\/(\d+)(?:\?(?:.*&)?ayah=(\d+))?/);
  if (quranMatch) {
    router.push({
      pathname: "/quran/[surah]",
      params: {
        surah: quranMatch[1],
        ...(quranMatch[2] ? { ayah: quranMatch[2] } : {}),
      },
    } as Href);
    return;
  }

  const hadithMatch = href.match(/^\/hadith\/([^?]+)(?:\?q=(.+))?$/);
  if (hadithMatch) {
    router.push({
      pathname: "/hadith/[collection]",
      params: {
        collection: decodeURIComponent(hadithMatch[1]),
        ...(hadithMatch[2] ? { q: decodeURIComponent(hadithMatch[2]) } : {}),
      },
    } as Href);
    return;
  }

  const duaMatch = href.match(/^\/dua\/detail\/(.+)$/);
  if (duaMatch) {
    router.push({ pathname: "/dua/detail/[id]", params: { id: duaMatch[1] } } as Href);
    return;
  }

  const zikrMatch = href.match(/^\/zikr\/detail\/(.+)$/);
  if (zikrMatch) {
    router.push({ pathname: "/zikr/detail/[id]", params: { id: zikrMatch[1] } } as Href);
    return;
  }

  router.push(href as Href);
}
