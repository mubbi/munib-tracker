import type { Ayah } from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { AyahActionSheet } from "@/components/quran/ayah-action-sheet";
import { buildContentReportRef } from "@/lib/content-report-ref";
import type { HifzStatus } from "@/stores/hifz-store";

/**
 * The ayah action sheet for ayah cards on TV: Select on a card opens it
 * (read-only notes, no share). Phones / web expand the same actions inline
 * under the card instead (`AyahInlineActions`); the sheet still accepts the
 * phone-only handlers for any surface that prefers it.
 */
export function AyahMoreActions({
  ayah,
  surahNumber,
  surahName,
  surahNameEnglish,
  locale,
  translation,
  isBookmarked,
  isPlaying,
  hifzStatus,
  onClose,
  onPlay,
  onBookmark,
  onHifz,
  onTafsir,
  onShare,
  isSharing,
  isGesturePending,
  onPractise,
  onCheckRecitation,
  onNote,
  onHighlight,
}: {
  ayah?: Ayah;
  surahNumber: number;
  surahName: string;
  surahNameEnglish: string;
  locale: string;
  translation: Record<string, string>;
  isBookmarked: boolean;
  isPlaying: boolean;
  hifzStatus?: HifzStatus;
  onClose: () => void;
  onPlay: () => void;
  onBookmark: (ayah: number) => void;
  onHifz: (ayah: number) => void;
  onTafsir: (ayah: number) => void;
  /** Omit on TV (no system share sheet). */
  onShare?: (ayah: Ayah) => void;
  isSharing?: boolean;
  isGesturePending?: boolean;
  onPractise?: (ayah: number) => void;
  onCheckRecitation?: (ayah: number) => void;
  /** Omit on TV (notes are read-only there). */
  onNote?: (ayah: number, noteId?: string) => void;
  onHighlight?: (ayah: number) => void;
}) {
  const ayahNum = ayah?.ayah ?? 1;
  const reportRef = useMemo(
    () =>
      ayah
        ? buildContentReportRef(
            "quran_ayah",
            String(ayah.ayah),
            `/quran/${surahNumber}?ayah=${ayah.ayah}`,
            locale,
            {
              parentId: String(surahNumber),
              snapshot: {
                arabic: ayah.arabic,
                translation: translation[String(ayah.ayah)] ?? "",
                reference: `${surahNumber}:${ayah.ayah}`,
              },
            },
          )
        : undefined,
    [ayah, locale, surahNumber, translation],
  );
  return (
    <AyahActionSheet
      visible={ayah != null}
      surah={surahNumber}
      ayah={ayahNum}
      surahName={surahName}
      surahNameEnglish={surahNameEnglish}
      juz={ayah?.juz}
      isBookmarked={isBookmarked}
      isPlaying={isPlaying}
      hifzStatus={hifzStatus}
      onPlay={onPlay}
      onBookmark={() => onBookmark(ayahNum)}
      onHifz={() => onHifz(ayahNum)}
      onTafsir={() => onTafsir(ayahNum)}
      // The sheet hides Share on TV (no system share sheet); keep the prop satisfied there.
      onShare={() => (onShare && ayah ? onShare(ayah) : onClose())}
      isSharing={isSharing}
      isGesturePending={isGesturePending}
      onPractise={onPractise ? () => onPractise(ayahNum) : undefined}
      onCheckRecitation={onCheckRecitation ? () => onCheckRecitation(ayahNum) : undefined}
      onNote={onNote ? (noteId) => onNote(ayahNum, noteId) : undefined}
      onHighlight={onHighlight ? () => onHighlight(ayahNum) : undefined}
      reportRef={reportRef}
      onClose={onClose}
    />
  );
}
