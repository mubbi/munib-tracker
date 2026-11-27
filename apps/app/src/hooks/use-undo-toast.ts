import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { isTV } from "@/lib/platform/is-tv";
import { TOAST_ACTION_DURATION_MS, type ToastType, useToast } from "@/providers/toast-provider";

export type UndoToastAction = {
  /** Performs the change. A rejection propagates and no toast is shown. */
  do: () => unknown;
  /** Reverts it. Runs at most once per `run`. */
  undo: () => unknown;
  /** i18n key of the past-tense toast title ("Fajr marked"). */
  messageKey: string;
  messageOptions?: Record<string, unknown>;
  /** Toast tone (default `success`). */
  type?: ToastType;
};

type UndoToken = { undo: UndoToastAction["undo"]; open: boolean };

export type UndoToastController = {
  /** Performs `do`, then offers Undo (toast action on phone / web; `undoAvailable` on TV). */
  run: (action: UndoToastAction) => Promise<void>;
  /**
   * TV only: `true` while the latest change can still be undone — render an
   * in-row Undo control and call `undo()` from it (TV toasts carry no action).
   */
  undoAvailable: boolean;
  /** Undoes the latest change if it is still undoable; returns whether it ran. */
  undo: () => boolean;
};

/**
 * The one "act + toast with Undo" implementation (design-system § Dialogs:
 * cheap, reversible removals get no dialog). On phone / web the Undo lives in
 * the toast for `TOAST_ACTION_DURATION_MS` (until dismissed while a screen
 * reader is on — the provider owns that rule); once the toast is gone the
 * change can no longer be undone. On TV, where toasts take no focus, the undo
 * window is exposed as `undoAvailable` for the same duration.
 */
export function useUndoToast(): UndoToastController {
  const toast = useToast();
  const { t } = useTranslation();
  const [undoAvailable, setUndoAvailable] = useState(false);
  const latest = useRef<UndoToken | null>(null);
  const tvTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** The latest Undo toast — replaced by the next `run` (its Undo no longer applies — B-25). */
  const latestToastId = useRef<string | null>(null);

  const clearTvTimer = useCallback(() => {
    if (tvTimer.current) clearTimeout(tvTimer.current);
    tvTimer.current = null;
  }, []);

  useEffect(() => clearTvTimer, [clearTvTimer]);

  const expire = useCallback((token: UndoToken) => {
    token.open = false;
    if (latest.current === token) setUndoAvailable(false);
  }, []);

  const undoToken = useCallback(
    (token: UndoToken) => {
      if (!token.open) return false;
      expire(token);
      void token.undo();
      return true;
    },
    [expire],
  );

  const run = useCallback(
    async (action: UndoToastAction) => {
      await action.do();
      const token: UndoToken = { undo: action.undo, open: true };
      if (latest.current) expire(latest.current);
      latest.current = token;
      const title = t(action.messageKey, action.messageOptions ?? {});
      const type = action.type ?? "success";
      if (latestToastId.current) toast.dismiss(latestToastId.current);

      if (isTV()) {
        clearTvTimer();
        setUndoAvailable(true);
        tvTimer.current = setTimeout(() => expire(token), TOAST_ACTION_DURATION_MS);
        latestToastId.current = toast.show(title, { type });
        return;
      }

      latestToastId.current = toast.show(title, {
        type,
        action: { label: t("uiFeedback.undo"), onPress: () => undoToken(token) },
        onDismiss: () => expire(token),
      });
    },
    [t, toast, expire, undoToken, clearTvTimer],
  );

  const undo = useCallback(() => {
    const token = latest.current;
    if (!token) return false;
    if (isTV()) clearTvTimer();
    return undoToken(token);
  }, [undoToken, clearTvTimer]);

  return { run, undoAvailable, undo };
}
