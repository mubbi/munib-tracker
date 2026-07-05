import type { HadithItem } from "@munib-tracker/shared/types";
import { useCallback, useEffect, useState } from "react";

import { HadithRepository } from "@/db";
import { useIsAyahBookmarked, useQuranActions } from "@/stores/quran-store";

/** Toggle Qur'an ayah bookmarks (synced with /quran/bookmarks). */
export function useQuranAyahBookmark(surah: number, ayah: number) {
  const bookmarked = useIsAyahBookmarked(surah, ayah);
  const { toggleBookmark } = useQuranActions();

  const toggle = useCallback(async () => {
    await toggleBookmark(surah, ayah);
  }, [surah, ayah, toggleBookmark]);

  return { bookmarked, toggle };
}

/** Toggle hadith bookmarks when a Jannah citation resolves to a reader id. */
export function useHadithCitationBookmark(
  target: Pick<HadithItem, "id" | "collection" | "number"> | null,
) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!target) {
      setBookmarked(false);
      return;
    }
    let active = true;
    void HadithRepository.isBookmarked(target.id).then((value) => {
      if (active) setBookmarked(value);
    });
    return () => {
      active = false;
    };
  }, [target]);

  const toggle = useCallback(async () => {
    if (!target) return;
    const added = await HadithRepository.toggleBookmark(target);
    setBookmarked(added);
  }, [target]);

  return { bookmarked, toggle, canBookmark: target != null };
}
