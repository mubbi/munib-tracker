import { getLocalDateString, matchesEnabledKinds } from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FASTING_ICON } from "@/components/fasting/fasting-ui";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useHijriAdjustment } from "@/hooks/use-hijri-adjustment";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useArrowForward } from "@/lib/rtl";
import {
  classifyDate,
  fastingCalendarContext,
  headlineKind,
  voluntaryFastingHref,
} from "@/lib/voluntary-fasting";
import { usePreferences } from "@/stores/preferences-store";
import {
  useEnsureVoluntaryFastingLoaded,
  useVoluntaryFastEntry,
  useVoluntaryFastingEntries,
} from "@/stores/voluntary-fasting-store";

/** `hiddenHomeModules` id for this banner (Settings → Customize home). */
export const VOLUNTARY_FASTING_HOME_MODULE = "voluntary-fasting";

/**
 * Today's Goal banner on a recommended fast day the user follows (NF-3.2) —
 * the `white-days-goal-reminder.tsx` pattern. Hidden during an excused period,
 * on White Days (their own banner covers them) and once today is logged.
 */
export function VoluntaryFastGoalReminder() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const arrowForward = useArrowForward();
  const prefs = usePreferences();
  const hijriAdjustment = useHijriAdjustment();
  useEnsureVoluntaryFastingLoaded();
  const entries = useVoluntaryFastingEntries();
  const today = getLocalDateString();
  const todayEntry = useVoluntaryFastEntry(today);

  // biome-ignore lint/correctness/useExhaustiveDependencies: hijriAdjustment changes hijri.ts output.
  const day = useMemo(
    () => classifyDate(today, fastingCalendarContext(prefs, entries)),
    [today, prefs, entries, hijriAdjustment],
  );

  if (prefs.hiddenHomeModules?.includes(VOLUNTARY_FASTING_HOME_MODULE)) return null;
  if (prefs.activeExcusedReason || todayEntry) return null;
  const ctxPrefs = fastingCalendarContext(prefs, entries).prefs;
  if (!matchesEnabledKinds(day, ctxPrefs)) return null;
  const kind = headlineKind(day.kinds);
  if (!kind || kind === "white_day") return null;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t("voluntaryFasting.goal.a11y", {
        day: t(`voluntaryFasting.kind.${kind}`),
      })}
      onPress={() => router.push(voluntaryFastingHref(today) as Href)}
      haptic="light"
      scaleTo={0.98}
      style={[
        styles.banner,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: isTV() ? tokens.accentBorder : colors.accent,
        },
      ]}
    >
      <SymbolView name={FASTING_ICON} size={22} tintColor={colors.accent} />
      <View style={styles.copy}>
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          {t("voluntaryFasting.goal.title", { day: t(`voluntaryFasting.kind.${kind}`) })}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("voluntaryFasting.goal.body")}
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
  copy: { flex: 1, gap: Spacing.half },
});
