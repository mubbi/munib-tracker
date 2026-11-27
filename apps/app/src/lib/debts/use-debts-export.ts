import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useRecordFormat } from "@/hooks/use-record-format";
import {
  type ExportDocumentOptions,
  exportPrintableDocument,
} from "@/lib/printable/export-document";
import { renderPrintableHtml } from "@/lib/printable/printable-html";

import type { DebtEntry } from "./debts";
import type { ObligationLine } from "./obligations";
import { buildDebtsStatement } from "./statement";

/**
 * Builds the debts & trusts statement and exports it: a PDF through the share
 * sheet on iOS/Android (D30), the browser print dialog on web.
 */
export function useDebtsStatementExport() {
  const { t } = useTranslation();
  const format = useRecordFormat();
  return useCallback(
    (
      input: { debts: readonly DebtEntry[]; obligations: readonly ObligationLine[]; today: string },
      options?: ExportDocumentOptions,
    ) => {
      const html = renderPrintableHtml(
        buildDebtsStatement(input, { t: (key, opts) => t(key, opts ?? {}), ...format }),
      );
      return exportPrintableDocument(
        html,
        `debts-${input.today}`,
        t("debts.statement.title"),
        options,
      );
    },
    [t, format],
  );
}
