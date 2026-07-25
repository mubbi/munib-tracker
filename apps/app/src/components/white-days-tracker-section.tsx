import { WHITE_DAYS_CHECKLIST } from "@munib-tracker/shared/content/white-days-checklist";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useChevronForward } from "@/lib/rtl";
import {
  isWhiteDayDateString,
  whiteDaysForHijriMonth,
  whiteDaysHijriMonthKeyForDateString,
} from "@/lib/white-days";
import {
  useEnsureWhiteDaysChecklistLoaded,
  useWhiteDaysChecklistActions,
  useWhiteDaysChecklistForMonth,
} from "@/stores/white-days-checklist-store";

type WhiteDaysTrackerSectionProps = {
  date: string;
};

/**
 * White Days (Ayyām al-Bīḍ) checklist on the Tracker day view. Renders nothing
 * unless `date` falls on the 13th, 14th or 15th of the Hijri month. Progress is
 * month-scoped, so all three rows for the current Hijri month share one bucket
 * and stay in sync whichever of the three days is being viewed.
 */
export function WhiteDaysTrackerSection({ date }: WhiteDaysTrackerSectionProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  useEnsureWhiteDaysChecklistLoaded();
  const monthKey = whiteDaysHijriMonthKeyForDateString(date);
  const done = useWhiteDaysChecklistForMonth(monthKey);
  const { toggle } = useWhiteDaysChecklistActions();

  if (!isWhiteDayDateString(date)) return null;

  const [yearStr, monthStr] = monthKey.split("-");
  const days = whiteDaysForHijriMonth(Number(yearStr), Number(monthStr));
  const dateByHijriDay = new Map(days.map((d) => [d.hijriDay, d.date]));

  const completed = WHITE_DAYS_CHECKLIST.filter((item) => done[item.id]).length;
  const total = WHITE_DAYS_CHECKLIST.length;

  const formatDayLabel = (iso: string | undefined): string => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    const at = new Date(y, m - 1, d, 12, 0, 0);
    try {
      return at.toLocaleDateString(i18n.language || "en", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    } catch {
      return iso;
    }
  };

  return (
    <Card padding="three">
      <SectionHeader
        title={t("tracker.whiteDays.title")}
        icon={{ ios: "moon.circle.fill", android: "brightness_3", web: "brightness_3" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("tracker.whiteDays.subtitle")} · {t("tracker.whiteDays.progress", { completed, total })}
      </ThemedText>
      <View style={styles.rows}>
        {WHITE_DAYS_CHECKLIST.map((item) => {
          const checked = !!done[item.id];
          const dayLabel = formatDayLabel(dateByHijriDay.get(item.hijriDay));
          return (
            <View key={item.id} style={styles.row}>
              <PressableScale
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={t(`tracker.whiteDays.items.${item.id}.title`)}
                onPress={() => void toggle(item.id, monthKey)}
                scaleTo={0.98}
                haptic="selection"
                style={styles.rowMain}
              >
                <SymbolView
                  name={
                    checked
                      ? {
                          ios: "checkmark.circle.fill",
                          android: "check_circle",
                          web: "check_circle",
                        }
                      : {
                          ios: "circle",
                          android: "radio_button_unchecked",
                          web: "radio_button_unchecked",
                        }
                  }
                  size={24}
                  tintColor={checked ? tokens.status.success.color : colors.mutedForeground}
                />
                <View style={styles.rowText}>
                  <ThemedText type="smallBold">
                    {t(`tracker.whiteDays.items.${item.id}.title`)}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {[dayLabel, t(`tracker.whiteDays.items.${item.id}.hint`), item.reference]
                      .filter(Boolean)
                      .join(" · ")}
                  </ThemedText>
                </View>
              </PressableScale>
            </View>
          );
        })}
      </View>
      <PressableScale
        accessibilityRole="link"
        onPress={() => router.push("/white-days" as Href)}
        scaleTo={0.98}
        style={styles.learnLink}
      >
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          {t("tracker.whiteDays.learnMore")}
        </ThemedText>
        <AppIcon icon={chevronForward} size={14} tintColor={colors.accent} />
      </PressableScale>
    </Card>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two, marginBottom: Spacing.two },
  rows: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  rowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.one,
    minWidth: 0,
  },
  rowText: { flex: 1, gap: 2, minWidth: 0 },
  learnLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
});
