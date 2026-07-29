import { WHITE_DAYS_CHECKLIST } from "@munib-tracker/shared/content/white-days-checklist";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useArrowForward } from "@/lib/rtl";
import { isWhiteDay, whiteDaysChecklistHref, whiteDaysHijriMonthKey } from "@/lib/white-days";
import {
  useEnsureWhiteDaysChecklistLoaded,
  useWhiteDaysChecklistForMonth,
} from "@/stores/white-days-checklist-store";

/**
 * Compact White Days (Ayyām al-Bīḍ) reminder inside Today's Goal — mirrors the
 * Friday reminder. Only rendered on the 13th, 14th and 15th of the Hijri month;
 * progress is scoped to the current Hijri month's three-day checklist.
 */
export function WhiteDaysGoalReminder() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const arrowForward = useArrowForward();
  useEnsureWhiteDaysChecklistLoaded();

  const monthKey = whiteDaysHijriMonthKey();
  const done = useWhiteDaysChecklistForMonth(monthKey);

  if (!isWhiteDay()) return null;

  const completed = WHITE_DAYS_CHECKLIST.filter((item) => done[item.id]).length;
  const total = WHITE_DAYS_CHECKLIST.length;
  const allDone = completed === total && total > 0;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t("home.whiteDaysCard.openChecklist")}
      onPress={() => router.push(whiteDaysChecklistHref() as Href)}
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
        name={{ ios: "moon.circle.fill", android: "brightness_3", web: "brightness_3" }}
        size={22}
        tintColor={colors.accent}
      />
      <View style={styles.copy}>
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          {allDone ? t("home.whiteDaysCard.allDone") : t("home.whiteDaysCard.reminderTitle")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {allDone
            ? t("home.whiteDaysCard.progress", { completed, total })
            : t("home.whiteDaysCard.reminderBody")}
        </ThemedText>
        {!allDone ? (
          <ThemedText type="caption" style={{ color: colors.accent, marginTop: 2 }}>
            {t("home.whiteDaysCard.openChecklist")} ·{" "}
            {t("home.whiteDaysCard.progress", { completed, total })}
          </ThemedText>
        ) : null}
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
