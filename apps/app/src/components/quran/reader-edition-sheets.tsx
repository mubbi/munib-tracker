import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TafsirPickerSheet } from "@/components/quran/tafsir-picker-sheet";
import { TranslationPickerSheet } from "@/components/quran/translation-picker-sheet";
import { updateQuranPrefs } from "@/lib/settings/quran-shortcuts";
import { usePreferences } from "@/stores/preferences-store";

/** Which edition picker a Qur'an reader has open. */
export type ReaderEditionSheet = "translation" | "secondary" | "tafsir";

type ReaderEditionSheetsProps = {
  open: ReaderEditionSheet | null;
  onClose: () => void;
  /** Primary translation edition id. */
  translationId: string;
  /** Second translation id (`undefined` = none). */
  secondaryId: string | undefined;
  /** Active tafsir id (`undefined` = none). */
  tafsirId: string | undefined;
};

/**
 * The translation / second translation / tafsir pickers shared by the surah and
 * mushaf-page readers. Languages are biased to the reader's translation language
 * and the app language; choices are written through the settings shortcuts.
 */
export function ReaderEditionSheets({
  open,
  onClose,
  translationId,
  secondaryId,
  tafsirId,
}: ReaderEditionSheetsProps) {
  const { t } = useTranslation();
  const { translationLocale, locale: appLocale } = usePreferences();
  const preferredLanguages = useMemo(
    () => [translationLocale, appLocale],
    [translationLocale, appLocale],
  );

  return (
    <>
      <TranslationPickerSheet
        visible={open === "translation"}
        title={t("quran.translation")}
        selectedId={translationId}
        preferredLanguages={preferredLanguages}
        onSelect={(id) => updateQuranPrefs({ preferredTranslationIds: [id] })}
        onClose={onClose}
      />
      <TranslationPickerSheet
        visible={open === "secondary"}
        title={t("quran.secondTranslation")}
        allowNone
        selectedId={secondaryId ?? ""}
        preferredLanguages={preferredLanguages}
        onSelect={(id) => updateQuranPrefs({ secondaryTranslationId: id || undefined })}
        onClose={onClose}
      />
      <TafsirPickerSheet
        visible={open === "tafsir"}
        title={t("quran.tafsir")}
        allowNone
        selectedId={tafsirId ?? ""}
        preferredLanguages={preferredLanguages}
        onSelect={(id) => updateQuranPrefs({ preferredTafsirId: id })}
        onClose={onClose}
      />
    </>
  );
}
