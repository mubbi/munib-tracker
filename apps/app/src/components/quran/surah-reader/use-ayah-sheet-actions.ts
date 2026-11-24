import { useRouter } from "expo-router";
import { runAfterSheetDismiss } from "@/lib/platform/run-after-sheet-dismiss";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { isPronunciationCheckPlatformAvailable } from "@/lib/quran-pronunciation/availability";
import { pronunciationCheckHref } from "@/lib/quran-pronunciation/entry";
import { openQuranNoteEditor } from "@/stores/quran-notes-store";

/**
 * Handlers for the surah reader's ayah "More" sheet that leave the sheet: each
 * closes it first, then opens the next surface — another sheet only after the
 * dismiss animation (`runAfterSheetDismiss`), a route immediately. Practise /
 * check-recitation are `undefined` where the feature is unavailable.
 */
export function useAyahSheetActions({
  surahNumber,
  closeSheet,
  requestHifz,
  openTafsir,
}: {
  surahNumber: number;
  closeSheet: () => void;
  requestHifz: (surah: number, ayah: number) => void;
  openTafsir: (ayah: number) => void;
}) {
  const router = useRouter();
  const practiceAvailable = isPracticeAvailable();
  return {
    onHifz: (ayahNum: number) => {
      closeSheet();
      runAfterSheetDismiss(() => requestHifz(surahNumber, ayahNum));
    },
    onTafsir: (ayahNum: number) => {
      closeSheet();
      runAfterSheetDismiss(() => openTafsir(ayahNum));
    },
    onPractise: practiceAvailable
      ? (ayahNum: number) => {
          closeSheet();
          router.push({
            pathname: "/quran/practice/session",
            params: {
              surah: String(surahNumber),
              from: String(ayahNum),
              to: String(ayahNum),
              source: "reader",
            },
          });
        }
      : undefined,
    onCheckRecitation:
      practiceAvailable && isPronunciationCheckPlatformAvailable()
        ? (ayahNum: number) => {
            closeSheet();
            router.push(pronunciationCheckHref(surahNumber, ayahNum, ayahNum, "reader"));
          }
        : undefined,
    onNote: (ayahNum: number, noteId?: string) => {
      closeSheet();
      runAfterSheetDismiss(() =>
        openQuranNoteEditor({ mode: "note", surah: surahNumber, ayah: ayahNum, noteId }),
      );
    },
    onHighlight: (ayahNum: number) => {
      closeSheet();
      runAfterSheetDismiss(() =>
        openQuranNoteEditor({ mode: "highlight", surah: surahNumber, ayah: ayahNum }),
      );
    },
  };
}
