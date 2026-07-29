import {
  clampPrayerReminderOffset,
  OBLIGATORY_PRAYERS,
  PRAYER_REMINDER_OFFSET_MAX,
  PRAYER_REMINDER_OFFSET_MIN,
} from "@munib-tracker/shared/constants";
import type { PrayerId } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { locationCalcExtras } from "@/lib/location";
import { goBackOrReplace } from "@/lib/navigation";
import { computePrayerTimes, formatPrayerTime } from "@/lib/prayer-times";
import { prayerDayAnchor } from "@/lib/time";
import { rescheduleAll } from "@/notifications/scheduler";
import { locationStore, useLocation } from "@/stores/location-store";
import {
  preferencesStore,
  usePreferences,
  usePreferencesActions,
} from "@/stores/preferences-store";

const STEP = 5;

export default function ReminderOffsetsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const prefs = usePreferences();
  const location = useLocation();
  const { update } = usePreferencesActions();

  const prayerTimes = useMemo(() => {
    const anchor = prayerDayAnchor(new Date(), location.timeZone);
    const times = computePrayerTimes(
      { latitude: location.latitude, longitude: location.longitude },
      anchor,
      location.method,
      location.madhab,
      locationCalcExtras(location),
    );
    const at: Partial<Record<PrayerId, Date>> = {};
    for (const prayerId of OBLIGATORY_PRAYERS) {
      at[prayerId] = times.timeForPrayer(prayerId) ?? times.fajr;
    }
    return at;
  }, [location]);

  const setOffset = async (prayerId: PrayerId, next: number) => {
    const clamped = clampPrayerReminderOffset(next);
    const offsets = { ...prefs.prayerReminderOffsets };
    if (clamped === 0) delete offsets[prayerId];
    else offsets[prayerId] = clamped;
    await update({ prayerReminderOffsets: offsets });
    await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
  };

  const formatOffset = (value: number) => {
    if (value === 0) return t("reminderOffsets.atTime");
    return value < 0
      ? t("reminderOffsets.before", { count: Math.abs(value) })
      : t("reminderOffsets.after", { count: value });
  };

  const formatNotifyTime = (prayerId: PrayerId, offsetMinutes: number) => {
    const base = prayerTimes[prayerId];
    if (!base) return null;
    const offset = clampPrayerReminderOffset(offsetMinutes);
    const fireAt = new Date(base.getTime() + offset * 60_000);
    return formatPrayerTime(fireAt, prefs.timeFormat, location.timeZone);
  };

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("reminderOffsets.title")}
      subtitle={t("reminderOffsets.subtitle")}
      onBack={() => goBackOrReplace(router, "/settings/notifications")}
    >
      <Seo path="/settings/reminder-offsets" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("reminderOffsets.title")}
            icon={{ ios: "clock.badge", android: "more_time", web: "more_time" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("reminderOffsets.hint", { max: PRAYER_REMINDER_OFFSET_MAX })}
          </ThemedText>
          <View style={styles.rows}>
            {OBLIGATORY_PRAYERS.map((prayerId) => {
              const value = prefs.prayerReminderOffsets?.[prayerId] ?? 0;
              return (
                <View key={prayerId} style={[styles.row, { backgroundColor: colors.muted }]}>
                  <ThemedText type="small" style={styles.prayer}>
                    {t(`prayers.${prayerId}`)}
                  </ThemedText>
                  <IconButton
                    name={{ ios: "minus", android: "remove", web: "remove" }}
                    size={18}
                    tintColor={colors.foreground}
                    accessibilityLabel={t("reminderOffsets.earlier")}
                    disabled={value <= PRAYER_REMINDER_OFFSET_MIN}
                    onPress={() => void setOffset(prayerId, value - STEP)}
                  />
                  <View style={styles.valueCol}>
                    <ThemedText type="smallBold" style={styles.value}>
                      {formatOffset(value)}
                    </ThemedText>
                    <ThemedText
                      type="caption"
                      themeColor="mutedForeground"
                      style={styles.notifyTime}
                    >
                      {formatNotifyTime(prayerId, value)}
                    </ThemedText>
                  </View>
                  <IconButton
                    name={{ ios: "plus", android: "add", web: "add" }}
                    size={18}
                    tintColor={colors.foreground}
                    accessibilityLabel={t("reminderOffsets.later")}
                    disabled={value >= PRAYER_REMINDER_OFFSET_MAX}
                    onPress={() => void setOffset(prayerId, value + STEP)}
                  />
                </View>
              );
            })}
          </View>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two, marginBottom: Spacing.three },
  rows: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  prayer: { flex: 1 },
  valueCol: { minWidth: 120, alignItems: "center", gap: 2 },
  value: { textAlign: "center" },
  notifyTime: { textAlign: "center" },
});
