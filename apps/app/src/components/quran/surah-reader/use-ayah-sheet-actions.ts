import { useMemo } from "react";
import type { AyahActionHandlers } from "@/components/quran/ayah-inline-actions";
import { runAfterSheetDismiss } from "@/lib/platform/run-after-sheet-dismiss";

/**
 * The ayah action sheet's (TV: Select on a card) handlers that leave the sheet:
 * the shared per-ayah `handlers` (`useAyahActions`), each closing the sheet
 * first, then opening the next surface — another sheet only after the dismiss
 * animation (`runAfterSheetDismiss`), a route immediately. Practise /
 * check-recitation stay `undefined` where the feature is unavailable.
 */
export function useAyahSheetActions({
  handlers,
  closeSheet,
}: {
  handlers: AyahActionHandlers;
  closeSheet: () => void;
}) {
  return useMemo(() => {
    const { onHifz, onTafsir, onPractise, onCheckRecitation, onNote, onHighlight } = handlers;
    return {
      onHifz: (ayahNum: number) => {
        closeSheet();
        runAfterSheetDismiss(() => onHifz(ayahNum));
      },
      onTafsir: (ayahNum: number) => {
        closeSheet();
        runAfterSheetDismiss(() => onTafsir(ayahNum));
      },
      onPractise: onPractise
        ? (ayahNum: number) => {
            closeSheet();
            onPractise(ayahNum);
          }
        : undefined,
      onCheckRecitation: onCheckRecitation
        ? (ayahNum: number) => {
            closeSheet();
            onCheckRecitation(ayahNum);
          }
        : undefined,
      onNote: (ayahNum: number, noteId?: string) => {
        closeSheet();
        runAfterSheetDismiss(() => onNote(ayahNum, noteId));
      },
      onHighlight: (ayahNum: number) => {
        closeSheet();
        runAfterSheetDismiss(() => onHighlight(ayahNum));
      },
    };
  }, [closeSheet, handlers]);
}
