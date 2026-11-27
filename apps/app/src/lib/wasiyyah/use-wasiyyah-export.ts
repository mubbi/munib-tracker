import { SALAH_GUIDE_PHRASES } from "@munib-tracker/shared/content/salah-guide-phrases";
import type { WasiyyahData } from "@munib-tracker/shared/types";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useMadhhabFor } from "@/hooks/use-madhhab";
import { useRecordFormat } from "@/hooks/use-record-format";
import i18n from "@/i18n";
import {
  type ExportDocumentOptions,
  exportPrintableDocument,
} from "@/lib/printable/export-document";
import { renderPrintableHtml } from "@/lib/printable/printable-html";

import { buildWasiyyahDocument, type ShahadahText } from "./document";
import { computeWasiyyah } from "./wasiyyah";

/**
 * Section 1's declaration of faith, rendered from the dataset (never typed):
 * the shahadah phrase in `SALAH_GUIDE_PHRASES` (`wudu-dua`, Sahih Muslim 234).
 */
export function wasiyyahShahadah(): ShahadahText {
  const phrase = SALAH_GUIDE_PHRASES.find((p) => p.id === "wudu-dua");
  return {
    arabic: phrase?.arabic ?? "",
    transliteration: phrase?.transliteration ?? "",
    translation: phrase?.translation ?? "",
    reference: phrase?.reference ?? "",
  };
}

/**
 * Builds the printable wasiyyah for `data` and exports it: a PDF through the
 * share sheet on iOS/Android, or the system print dialog with `{ mode: "print" }`
 * (D30); the browser print dialog on web.
 */
export function useWasiyyahExport() {
  const { t } = useTranslation();
  const format = useRecordFormat();
  const school = useMadhhabFor("inheritance");
  return useCallback(
    async (data: WasiyyahData, options?: ExportDocumentOptions) => {
      const computation = computeWasiyyah(data, school);
      const tEn = format.lang === "en" ? undefined : i18n.getFixedT("en");
      const doc = buildWasiyyahDocument(data, computation, {
        t: (key, options) => t(key, options ?? {}),
        ...(tEn ? { tEn: (key, options) => tEn(key, options ?? {}) } : {}),
        lang: format.lang,
        dir: format.dir,
        money: format.money,
        formatDate: format.formatDate,
        shahadah: wasiyyahShahadah(),
        heirLabel: (heir) => t(`heirs.${heir}`),
      });
      return exportPrintableDocument(
        renderPrintableHtml(doc),
        `wasiyyah-${data.testator.date}`,
        t("wasiyyah.doc.title"),
        options,
      );
    },
    [t, format, school],
  );
}
