import type { QuranEdition } from "@munib-tracker/shared/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EditionPickerSheet } from "@/components/quran/edition-picker-sheet";
import {
  getAllQuranTranslations,
  groupTranslationsByLanguage,
  languageForEditionId,
} from "@/lib/quran-translation-options";

type TranslationPickerSheetProps = {
  visible: boolean;
  title: string;
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  /** When true, show a "None" row at the top of the language list (second translation). */
  allowNone?: boolean;
  /** Bias language ordering — typically `translationLocale` and app `locale`. */
  preferredLanguages?: string[];
};

const ALL_TRANSLATIONS = getAllQuranTranslations();

const languageOf = (id: string) => languageForEditionId(id, ALL_TRANSLATIONS);
const matchesEdition = (edition: QuranEdition, query: string) =>
  edition.name.toLowerCase().includes(query);

/** Qur'an translation picker (language → translator). */
export function TranslationPickerSheet({
  allowNone = false,
  preferredLanguages = [],
  ...sheet
}: TranslationPickerSheetProps) {
  const { t } = useTranslation();
  const groups = useMemo(
    () => groupTranslationsByLanguage(ALL_TRANSLATIONS, preferredLanguages),
    [preferredLanguages],
  );

  return (
    <EditionPickerSheet
      {...sheet}
      allowNone={allowNone}
      groups={groups}
      languageOf={languageOf}
      matchesEdition={matchesEdition}
      editionSubtitle={(edition) =>
        edition.bundled ? t("quran.translationBundled") : t("quran.translationRemote")
      }
      copy={{
        selectEdition: (language) => t("quran.selectTranslator", { language }),
        searchLanguages: t("quran.searchTranslationLanguages"),
        searchEditions: t("quran.searchTranslators"),
        editionCount: (count) => t("quran.translationCount", { count }),
        none: t("quran.secondTranslationNone"),
      }}
    />
  );
}
