import type { QuranTafsirEditionDef } from "@munib-tracker/shared/i18n";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EditionPickerSheet } from "@/components/quran/edition-picker-sheet";
import {
  getAllTafsirEditions,
  groupTafsirsByLanguage,
  languageForTafsirId,
} from "@/lib/quran-tafsir-options";

type TafsirPickerSheetProps = {
  visible: boolean;
  title: string;
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  allowNone?: boolean;
  preferredLanguages?: string[];
};

const ALL_TAFSIRS = getAllTafsirEditions();

const languageOf = (id: string) => languageForTafsirId(id, ALL_TAFSIRS);
const matchesEdition = (edition: QuranTafsirEditionDef, query: string) =>
  `${edition.name} ${edition.author}`.toLowerCase().includes(query);
const editionSubtitle = (edition: QuranTafsirEditionDef) => edition.author;

/** Qur'an tafsir picker (language → author), with a "None" row by default. */
export function TafsirPickerSheet({
  allowNone = true,
  preferredLanguages = [],
  ...sheet
}: TafsirPickerSheetProps) {
  const { t } = useTranslation();
  const groups = useMemo(
    () => groupTafsirsByLanguage(ALL_TAFSIRS, preferredLanguages),
    [preferredLanguages],
  );

  return (
    <EditionPickerSheet
      {...sheet}
      allowNone={allowNone}
      groups={groups}
      languageOf={languageOf}
      matchesEdition={matchesEdition}
      editionSubtitle={editionSubtitle}
      copy={{
        selectEdition: (language) => t("quran.selectTafsirAuthor", { language }),
        searchLanguages: t("quran.searchTafsirLanguages"),
        searchEditions: t("quran.searchTafsirAuthors"),
        editionCount: (count) => t("quran.tafsirCount", { count }),
        none: t("quran.tafsirNone"),
      }}
    />
  );
}
