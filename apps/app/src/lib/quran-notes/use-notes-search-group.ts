import { formatNoteRef } from "@munib-tracker/shared/utils";
import { useMemo } from "react";

import { getSurahByNumber } from "@/lib/quran-meta";
import type { SearchGroup } from "@/lib/search-types";
import { useEnsureQuranNotesLoaded, useQuranNotesIndex } from "@/stores/quran-notes-store";

import { createQuranNotesSearch } from "./notes-search";

const GROUP_LIMIT = 20;

/**
 * Universal search "My notes" group (NF-3.21). Built from the in-memory notes
 * store on this device — the query and the note text never leave it.
 */
export function useQuranNotesSearchGroup(query: string): SearchGroup | null {
  useEnsureQuranNotesLoaded();
  const { live } = useQuranNotesIndex();
  const index = useMemo(() => (live.length ? createQuranNotesSearch(live) : null), [live]);
  return useMemo(() => {
    const q = query.trim();
    if (!q || !index) return null;
    const hits = index.search(q);
    if (!hits.length) return null;
    return {
      category: "notes",
      total: hits.length,
      results: hits.slice(0, GROUP_LIMIT).map((note) => ({
        key: `notes:${note.id}`,
        category: "notes",
        title: note.body.trim() ? note.body.trim().slice(0, 140) : `#${note.tags.join(" #")}`,
        subtitle: getSurahByNumber(note.surah)?.nameTransliteration,
        badge: formatNoteRef(note),
        href: "/quran/[surah]",
        params: { surah: String(note.surah), ayah: String(note.ayah) },
      })),
    };
  }, [index, query]);
}
