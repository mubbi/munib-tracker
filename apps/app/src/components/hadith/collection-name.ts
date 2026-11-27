import { useCallback } from "react";
import { useTranslation } from "react-i18next";

type NamedCollection = { id: string; nameEnglish: string; nameArabic: string };

/**
 * Localised hadith collection name (C-19): Arabic locales show the Arabic
 * title, every other locale reads `hadith.collection.<id>` and falls back to the
 * dataset's English name for a collection the catalog does not know yet.
 */
export function useCollectionName(): (collection: NamedCollection) => string {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  return useCallback(
    (collection) => {
      if (language.split("-")[0] === "ar" && collection.nameArabic) return collection.nameArabic;
      const key = `hadith.collection.${collection.id}`;
      return i18n.exists(key) ? t(key) : collection.nameEnglish;
    },
    [i18n, language, t],
  );
}
