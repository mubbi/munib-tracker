import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ayahsRemaining,
  daysElapsed,
  khatmPace,
  khatmPercentComplete,
  khatmTodayProgress,
  khatmTotalForUnit,
  pagesRemaining,
  scheduleGap,
} from "@/lib/khatm";
import { useChevronForward } from "@/lib/rtl";
import { useEnsureKhatmLoaded, useKhatm } from "@/stores/khatm-store";

function paceStatus(
  pace: ReturnType<typeof khatmPace>,
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
) {
  if (pace === "behind") return tokens.status.warning;
  if (pace === "onTrack") return tokens.status.info;
  return tokens.status.success;
}

/**
 * Home khatm card — only rendered when a reading plan is active. Taps open
 * `/quran/khatm` so users can log progress and catch up.
 */
export function KhatmCard() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  useEnsureKhatmLoaded();
  const { plan, ayahsRead, unit } = useKhatm();

  if (!plan) return null;

  const locale = i18n.language?.split("-")[0];
  const format = (n: number) => n.toLocaleString(locale);
  const total = khatmTotalForUnit(unit);
  const percent = khatmPercentComplete(ayahsRead, unit);
  const pace = khatmPace(plan, ayahsRead);
  const tone = paceStatus(pace, tokens);
  const today = khatmTodayProgress(plan, ayahsRead);
  const dayNumber = Math.min(plan.days, daysElapsed(plan) + 1);
  const remaining = unit === "page" ? pagesRemaining(ayahsRead) : ayahsRemaining(ayahsRead);
  const gap = scheduleGap(plan, ayahsRead);
  const isPage = unit === "page";

  const catchUpCopy =
    pace === "behind" && gap < 0
      ? isPage
        ? t("khatm.catchUpPages", { count: Math.abs(gap) })
        : t("khatm.catchUp", { count: Math.abs(gap) })
      : null;

  return (
    <Card
      padding="three"
      onPress={() => router.push("/quran/khatm")}
      accessibilityLabel={t("home.khatmCard.a11y", {
        day: dayNumber,
        total: plan.days,
        percent,
        done: today.done,
        target: today.target,
      })}
      style={[
        styles.card,
        {
          backgroundColor: tone.soft,
          borderColor: tone.border,
          borderWidth: 1,
        },
      ]}
    >
      <View style={styles.header}>
        <IconWell
          icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
          tint={tone.color}
          background={colors.background}
          well={44}
          size={20}
        />
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">{t("khatm.title")}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("khatm.dayOf", { day: dayNumber, total: plan.days })}
            {" · "}
            {isPage
              ? t("khatm.dailyTargetPages", { count: today.target })
              : t("khatm.dailyTarget", { count: today.target })}
          </ThemedText>
        </View>
        <Pill
          label={t(`khatm.pace.${pace}`)}
          compact
          color={tone.text}
          background={colors.background}
          icon={
            pace === "behind"
              ? { ios: "exclamationmark.circle.fill", android: "error", web: "error" }
              : pace === "done"
                ? { ios: "checkmark.seal.fill", android: "verified", web: "verified" }
                : undefined
          }
        />
        <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressLabels}>
          <ThemedText type="smallBold" style={{ color: tone.text }}>
            {t("khatm.percentComplete", { percent })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {isPage
              ? t("khatm.progressPages", {
                  read: format(ayahsRead),
                  total: format(total),
                })
              : t("khatm.progress", {
                  read: format(ayahsRead),
                  total: format(total),
                })}
          </ThemedText>
        </View>
        <ProgressBar value={percent / 100} height={6} color={tone.color} />
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.background }]}>
          <ThemedText type="smallBold" style={{ color: tone.text }}>
            {format(remaining)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {isPage ? t("khatm.remainingPages") : t("khatm.remainingAyahs")}
          </ThemedText>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.background }]}>
          <ThemedText type="smallBold" style={{ color: tone.text }}>
            {format(today.done)}/{format(today.target)}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("khatm.todayTarget")}
          </ThemedText>
        </View>
      </View>

      {catchUpCopy ? (
        <View
          style={[
            styles.catchUp,
            {
              backgroundColor: colors.background,
              borderColor: tone.border,
            },
          ]}
        >
          <SymbolView
            name={{
              ios: "exclamationmark.triangle.fill",
              android: "warning",
              web: "warning",
            }}
            size={14}
            tintColor={tone.color}
          />
          <ThemedText type="caption" style={{ color: tone.text, flex: 1 }}>
            {catchUpCopy}
          </ThemedText>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  progressBlock: {
    gap: Spacing.one + 2,
  },
  progressLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.half,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  catchUp: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
