import { FRIDAY_CHECKLIST } from "@munib-tracker/shared/content/friday-checklist";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { fridayChecklistHref, isFriday } from "@/lib/friday";
import { useArrowForward } from "@/lib/rtl";
import {
  useEnsureFridayChecklistLoaded,
  useFridayChecklistForDate,
} from "@/stores/friday-checklist-store";

/**
 * Compact Friday reminder inside Today's Goal — badge lives in the parent
 * header; this banner carries the sunnah nudge + checklist shortcut.
 */
export function FridayGoalReminder() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const arrowForward = useArrowForward();
  useEnsureFridayChecklistLoaded();

  const today = getLocalDateString();
  const done = useFridayChecklistForDate(today);

  if (!isFriday()) return null;

  const completed = FRIDAY_CHECKLIST.filter((item) => done[item.id]).length;
  const total = FRIDAY_CHECKLIST.length;
  const allDone = completed === total && total > 0;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t("home.fridayCard.openChecklist")}
      onPress={() => router.push(fridayChecklistHref() as Href)}
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
        name={{ ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" }}
        size={22}
        tintColor={colors.accent}
      />
      <View style={styles.copy}>
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          {allDone ? t("home.fridayCard.allDone") : t("home.fridayCard.reminderTitle")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {allDone
            ? t("home.fridayCard.progress", { completed, total })
            : t("home.fridayCard.reminderBody")}
        </ThemedText>
        {!allDone ? (
          <ThemedText type="caption" style={{ color: colors.accent, marginTop: 2 }}>
            {t("home.fridayCard.openChecklist")} ·{" "}
            {t("home.fridayCard.progress", { completed, total })}
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
