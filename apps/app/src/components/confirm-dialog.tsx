import { type ComponentProps, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet } from "@/components/ui/sheet";
import { TextField } from "@/components/ui/text-field";
import { Spacing } from "@/constants/theme";
import { isTV } from "@/lib/platform/is-tv";

type ConfirmDialogProps = {
  visible: boolean;
  /** `{Verb} {object}?` — rendered as the dialog heading and its accessible name. */
  title: string;
  /** What is lost and where (destructive) or what happens next. */
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Irreversible action: the confirm button uses the AA danger fill. */
  destructive?: boolean;
  /**
   * Runs on confirm. A plain function closes the dialog right away. When it
   * returns a promise the dialog stays open with the confirm button `loading`
   * (cancel, scrim and Back are blocked) until it settles: it closes on
   * success and shows an inline error `Callout` on rejection.
   */
  onConfirm: () => unknown;
  /** Cancel button; defaults to `onClose` when omitted. */
  onCancel?: () => void;
  /** Backdrop dismiss — does not run when the cancel button is pressed. */
  onClose: () => void;
  /**
   * Work driven from outside (e.g. a mutation's `isPending`): shows the confirm
   * button as loading and keeps the dialog from being dismissed.
   */
  busy?: boolean;
  /**
   * Whole-device / account actions: an "I understand…" check box that must be
   * ticked before the confirm button enables.
   */
  acknowledgeLabel?: string;
  /**
   * A word the user must type before the confirm button enables (account
   * deletion keeps typed "DELETE" — D-UX6). Compared after trimming.
   */
  confirmWord?: string;
  /** Overrides the "Type {{word}} to confirm" field label. */
  confirmWordLabel?: string;
  /** Inline error shown when an async `onConfirm` rejects. Defaults to a generic retry line. */
  errorMessage?: string;
  /**
   * Control to focus after closing. Optional: the sheet already returns focus
   * to the control that opened it (web keyboard and TV D-pad).
   */
  returnFocusRef?: ComponentProps<typeof Sheet>["returnFocusRef"];
};

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    value != null &&
    (typeof value === "object" || typeof value === "function") &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

/** A themed, cross-platform confirmation dialog (React Native Alert is flaky on web). */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  onCancel,
  onClose,
  busy = false,
  acknowledgeLabel,
  confirmWord,
  confirmWordLabel,
  errorMessage,
  returnFocusRef,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const tv = isTV();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [typed, setTyped] = useState("");
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Every opening starts clean: unticked, empty field, no stale error.
  useEffect(() => {
    if (!visible) return;
    setAcknowledged(false);
    setTyped("");
    setFailed(false);
    setPending(false);
  }, [visible]);

  const working = busy || pending;
  const confirmBlocked =
    (acknowledgeLabel != null && !acknowledged) ||
    (confirmWord != null && typed.trim() !== confirmWord);

  const guardedClose = () => {
    if (!working) onClose();
  };

  const handleConfirm = () => {
    if (working || confirmBlocked) return;
    setFailed(false);
    let result: unknown;
    try {
      result = onConfirm();
    } catch (error) {
      // Show the inline failure, but keep the error visible to the global
      // handler / Sentry exactly as before.
      setFailed(true);
      throw error;
    }
    if (!isPromiseLike(result)) {
      onClose();
      return;
    }
    setPending(true);
    Promise.resolve(result).then(
      () => {
        if (!mounted.current) return;
        setPending(false);
        onClose();
      },
      () => {
        if (!mounted.current) return;
        setPending(false);
        setFailed(true);
      },
    );
  };

  return (
    <Sheet
      visible={visible}
      onClose={guardedClose}
      accessibilityLabel={title}
      returnFocusRef={returnFocusRef}
    >
      <ThemedText type="subtitle" heading={2}>
        {title}
      </ThemedText>
      {message ? (
        <ThemedText type="small" themeColor="mutedForeground">
          {message}
        </ThemedText>
      ) : null}
      {acknowledgeLabel != null ? (
        <Checkbox
          label={acknowledgeLabel}
          checked={acknowledged}
          onChange={setAcknowledged}
          disabled={working}
        />
      ) : null}
      {confirmWord != null ? (
        <TextField
          label={confirmWordLabel ?? t("uiFeedback.typeToConfirm", { word: confirmWord })}
          value={typed}
          onChangeText={setTyped}
          disabled={working}
          autoCapitalize="characters"
          autoCorrect={false}
          autoComplete="off"
          spellCheck={false}
          placeholder={confirmWord}
        />
      ) : null}
      {failed ? (
        <Callout tone="danger">{errorMessage ?? t("uiFeedback.actionFailed")}</Callout>
      ) : null}
      <View style={styles.actions}>
        <Button
          label={cancelLabel ?? t("common.cancel")}
          variant="ghost"
          fullWidth
          // TV + destructive confirms: Cancel takes the initial D-pad focus.
          preferredFocus
          // TV: a disabled button cannot hold D-pad focus, so while work runs
          // Cancel stays focusable and ignores presses instead (focus is never
          // dropped when `busy` starts with Cancel focused).
          disabled={working && !tv}
          onPress={() => {
            if (!working) (onCancel ?? onClose)();
          }}
        />
        <Button
          label={confirmLabel ?? t("common.confirm")}
          variant={destructive ? "destructive" : "primary"}
          fullWidth
          loading={working}
          disabled={confirmBlocked}
          onPress={handleConfirm}
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
});
