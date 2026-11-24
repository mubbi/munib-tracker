import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import { clearFast, markFast } from "@/lib/voluntary-fasting";
import {
  isWhiteDayDateString,
  whiteDayFastsForHijriMonth,
  whiteDaysHijriMonthKeyForDateString,
} from "@/lib/white-days";
import {
  useEnsureVoluntaryFastingLoaded,
  useVoluntaryFastingEntries,
} from "@/stores/voluntary-fasting-store";
import { useEnsureWhiteDaysChecklistLoaded } from "@/stores/white-days-checklist-store";

type WhiteDaysTrackerSectionProps = {
  date: string;
};

/**
 * White Days (Ayyām al-Bīḍ) checklist on the Tracker day view. Renders nothing
 * unless `date` is a White Day a fast may be suggested on (13th–15th, never 13
 * Dhul-Hijjah or Ramadan — see `lib/white-days.ts`).
 *
 * One record of a fast (NF-3.2): each row is the voluntary-fasting entry for
 * that day's date, so a tick here shows in `/fasting` (history, stats, coach)
 * and vice versa. Ticks go through `markFast`, so the same blocking rules apply
 * (a refusal shows its gentle reason). Only a kept fast (`fasted`) is checked;
 * a planned one shows as "intended". Legacy month ticks are migrated on load.
 */
export function WhiteDaysTrackerSection({ date }: WhiteDaysTrackerSectionProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  useEnsureVoluntaryFastingLoaded();
  // Loading the legacy store folds any old checklist ticks into the fasting log.
  useEnsureWhiteDaysChecklistLoaded();
  const entries = useVoluntaryFastingEntries();
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const monthKey = whiteDaysHijriMonthKeyForDateString(date);

  if (!isWhiteDayDateString(date)) return null;

  const [yearStr, monthStr] = monthKey.split("-");
  const fasts = whiteDayFastsForHijriMonth(Number(yearStr), Number(monthStr));
  const statusOf = (day: string) => {
    const entry = entries[day];
    return entry && entry.deleted !== true ? entry.status : undefined;
  };

  const completed = fasts.filter((fast) => statusOf(fast.date) === "fasted").length;
  const total = fasts.length;

  const toggle = (day: string) => {
    setBlockedMessage(null);
    if (statusOf(day) === "fasted") {
      void clearFast(day);
      return;
    }
    void markFast(day, "fasted").then((result) => {
      if (!result.ok) setBlockedMessage(t(`voluntaryFasting.blocked.${result.reason}`));
    });
  };

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
        {fasts.map(({ item, date: fastDate }) => {
          const status = statusOf(fastDate);
          const checked = status === "fasted";
          const dayLabel = formatDayLabel(fastDate);
          return (
            <View key={item.id} style={styles.row}>
              <PressableScale
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={t(`tracker.whiteDays.items.${item.id}.title`)}
                onPress={() => toggle(fastDate)}
                scaleTo={0.98}
                haptic="selection"
                style={[styles.rowMain, isTV() ? styles.rowMainTv : null]}
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
                    {[
                      dayLabel,
                      status === "intended" ? t("tracker.whiteDays.intended") : null,
                      t(`tracker.whiteDays.items.${item.id}.hint`),
                      item.reference,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </ThemedText>
                </View>
              </PressableScale>
            </View>
          );
        })}
      </View>
      {blockedMessage ? (
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={styles.blocked}
          accessibilityLiveRegion="polite"
        >
          {blockedMessage}
        </ThemedText>
      ) : null}
      <PressableScale
        accessibilityRole="link"
        onPress={() => router.push("/white-days" as Href)}
        scaleTo={0.98}
        style={[styles.learnLink, isTV() ? styles.learnLinkTv : null]}
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
  /** TV: a full-row Select target with room for the focus ring. */
  rowMainTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
  rowText: { flex: 1, gap: 2, minWidth: 0 },
  blocked: { marginTop: Spacing.two },
  learnLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
  learnLinkTv: {
    alignSelf: "flex-start",
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
});
