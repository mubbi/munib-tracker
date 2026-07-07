import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { chevronForward } from "@/lib/rtl";
import { getSalahGuideLessonCount } from "@/lib/salah-guide";
import { buildSalahGuideProgress } from "@/lib/salah-guide-progress";
import {
  useEnsureSalahGuideProgressLoaded,
  useSalahGuideCompletedCount,
} from "@/stores/salah-guide-progress-store";
import { useDailySummary, useStreak } from "@/stores/tracker-store";

const METRIC_ICONS: Record<string, AppIcon> = {
  salah: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  qaza: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
  streak: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
  khushu: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
};

export default function SalahGuideProgressScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureSalahGuideProgressLoaded();
  const completedCount = useSalahGuideCompletedCount();
  const summary = useDailySummary();
  const streak = useStreak();

  const snapshot = useMemo(
    () =>
      buildSalahGuideProgress({
        summary,
        streak,
        lessonsCompleted: completedCount,
        lessonsTotal: getSalahGuideLessonCount(),
        formatCount: (n) => new Intl.NumberFormat(i18n.language).format(n),
      }),
    [summary, streak, completedCount, i18n.language],
  );

  return (
    <ScreenLayout
      eyebrow={t("salahGuide.eyebrow")}
      title={t("salahGuide.progressTitle")}
      subtitle={t("salahGuide.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/salah-guide")}
    >
      <Seo path="/salah-guide/progress" />
      <Stagger>
        <JannahCallout tone="warning">{t("salahGuide.progressIntro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("salahGuide.lessonsTitle")}
            icon={{ ios: "book.closed.fill", android: "school", web: "school" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("salahGuide.lessonsHint")}
          </ThemedText>
          <View style={styles.lessonRow}>
            <ThemedText type="title">
              {t("salahGuide.lessonsCount", {
                completed: snapshot.lessonsCompleted,
                total: snapshot.lessonsTotal,
              })}
            </ThemedText>
            <ProgressBar value={snapshot.lessonProgress} />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("salahGuide.practiceTitle")}
            icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
          />
          <View style={styles.metrics}>
            {snapshot.rows.map((row) => (
              <PressableScale
                key={row.id}
                haptic="light"
                accessibilityRole="button"
                accessibilityLabel={`${t(row.labelKey)}. ${row.value}`}
                onPress={() => router.push(row.route)}
                style={[styles.metricRow, { backgroundColor: colors.muted }]}
              >
                <IconWell
                  icon={METRIC_ICONS[row.id]}
                  tint={colors.accent}
                  background={tokens.accentSoft}
                />
                <View style={styles.metricCopy}>
                  <ThemedText type="smallBold">{t(row.labelKey)}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t(row.hintKey)}
                  </ThemedText>
                  {row.progress !== undefined && row.progress > 0 ? (
                    <ProgressBar value={row.progress} height={4} color={colors.accent} />
                  ) : null}
                </View>
                <View style={styles.metricEnd}>
                  <ThemedText type="smallBold">{row.value}</ThemedText>
                  <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
                </View>
              </PressableScale>
            ))}
          </View>
        </Card>

        <JannahDisclaimer textKey="salahGuide.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  lessonRow: { marginTop: Spacing.three, gap: Spacing.two },
  metrics: { gap: Spacing.two, marginTop: Spacing.three },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  metricCopy: { flex: 1, gap: Spacing.half },
  metricEnd: { alignItems: "flex-end", gap: Spacing.one },
});
