import type { Href } from "expo-router";
import { useEffect, useMemo, useState } from "react";

import { getRemoteCollection } from "@/api/hadith-remote";
import { HadithRepository } from "@/db";
import { useContentCorpus } from "@/hooks/use-content-corpus";
import { DUA_CORPUS, DUROOD_CORPUS, NAMES_CORPUS } from "@/lib/content-loaders";
import { getBundledCollection, getBundledCollectionData } from "@/lib/hadith";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { getSurahByNumber } from "@/lib/quran-meta";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
import { useEnsureDuaFavoritesLoaded, useFavoriteDuaIds } from "@/stores/dua-favorites-store";
import {
  useEnsureDuroodFavoritesLoaded,
  useFavoriteDuroodIds,
} from "@/stores/durood-favorites-store";
import { useEnsureNameFavoritesLoaded, useFavoriteNameIds } from "@/stores/name-favorites-store";
import { useFavoriteZikrIds } from "@/stores/preferences-store";
import { useEnsureQuranNotesLoaded, useQuranNotesIndex } from "@/stores/quran-notes-store";
import { useQuranBookmarks } from "@/stores/quran-store";

/** Where a saved item came from (one store each). */
export type SavedKind = "quran" | "hadith" | "duas" | "zikr" | "duroods" | "names" | "notes";

/** The filter chips on `/bookmarks`; Adhkar and Duroods fold into Duas. */
export type SavedFilter = "all" | "quran" | "hadith" | "duas" | "names" | "notes";

export const SAVED_FILTERS: SavedFilter[] = ["all", "quran", "hadith", "duas", "names", "notes"];

export function savedFilterOf(kind: SavedKind): Exclude<SavedFilter, "all"> {
  return kind === "zikr" || kind === "duroods" ? "duas" : kind;
}

export interface SavedItem {
  key: string;
  kind: SavedKind;
  title: string;
  subtitle?: string;
  icon: AppIcon;
  /** Epoch ms, when the store records it; undated favourites sort after dated items. */
  at?: number;
  href: Href;
}

const ICONS: Record<SavedKind, AppIcon> = {
  quran: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  hadith: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
  duas: {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  zikr: { ios: "heart.fill", android: "favorite", web: "favorite" },
  duroods: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
  names: NAMES_OF_ALLAH_ICON,
  notes: { ios: "note.text", android: "sticky_note_2", web: "sticky_note_2" },
};

function hadithHref(collection: string, hadithId: string): Href {
  const reference = getBundledCollectionData(collection)?.items.find(
    (item) => item.id === hadithId,
  )?.reference;
  return {
    pathname: "/hadith/[collection]",
    params: reference ? { collection, q: reference } : { collection },
  };
}

function time(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? undefined : ms;
}

/**
 * Every saved item from every store as one recent-first list (P5-36). Read-only:
 * the per-type stores stay the source of truth and keep their own screens.
 */
export function useSavedItems(): { items: SavedItem[]; loaded: boolean } {
  useEnsureDuaFavoritesLoaded();
  useEnsureDuroodFavoritesLoaded();
  useEnsureNameFavoritesLoaded();
  useEnsureQuranNotesLoaded();

  const quran = useQuranBookmarks();
  const duaIds = useFavoriteDuaIds();
  const zikrIds = useFavoriteZikrIds();
  const duroodIds = useFavoriteDuroodIds();
  const nameIds = useFavoriteNameIds();
  const { live: notes } = useQuranNotesIndex();

  const { items: duas } = useContentCorpus(DUA_CORPUS);
  const { items: duroods } = useContentCorpus(DUROOD_CORPUS);
  const { items: names } = useContentCorpus(NAMES_CORPUS);

  const [hadith, setHadith] = useState<Awaited<ReturnType<typeof HadithRepository.getBookmarks>>>(
    [],
  );
  const [hadithLoaded, setHadithLoaded] = useState(false);
  const [zikrReady, setZikrReady] = useState(false);

  useEffect(() => {
    let active = true;
    void HadithRepository.getBookmarks().then((list) => {
      if (!active) return;
      setHadith(list);
      setHadithLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void ensureZikrCorpus().then(
      () => active && setZikrReady(true),
      () => active && setZikrReady(true),
    );
    return () => {
      active = false;
    };
  }, []);

  const items = useMemo(() => {
    const out: SavedItem[] = [];

    for (const b of quran) {
      const surah = getSurahByNumber(b.surah);
      out.push({
        key: `quran:${b.id}`,
        kind: "quran",
        title: `${surah?.nameTransliteration ?? b.surah} ${b.surah}:${b.ayah}`,
        icon: ICONS.quran,
        at: time(b.createdAt),
        href: {
          pathname: "/quran/[surah]",
          params: { surah: String(b.surah), ayah: String(b.ayah) },
        },
      });
    }

    for (const b of hadith) {
      const name =
        getBundledCollection(b.collection)?.collection.nameEnglish ??
        getRemoteCollection(b.collection)?.nameEnglish ??
        b.collection;
      out.push({
        key: `hadith:${b.id}`,
        kind: "hadith",
        title: `${name} #${b.number}`,
        icon: ICONS.hadith,
        at: time(b.createdAt),
        // Seed the reader's search with the hadith's reference so it opens on that
        // hadith (B-31) — only when the bundled text is already in memory; the
        // hub never loads a whole collection just to build a link.
        href: hadithHref(b.collection, b.hadithId),
      });
    }

    const duaById = new Map(duas.map((d) => [d.id, d]));
    for (const id of duaIds) {
      const dua = duaById.get(id);
      if (!dua) continue;
      out.push({
        key: `duas:${id}`,
        kind: "duas",
        title: dua.title,
        subtitle: dua.reference,
        icon: ICONS.duas,
        href: { pathname: "/dua/detail/[id]", params: { id } },
      });
    }

    for (const id of zikrIds) {
      const zikr = zikrReady ? getZikrById(id) : undefined;
      if (!zikr) continue;
      out.push({
        key: `zikr:${id}`,
        kind: "zikr",
        title: zikr.title,
        subtitle: zikr.reference,
        icon: ICONS.zikr,
        href: { pathname: "/zikr/detail/[id]", params: { id } },
      });
    }

    const duroodById = new Map(duroods.map((d) => [d.id, d]));
    for (const id of duroodIds) {
      const durood = duroodById.get(id);
      if (!durood) continue;
      out.push({
        key: `duroods:${id}`,
        kind: "duroods",
        title: durood.title,
        icon: ICONS.duroods,
        // The saved-duroods list shows this durood in full (B-31), not the whole index.
        href: "/duroods/favorites",
      });
    }

    const nameById = new Map(names.map((n) => [n.id, n]));
    for (const id of nameIds) {
      const name = nameById.get(id);
      if (!name) continue;
      out.push({
        key: `names:${id}`,
        kind: "names",
        title: name.transliteration,
        subtitle: name.translation,
        icon: ICONS.names,
        href: { pathname: "/names-of-allah", params: { name: id } },
      });
    }

    for (const note of notes) {
      out.push({
        key: `notes:${note.id}`,
        kind: "notes",
        title: `${note.surah}:${note.ayah}`,
        subtitle: note.body.trim() || undefined,
        icon: ICONS.notes,
        at: time(note.updatedAt),
        href: {
          pathname: "/quran/[surah]",
          params: { surah: String(note.surah), ayah: String(note.ayah) },
        },
      });
    }

    // Recent first; undated favourites keep their store order after the dated ones.
    return out
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const at = a.item.at;
        const bt = b.item.at;
        if (at != null && bt != null) return bt - at;
        if (at != null) return -1;
        if (bt != null) return 1;
        return a.index - b.index;
      })
      .map(({ item }) => item);
  }, [quran, hadith, duas, zikrIds, zikrReady, duaIds, duroods, duroodIds, names, nameIds, notes]);

  return { items, loaded: hadithLoaded };
}
