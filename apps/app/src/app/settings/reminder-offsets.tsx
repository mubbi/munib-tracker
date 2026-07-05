import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { PrayerId } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
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
import { rescheduleAll } from "@/notifications/scheduler";
import { locationStore } from "@/stores/location-store";
import {
  preferencesStore,
  usePreferences,
  usePreferencesActions,
} from "@/stores/preferences-store";

const STEP = 5;
const MIN = -30;
const MAX = 30;

export default function ReminderOffsetsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();

  const setOffset = async (prayerId: PrayerId, next: number) => {
    const clamped = Math.max(MIN, Math.min(MAX, next));
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

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("reminderOffsets.title")}
      subtitle={t("reminderOffsets.subtitle")}
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace("/settings/notifications")
      }
    >
      <Seo path="/settings/reminder-offsets" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("reminderOffsets.title")}
            icon={{ ios: "clock.badge", android: "more_time", web: "more_time" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("reminderOffsets.hint")}
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
                    disabled={value <= MIN}
                    onPress={() => void setOffset(prayerId, value - STEP)}
                  />
                  <ThemedText type="smallBold" style={styles.value}>
                    {formatOffset(value)}
                  </ThemedText>
                  <IconButton
                    name={{ ios: "plus", android: "add", web: "add" }}
                    size={18}
                    tintColor={colors.foreground}
                    accessibilityLabel={t("reminderOffsets.later")}
                    disabled={value >= MAX}
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
  value: { minWidth: 92, textAlign: "center" },
});
