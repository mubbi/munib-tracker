import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { daysElapsed, khatmTodayProgress } from "@/lib/khatm";
import { useChevronForward } from "@/lib/rtl";
import { useEnsureKhatmLoaded, useKhatm } from "@/stores/khatm-store";

function paceStatus(
  pace: ReturnType<typeof khatmTodayProgress>["pace"],
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
) {
  if (pace === "behind") return tokens.status.warning;
  if (pace === "onTrack") return tokens.status.info;
  return tokens.status.success;
}

/**
 * Tracker checklist block for an active khatm plan. Navigates to `/quran/khatm`
 * to log reading — hidden when no plan is started.
 */
export function KhatmDailyChecklist() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  useEnsureKhatmLoaded();
  const { plan, ayahsRead, unit } = useKhatm();

  if (!plan) return null;

  const today = khatmTodayProgress(plan, ayahsRead);
  const tone = paceStatus(today.pace, tokens);
  const dayNumber = Math.min(plan.days, daysElapsed(plan) + 1);
  const isPage = unit === "page";
  const ratio = today.target > 0 ? today.done / today.target : 0;

  return (
    <Card
      padding="three"
      onPress={() => router.push("/quran/khatm")}
      accessibilityLabel={t("tracker.khatm.a11y", {
        day: dayNumber,
        total: plan.days,
        done: today.done,
        target: today.target,
      })}
    >
      <SectionHeader
        title={t("tracker.khatm.title")}
        icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
      />

      <View style={styles.summary}>
        <ThemedText type="smallBold" themeColor="mutedForeground">
          {t("tracker.khatm.progress", {
            done: today.done,
            total: today.target,
          })}
        </ThemedText>
        <ProgressBar value={ratio} height={6} color={tone.color} />
      </View>

      <View style={[styles.row, { backgroundColor: colors.muted }]}>
        <IconWell
          icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
          tint={tone.color}
          background={tone.soft}
        />
        <View style={styles.rowBody}>
          <ThemedText type="small">
            {t("khatm.dayOf", { day: dayNumber, total: plan.days })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {today.complete
              ? t("tracker.khatm.completeHint")
              : isPage
                ? t("tracker.khatm.hintPages", { count: today.target })
                : t("tracker.khatm.hint", { count: today.target })}
          </ThemedText>
        </View>
        <Pill
          label={t(`khatm.pace.${today.pace}`)}
          compact
          color={tone.text}
          background={tone.soft}
        />
        <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  summary: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    marginTop: Spacing.three,
  },
  rowBody: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
});
