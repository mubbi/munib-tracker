import type { FocusLockUnlockMode } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
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
  const { colors } = useThemeTokens();
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
    <Sheet visible variant="center" onClose={onDismiss}>
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
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("focusLock.shield.prayNow")}
            accessibilityHint={t("focusLock.shield.holdHint")}
            delayLongPress={GENTLE_HOLD_MS}
            onLongPress={() => onUnlock("holdPrayNow")}
            style={[styles.hold, { borderColor: colors.border }]}
          >
            <ThemedText type="smallBold">{t("focusLock.shield.prayNow")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("focusLock.shield.holdHint")}
            </ThemedText>
          </PressableScale>
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

const styles = StyleSheet.create({
  body: { gap: Spacing.three },
  hold: {
    alignItems: "center",
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.one,
    padding: Spacing.three,
  },
});
