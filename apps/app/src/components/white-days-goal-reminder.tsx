import { isLiveFastEntry } from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useArrowForward } from "@/lib/rtl";
import {
  isWhiteDay,
  whiteDayFastsForHijriMonth,
  whiteDaysChecklistHref,
  whiteDaysHijriMonthKey,
} from "@/lib/white-days";
import {
  useEnsureVoluntaryFastingLoaded,
  useVoluntaryFastingEntries,
} from "@/stores/voluntary-fasting-store";
import { useEnsureWhiteDaysChecklistLoaded } from "@/stores/white-days-checklist-store";

/**
 * Compact White Days (Ayyām al-Bīḍ) reminder inside Today's Goal — mirrors the
 * Friday reminder. Only rendered on a White Day a fast may be suggested on
 * (never 13 Dhul-Hijjah or Ramadan); progress counts this Hijri month's kept
 * White Day fasts in the voluntary-fasting log (one record of a fast, NF-3.2).
 */
export function WhiteDaysGoalReminder() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const arrowForward = useArrowForward();
  useEnsureVoluntaryFastingLoaded();
  useEnsureWhiteDaysChecklistLoaded();
  const entries = useVoluntaryFastingEntries();

  if (!isWhiteDay()) return null;

  const [year, month] = whiteDaysHijriMonthKey().split("-").map(Number);
  const fasts = whiteDayFastsForHijriMonth(year as number, month as number);
  const completed = fasts.filter((fast) => {
    const entry = entries[fast.date];
    return isLiveFastEntry(entry) && entry.status === "fasted";
  }).length;
  const total = fasts.length;
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
          // TV: quiet edge at rest — the solid accent ring means D-pad focus.
          borderColor: isTV() ? tokens.accentBorder : colors.accent,
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
          {allDone
            ? total === 3
              ? t("home.whiteDaysCard.allDone")
              : t("home.whiteDaysCard.allDoneMonth")
            : t("home.whiteDaysCard.reminderTitle")}
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
