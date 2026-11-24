import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { ExportDocumentResult } from "@/lib/printable/export-document-types";
import { useToast } from "@/providers/toast-provider";

/**
 * Runs a printable export (wasiyyah, debts statement) with feedback: one export
 * at a time (rendering a PDF takes a moment, so a second tap is ignored), a
 * toast when this device can't share or print, and a toast instead of a silent
 * failure when rendering throws.
 */
export function useExportFeedback() {
  const { t } = useTranslation();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const running = useRef(false);

  const run = useCallback(
    async (task: () => Promise<ExportDocumentResult>): Promise<void> => {
      if (running.current) return;
      running.current = true;
      setBusy(true);
      try {
        if ((await task()) === "unavailable") toast.info(t("privateUx.export.unavailable"));
      } catch {
        toast.error(t("privateUx.export.failed"));
      } finally {
        running.current = false;
        setBusy(false);
      }
    },
    [t, toast],
  );

  return { run, busy };
}
