import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/providers/toast-provider";

/**
 * Runs a change to a private record (debts, wasiyyah, relatives, muhasabah).
 * Vault store actions reject when the write fails (key store locked, storage
 * full); this turns that into the shared "Couldn't save" toast instead of an
 * unhandled promise rejection. Resolves `true` once the change is stored.
 *
 *   const run = useRecordAction();
 *   onPress={() => void run(debtsActions.reopen(id))}
 */
export function useRecordAction(): (task: Promise<unknown>) => Promise<boolean> {
  const { t } = useTranslation();
  const toast = useToast();
  return useCallback(
    (task: Promise<unknown>) =>
      task.then(
        () => true,
        () => {
          toast.error(t("common.saveFailed"));
          return false;
        },
      ),
    [t, toast],
  );
}
