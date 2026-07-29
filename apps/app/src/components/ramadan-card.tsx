import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatPrayerTime } from "@/lib/prayer-times";
import { getRamadanInfo } from "@/lib/ramadan";
import { useEnsureFastingLoaded, useFastingActions, useFastStatus } from "@/stores/fasting-store";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

/**
 * Home Ramadan card (NF-1.1) — only rendered during Ramadan. Shows the fasting
 * day, today's suhoor/iftar, and a one-tap "fasted today" toggle. Taps open the
 * full Ramadan screen.
 */
export function RamadanCard() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const location = useLocation();
  const prefs = usePreferences();
  useEnsureFastingLoaded();
  const today = getLocalDateString();
  const status = useFastStatus(today);
  const { setStatus } = useFastingActions();

  const info = useMemo(() => getRamadanInfo(location), [location]);
  if (!info.isRamadan) return null;

  const fasted = status === "fasted";

  return (
    <Card
      padding="three"
      style={[styles.card, { borderColor: colors.accent }]}
      onPress={() => router.push("/ramadan")}
      accessibilityLabel={t("ramadan.title")}
    >
      <View style={styles.header}>
        <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
          <SymbolView
            name={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
            size={18}
            tintColor={colors.accent}
          />
        </View>
        <View style={styles.headerText}>
          <ThemedText type="smallBold">{t("ramadan.title")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("ramadan.dayOf", { day: info.day, total: info.totalDays })}
          </ThemedText>
        </View>
        <IconButton
          name={
            fasted
              ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
              : { ios: "circle", android: "radio_button_unchecked", web: "radio_button_unchecked" }
          }
          size={26}
          tintColor={fasted ? tokens.status.success.color : colors.mutedForeground}
          accessibilityLabel={t("ramadan.fastedToday")}
          accessibilityState={{ selected: fasted }}
          haptic="selection"
          onPress={() => setStatus(today, fasted ? null : "fasted")}
        />
      </View>

      <View style={styles.times}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("ramadan.suhoor")}:{" "}
          <ThemedText type="smallBold">
            {formatPrayerTime(info.suhoorEnds, prefs.timeFormat, location.timeZone)}
          </ThemedText>
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("ramadan.iftar")}:{" "}
          <ThemedText type="smallBold">
            {formatPrayerTime(info.iftar, prefs.timeFormat, location.timeZone)}
          </ThemedText>
        </ThemedText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, gap: Spacing.three },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  iconWell: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1, gap: 2 },
  times: { flexDirection: "row", justifyContent: "space-between" },
});
