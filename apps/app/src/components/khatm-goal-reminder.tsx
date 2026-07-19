import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { khatmTodayProgress } from "@/lib/khatm";
import { useArrowForward } from "@/lib/rtl";
import { useEnsureKhatmLoaded, useKhatm } from "@/stores/khatm-store";

/**
 * Compact khatm reminder inside Today's Goal — badge lives in the parent
 * header; this banner carries today's reading nudge + plan shortcut.
 */
export function KhatmGoalReminder() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const arrowForward = useArrowForward();
  useEnsureKhatmLoaded();
  const { plan, ayahsRead, unit } = useKhatm();

  if (!plan) return null;

  const today = khatmTodayProgress(plan, ayahsRead);
  const isPage = unit === "page";
  const tone =
    today.pace === "behind"
      ? tokens.status.warning
      : today.complete
        ? tokens.status.success
        : tokens.status.info;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={t("home.khatmCard.openPlan")}
      onPress={() => router.push("/quran/khatm" as Href)}
      haptic="light"
      scaleTo={0.98}
      style={[
        styles.banner,
        {
          backgroundColor: tone.soft,
          borderColor: tone.border,
        },
      ]}
    >
      <SymbolView
        name={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
        size={22}
        tintColor={tone.color}
      />
      <View style={styles.copy}>
        <ThemedText type="smallBold" style={{ color: tone.text }}>
          {today.complete
            ? t("home.khatmCard.allDone")
            : today.pace === "behind"
              ? t("home.khatmCard.catchUpTitle")
              : t("home.khatmCard.reminderTitle")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {today.complete
            ? t("home.khatmCard.progress", {
                done: today.done,
                total: today.target,
              })
            : isPage
              ? t("home.khatmCard.reminderBodyPages", {
                  done: today.done,
                  total: today.target,
                })
              : t("home.khatmCard.reminderBody", {
                  done: today.done,
                  total: today.target,
                })}
        </ThemedText>
        {!today.complete ? (
          <ThemedText type="caption" style={{ color: tone.text, marginTop: 2 }}>
            {t("home.khatmCard.openPlan")} ·{" "}
            {t("home.khatmCard.progress", {
              done: today.done,
              total: today.target,
            })}
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
