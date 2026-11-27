import { SymbolView } from "expo-symbols";
import { type ReactNode, useEffect, useId, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { BorderWidth, Control, IconSize, Opacity, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";

/** Props every field in the family shares (label above, helper, error, counter). */
export type FieldChromeProps = {
  /** Visible label above the field. Never placeholder-only. */
  label: string;
  /** `footnote` helper under the field; replaced by `error` while one is set. */
  helperText?: string;
  /** Says what to enter. Drives the error surface, the alert row and the announcement. */
  error?: string;
  /** Marks the field required for assistive tech (`aria-required`). */
  required?: boolean;
  /** Shows a quiet "Optional" tag beside the label. */
  optional?: boolean;
  disabled?: boolean;
};

/** Ids + a11y props that tie an input to its helper / error text. */
export function useFieldA11y({
  label,
  helperText,
  error,
  required,
  disabled,
  hasCounter,
}: Pick<FieldChromeProps, "label" | "helperText" | "error" | "required" | "disabled"> & {
  hasCounter?: boolean;
}) {
  const base = useId();
  const inputId = `${base}-input`;
  const messageId = `${base}-message`;
  const counterId = `${base}-counter`;
  const describedBy = [error || helperText ? messageId : null, hasCounter ? counterId : null]
    .filter(Boolean)
    .join(" ");
  const web = Platform.OS === "web";
  const inputA11y = {
    accessibilityLabel: label,
    // Native reads the helper as the hint; the error is announced via the live region instead.
    accessibilityHint: error ? undefined : helperText,
    accessibilityState: { disabled: Boolean(disabled) },
    ...(web
      ? ({
          id: inputId,
          "aria-invalid": error ? true : undefined,
          "aria-required": required ? true : undefined,
          "aria-describedby": describedBy || undefined,
        } as const)
      : null),
  };
  return { inputId, messageId, counterId, inputA11y };
}

/** Surface style for the field row: normal / focused / error (+ thick focus ring). */
export function useFieldSurface({ focused, error }: { focused: boolean; error?: string }) {
  const { tokens } = useThemeTokens();
  const surface = error
    ? tokens.inputSurfaceError
    : focused
      ? tokens.inputSurfaceFocused
      : tokens.inputSurface;
  return { ...surface, borderWidth: focused || error ? BorderWidth.thick : BorderWidth.thin };
}

/** The row that holds leading slot / input / trailing slot. */
export const fieldRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    minHeight: isTV() ? TvLayout.minFocusTarget : Control.field,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  rowMultiline: { alignItems: "flex-start", paddingVertical: Spacing.two },
  disabled: { opacity: Opacity.disabled },
});

/**
 * Label above, content (the field row), then the helper / error row and the counter.
 * The message container is always mounted so screen readers see the live region
 * change (a region inserted together with its text is often not announced).
 */
export function FieldShell({
  label,
  helperText,
  error,
  optional,
  required,
  counter,
  messageId,
  counterId,
  inputId,
  children,
}: FieldChromeProps & {
  counter?: { current: number; max: number };
  messageId: string;
  counterId: string;
  inputId?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const web = Platform.OS === "web";
  const lastAnnounced = useRef<string | undefined>(undefined);

  // iOS ignores `accessibilityLiveRegion`; speak the new error explicitly.
  useEffect(() => {
    if (error && error !== lastAnnounced.current && Platform.OS === "ios") {
      AccessibilityInfo.announceForAccessibility(`${t("uiField.errorPrefix")}: ${error}`);
    }
    lastAnnounced.current = error;
  }, [error, t]);

  const overLimit = counter ? counter.current > counter.max : false;

  return (
    <View style={styles.block}>
      <View style={styles.labelRow}>
        <ThemedText
          type="label"
          {...(web && inputId ? ({ role: "none", "aria-hidden": true } as const) : null)}
        >
          {label}
          {required ? " *" : ""}
        </ThemedText>
        {optional && !required ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("uiField.optional")}
          </ThemedText>
        ) : null}
      </View>
      {children}
      <View style={styles.messageRow}>
        <View
          nativeID={messageId}
          accessibilityLiveRegion="polite"
          accessible={error ? true : undefined}
          accessibilityRole={error ? "alert" : undefined}
          {...(web
            ? ({ role: error ? "alert" : undefined, "aria-live": "polite" } as const)
            : null)}
          style={styles.message}
        >
          {error ? (
            <View style={styles.errorLine}>
              <SymbolView
                name={{ ios: "exclamationmark.circle.fill", android: "error", web: "error" }}
                size={IconSize.md}
                tintColor={tokens.status.danger.text}
              />
              <ThemedText
                type="footnote"
                style={[styles.messageText, { color: tokens.status.danger.text }]}
              >
                {error}
              </ThemedText>
            </View>
          ) : helperText ? (
            <ThemedText type="footnote" themeColor="mutedForeground">
              {helperText}
            </ThemedText>
          ) : null}
        </View>
        {counter ? (
          <ThemedText
            type="caption"
            nativeID={counterId}
            accessibilityLabel={t("uiField.counter", {
              current: counter.current,
              max: counter.max,
            })}
            style={overLimit ? { color: tokens.status.danger.text } : undefined}
            themeColor={overLimit ? undefined : "mutedForeground"}
          >
            {counter.current}/{counter.max}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.one },
  labelRow: { flexDirection: "row", alignItems: "baseline", gap: Spacing.two },
  messageRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.two },
  message: { flex: 1, minWidth: 0 },
  errorLine: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.one },
  messageText: { flex: 1 },
});
