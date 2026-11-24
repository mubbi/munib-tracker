import type { AyahNote } from "@munib-tracker/shared/types";
import {
  formatQuranNotesExport,
  isLiveNote,
  type QuranNotesExportFormat,
} from "@munib-tracker/shared/utils";
import { Platform, Share } from "react-native";

import i18n from "@/i18n";
import { getSurahByNumber } from "@/lib/quran-meta";

/**
 * Source of the bundled Arabic (see assets/data/manifest.json `quran-core`).
 * Proper-noun attribution — not translated; prefixed by a localised label.
 */
export const BUNDLED_ARABIC_SOURCE = "Tanzil.net (Uthmani), CC BY-SA 4.0";

export type QuranNotesExportRequest = {
  format: QuranNotesExportFormat;
  /** One surah, or every note when omitted. */
  surah?: number;
  includeAyahText: boolean;
};

/** Builds the export text. Ayah text is loaded from the bundled corpus on demand (never re-typed). */
export async function buildQuranNotesExport(
  notes: readonly AyahNote[],
  request: QuranNotesExportRequest,
): Promise<string> {
  const selected = notes.filter(
    (note) => isLiveNote(note) && (request.surah == null || note.surah === request.surah),
  );
  let ayahText: ((surah: number, ayah: number) => string | undefined) | undefined;
  if (request.includeAyahText) {
    // Dynamic import keeps multi-MB ayah JSON out of the notes list's first load.
    const { getSurahAyahs } = await import("@/lib/quran");
    ayahText = (surah, ayah) => getSurahAyahs(surah)[ayah - 1]?.arabic;
  }
  return formatQuranNotesExport(selected, {
    format: request.format,
    labels: {
      title:
        request.surah != null
          ? i18n.t("quranNotes.export.titleSurah", {
              surah: getSurahByNumber(request.surah)?.nameTransliteration ?? request.surah,
            })
          : i18n.t("quranNotes.export.titleAll"),
      myNote: i18n.t("quranNotes.myNote"),
      tags: i18n.t("quranNotes.tags"),
    },
    surahName: (surah) => getSurahByNumber(surah)?.nameTransliteration ?? String(surah),
    ayahText,
    credit: `${i18n.t("quranNotes.export.creditLabel")}: ${BUNDLED_ARABIC_SOURCE}`,
  });
}

export type ShareOutcome = "shared" | "copied" | "failed";

/** Hands the text to the share sheet (web: Web Share, else clipboard). */
export async function shareNotesText(text: string, title: string): Promise<ShareOutcome> {
  if (Platform.OS === "web") {
    const nav = typeof navigator !== "undefined" ? navigator : undefined;
    try {
      if (nav?.share) {
        await nav.share({ title, text });
        return "shared";
      }
    } catch {
      // cancelled / unsupported — fall through to the clipboard
    }
    try {
      await nav?.clipboard?.writeText(text);
      return "copied";
    } catch {
      return "failed";
    }
  }
  try {
    await Share.share({ message: text, title });
    return "shared";
  } catch {
    return "failed";
  }
}
