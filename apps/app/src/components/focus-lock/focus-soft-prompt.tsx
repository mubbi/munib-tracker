import type { FocusLockUnlockMode } from "@munib-tracker/shared/types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type AccessibilityActionEvent, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Sheet } from "@/components/ui/sheet";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { asTranslate, windowPrayerLabel } from "@/lib/focus-lock/payload";
import type { FocusWindow } from "@/lib/focus-lock/plan";
import { GENTLE_HOLD_MS } from "@/lib/focus-lock/prefs";
import { canUnlock, type FocusUnlockAction } from "@/lib/focus-lock/state";
import { formatPrayerTime } from "@/lib/prayer-times";
import { usePreferences } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

/**
 * Soft in-app prompt (D17 / web): shown while a focus window runs and the OS
 * can't block apps. Same unlock rules as the shield — marking the salah ends
 * it, a 10 s hold works in gentle mode, emergency unlocks are counted.
 */
export function FocusSoftPrompt({
  window,
  mode,
  emergencyLeft,
  onUnlock,
  onDismiss,
}: {
  window: FocusWindow;
  mode: FocusLockUnlockMode;
  emergencyLeft: number;
  onUnlock: (action: FocusUnlockAction) => void;
  /** The soft prompt can never trap the user in our own app: "Not now" hides it for this window. */
  onDismiss: () => void;
}) {
  const { t } = useTranslation();
  const { timeFormat } = usePreferences();
  const name = windowPrayerLabel(window.prayers, asTranslate(t));
  const endsAt = formatPrayerTime(window.end, timeFormat);

  const markPrayed = async () => {
    const status = trackerStore.getState().prayerStatus;
    const fard = window.prayers
      .map((p) => (p === "jumuah" ? "dhuhr" : p))
      .find((p) => status[p] !== "completed");
    if (fard) await trackerStore.getState().setPrayerStatus(fard, "completed");
    onUnlock("markedPrayed");
  };

  return (
    <Sheet
      accessibilityLabel={t("focusLock.shield.title", { prayer: name })}
      visible
      variant="center"
      onClose={onDismiss}
    >
      <View style={styles.body} accessibilityRole="alert">
        <ThemedText type="subtitle">{t("focusLock.shield.title", { prayer: name })}</ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("focusLock.soft.body", { time: endsAt })}
        </ThemedText>
        <Button
          label={t("focusLock.soft.markPrayed")}
          onPress={() => void markPrayed()}
          fullWidth
        />
        {canUnlock(mode, "holdPrayNow", emergencyLeft) ? (
          <HoldToUnlock onUnlock={() => onUnlock("holdPrayNow")} />
        ) : null}
        {canUnlock(mode, "emergency", emergencyLeft) ? (
          <Button
            variant="ghost"
            size="sm"
            label={t("focusLock.shield.emergency", { count: emergencyLeft })}
            onPress={() => onUnlock("emergency")}
          />
        ) : null}
        <Button variant="ghost" size="sm" label={t("focusLock.soft.notNow")} onPress={onDismiss} />
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("focusLock.soft.note")}
        </ThemedText>
      </View>
    </Sheet>
  );
}

/** Progress (0–1) of a press-and-hold that started at `startedAt`. */
export function holdProgress(startedAt: number | null, now: number, holdMs = GENTLE_HOLD_MS) {
  if (startedAt == null) return 0;
  return Math.min(1, Math.max(0, (now - startedAt) / holdMs));
}

/**
 * Gentle mode's "I'll pray now": a 10 s press-and-hold with a filling bar, so
 * the user sees the hold is working (a silent 10 s wait reads as broken).
 * Releasing early resets it. Screen-reader users get the same action from the
 * accessibility actions menu (VoiceOver / TalkBack "long press").
 */
function HoldToUnlock({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (startedAt == null) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [startedAt]);

  const onAction = (event: AccessibilityActionEvent) => {
    if (event.nativeEvent.actionName === "longpress") onUnlock();
  };

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t("focusLock.shield.prayNow")}
      accessibilityHint={t("focusLock.shield.holdHint")}
      accessibilityActions={[{ name: "longpress", label: t("focusLock.shield.prayNow") }]}
      onAccessibilityAction={onAction}
      delayLongPress={GENTLE_HOLD_MS}
      onPressIn={() => {
        const at = Date.now();
        setStartedAt(at);
        setNow(at);
      }}
      onPressOut={() => setStartedAt(null)}
      onLongPress={() => {
        setStartedAt(null);
        onUnlock();
      }}
      style={[styles.hold, { borderColor: colors.border }]}
      testID="focus-hold-unlock"
    >
      <ThemedText type="smallBold">{t("focusLock.shield.prayNow")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("focusLock.shield.holdHint")}
      </ThemedText>
      {startedAt != null ? (
        <View style={styles.holdBar} testID="focus-hold-progress">
          <ProgressBar
            value={holdProgress(startedAt, now)}
            accessibilityLabel={t("a11yProgress.holdToUnlock")}
          />
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  holdBar: { alignSelf: "stretch", marginTop: Spacing.one },
  body: { gap: Spacing.three },
  hold: {
    alignItems: "center",
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.hairline,
    gap: Spacing.one,
    padding: Spacing.three,
  },
});
