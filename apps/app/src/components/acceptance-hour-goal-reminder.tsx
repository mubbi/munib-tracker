import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useNow } from "@/hooks/use-now";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ACCEPTANCE_HOUR_ROUTE,
  isAcceptanceHourFallbackWindow,
  isAcceptanceHourWindow,
} from "@/lib/acceptance-hour";
import { isFriday } from "@/lib/friday";
import { locationCalcExtras } from "@/lib/location";
import { computePrayerTimes } from "@/lib/prayer-times";
import { useArrowForward } from "@/lib/rtl";
import { prayerDayAnchor } from "@/lib/time";
import { useLocation } from "@/stores/location-store";

/** Whether Friday's hour-of-acceptance window is currently open. */
export function useAcceptanceHourActive(): boolean {
  const location = useLocation();
  const now = useNow();

  return useMemo(() => {
    if (!isFriday(now)) return false;
    if (location.source === "default") {
      return isAcceptanceHourFallbackWindow(now);
    }
    const extras = locationCalcExtras(location);
    const day = prayerDayAnchor(now, location.timeZone);
    const times = computePrayerTimes(
      { latitude: location.latitude, longitude: location.longitude },
      day,
      location.method,
      location.madhab,
      extras,
    );
    return isAcceptanceHourWindow(now, times.asr, times.maghrib);
  }, [location, now]);
}

/**
 * Today's Goal banner during Friday's hour of acceptance (Asr→Maghrib when
 * location is known; otherwise a late-afternoon fallback). Deep-links to the
 * Friday guide topic.
 */
export function AcceptanceHourGoalReminder() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const arrowForward = useArrowForward();
  const inWindow = useAcceptanceHourActive();

  if (!inWindow) return null;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t("home.acceptanceHourCard.openGuide")}
      onPress={() => router.push(ACCEPTANCE_HOUR_ROUTE as Href)}
      haptic="light"
      scaleTo={0.98}
      style={[
        styles.banner,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: colors.accent,
        },
      ]}
    >
      <SymbolView
        name={{
          ios: "hands.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        }}
        size={22}
        tintColor={colors.accent}
      />
      <View style={styles.copy}>
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          {t("home.acceptanceHourCard.reminderTitle")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("home.acceptanceHourCard.reminderBody")}
        </ThemedText>
        <ThemedText type="caption" style={{ color: colors.accent, marginTop: 2 }}>
          {t("home.acceptanceHourCard.openGuide")}
        </ThemedText>
      </View>
      <SymbolView name={arrowForward} size={16} tintColor={colors.accent} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    marginBottom: Spacing.three,
  },
  copy: {
    flex: 1,
    gap: Spacing.half,
  },
});
