import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { AyahActionHandlers } from "@/components/quran/ayah-inline-actions";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { isPronunciationCheckPlatformAvailable } from "@/lib/quran-pronunciation/availability";
import { pronunciationCheckHref } from "@/lib/quran-pronunciation/entry";
import type { HifzStatus } from "@/stores/hifz-store";
import { openQuranNoteEditor } from "@/stores/quran-notes-store";
import { useHifzConfirm } from "./use-hifz-confirm";

/** One-ayah practice session opened from an ayah card. */
export function ayahPractiseHref(surah: number, ayah: number) {
  return {
    pathname: "/quran/practice/session",
    params: { surah: String(surah), from: String(ayah), to: String(ayah), source: "reader" },
  } as const;
}

/**
 * The per-ayah action wiring every ayah-card screen shares (surah reader,
 * focused passage, Adhkar Qur'an cards): tafsir, hifz confirm, note /
 * highlight editor, practise / check-recitation routes, plus which ayah's
 * inline "More" row is open — one at a time, lifted to the screen so it
 * survives list recycling. `handlers` and `toggleExpanded` are stable.
 *
 * The caller owns the tafsir surface (`openTafsir`) and mounts the hifz
 * `ConfirmDialog` from `hifz.dialog` (see `AyahHifzConfirm`).
 */
export function useAyahActions({
  surahNumber,
  surahName,
  hifzMap,
  openTafsir,
}: {
  surahNumber: number;
  surahName: string | undefined;
  hifzMap: Record<string, HifzStatus>;
  openTafsir: (ayah: number) => void;
}) {
  const { i18n } = useTranslation();
  const locale = i18n.language?.split("-")[0] ?? "en";
  const router = useRouter();
  const hifz = useHifzConfirm({ surahName, hifzMap });
  const { requestHifz } = hifz;
  const practiceAvailable = isPracticeAvailable();
  const checkAvailable = practiceAvailable && isPronunciationCheckPlatformAvailable();

  const [expandedAyah, setExpandedAyah] = useState<number | null>(null);
  /** "More" ↔ "Less": opening one ayah's row closes the previous one. */
  const toggleExpanded = useCallback((ayah: number) => {
    setExpandedAyah((current) => (current === ayah ? null : ayah));
  }, []);
  const collapse = useCallback(() => setExpandedAyah(null), []);

  const handlers = useMemo<AyahActionHandlers>(
    () => ({
      surahNumber,
      locale,
      onTafsir: openTafsir,
      onHifz: (ayah) => requestHifz(surahNumber, ayah),
      onPractise: practiceAvailable
        ? (ayah) => router.push(ayahPractiseHref(surahNumber, ayah))
        : undefined,
      onCheckRecitation: checkAvailable
        ? (ayah) => router.push(pronunciationCheckHref(surahNumber, ayah, ayah, "reader"))
        : undefined,
      onNote: (ayah, noteId) =>
        openQuranNoteEditor({ mode: "note", surah: surahNumber, ayah, noteId }),
      onHighlight: (ayah) => openQuranNoteEditor({ mode: "highlight", surah: surahNumber, ayah }),
    }),
    [checkAvailable, locale, openTafsir, practiceAvailable, requestHifz, router, surahNumber],
  );

  return { handlers, expandedAyah, toggleExpanded, collapse, hifz };
}
