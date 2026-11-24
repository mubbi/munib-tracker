/**
 * Shared by both Qur'an readers — ayah-by-ayah (`app/quran/[surah].tsx`) and
 * page / mushaf (`app/quran/page/[page].tsx`): picker options, the bookmarked
 * ayah lookup, and the desktop-web keyboard map.
 */
import type { QuranReaderLayout } from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { isWebInteractiveTarget, useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import { isTV } from "@/lib/platform/is-tv";
import { RECITERS } from "@/lib/quran-audio";
import { useQuranBookmarks } from "@/stores/quran-store";

export const RECITER_OPTIONS = RECITERS.map((r) => ({ id: r.dir, label: r.name }));

const LAYOUT_OPTIONS: Array<{ id: QuranReaderLayout; labelKey: string }> = [
  { id: "page", labelKey: "quran.layoutPage" },
  { id: "mushaf", labelKey: "quran.layoutMushaf" },
  { id: "ayah", labelKey: "quran.layoutAyah" },
];

/** Reader-layout picker options (page / mushaf / ayah), translated. */
export function useReaderLayoutOptions(): Array<{ id: QuranReaderLayout; label: string }> {
  const { t } = useTranslation();
  return useMemo(() => LAYOUT_OPTIONS.map((o) => ({ id: o.id, label: t(o.labelKey) })), [t]);
}

/** `surah:ayah` keys of every bookmarked ayah (new Set only when bookmarks change). */
export function useBookmarkedAyahSet(): ReadonlySet<string> {
  const bookmarks = useQuranBookmarks();
  return useMemo(() => new Set(bookmarks.map((b) => `${b.surah}:${b.ayah}`)), [bookmarks]);
}

export type ReaderKeyAction = "ArrowLeft" | "ArrowRight" | "Space";

/**
 * Reader shortcut for a keydown, or `null` to let the page have it: Shift+arrow
 * (text selection) and arrows on a slider stay native, and Space on a focused
 * control (button, link, switch…) activates that control instead.
 */
export function readerKeyAction(
  event: Pick<KeyboardEvent, "key" | "shiftKey" | "target">,
): ReaderKeyAction | null {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    if (event.shiftKey) return null;
    if ((event.target as HTMLElement | null)?.getAttribute?.("role") === "slider") return null;
    return event.key;
  }
  if (event.key === " ") return isWebInteractiveTarget(event.target) ? null : "Space";
  return null;
}

/**
 * Desktop web: ←/→ turn (surah or page), Space play/pause. Never on native / TV.
 * `enabled` should be false while a sheet is open; the shortcut is also off while
 * typing and when this route is not the focused screen (stack screens stay
 * mounted on web) — both handled by {@link useWebScreenKeyHandler}.
 */
export function useReaderWebKeys(
  handlers: { onArrow: (key: "ArrowLeft" | "ArrowRight") => void; onSpace: () => void },
  enabled: boolean,
) {
  useWebScreenKeyHandler(
    (event) => {
      const action = readerKeyAction(event);
      if (action == null) return undefined;
      if (action === "Space") handlers.onSpace();
      else handlers.onArrow(action);
      return true;
    },
    Platform.OS === "web" && !isTV() && enabled,
  );
}
