import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/providers/toast-provider";

/**
 * `run(fn, okKey?)` for circles actions: success toast (when `okKey` is given),
 * or the generic offline toast on any failure. Never throws.
 */
export function useCircleRun(): (fn: () => Promise<unknown>, okKey?: string) => Promise<void> {
  const { t } = useTranslation();
  const toast = useToast();
  return useCallback(
    async (fn, okKey) => {
      try {
        await fn();
        if (okKey) toast.success(t(okKey));
      } catch {
        toast.error(t("circles.common.offline"));
      }
    },
    [t, toast],
  );
}
