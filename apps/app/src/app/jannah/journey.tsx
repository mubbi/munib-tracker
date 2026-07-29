import { addDays, getLocalDateString, prayerCompletionDates } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { PrayerRepository } from "@/db/repositories/prayer-repository";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildJannahJourney, type JannahJourneyRow } from "@/lib/jannah-journey";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { useChevronForward } from "@/lib/rtl";
import {
  type JannahIntentionId,
  useEnsureJannahIntentionsLoaded,
  useJannahIntention,
  useJannahIntentionActions,
} from "@/stores/jannah-intentions-store";
import { khushuStore } from "@/stores/khushu-store";
import { useDailySummary, useStreak } from "@/stores/tracker-store";

const INTENTION_IDS: JannahIntentionId[] = ["tawbah", "charity", "character"];

const METRIC_ICONS: Record<JannahJourneyRow["id"], AppIcon> = {
  salah: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  dhikr: { ios: "heart.fill", android: "favorite", web: "favorite" },
  qaza: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
  streak: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
  tahajjud: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  reflection: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
  quran: { ios: "book.fill", android: "menu_book", web: "menu_book" },
};

const INTENTION_ICONS: Record<JannahIntentionId, AppIcon> = {
  tawbah: { ios: "arrow.uturn.backward.circle.fill", android: "undo", web: "undo" },
  charity: { ios: "banknote.fill", android: "payments", web: "payments" },
  character: { ios: "person.fill.checkmark", android: "verified_user", web: "verified_user" },
};

function IntentionRow({ id }: { id: JannahIntentionId }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const checked = useJannahIntention(id);
  const { toggle } = useJannahIntentionActions();

  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={t(`jannah.intentions.${id}`)}
      onPress={() => void toggle(id)}
      haptic="selection"
      style={[styles.intentionRow, { backgroundColor: colors.muted }]}
    >
      <IconWell
        icon={INTENTION_ICONS[id]}
        tint={checked ? tokens.status.success.color : colors.mutedForeground}
        background={checked ? tokens.status.success.soft : colors.card}
        well={40}
        size={18}
      />
      <View style={styles.intentionCopy}>
        <ThemedText
          type="smallBold"
          style={checked ? { color: colors.mutedForeground } : undefined}
        >
          {t(`jannah.intentions.${id}`)}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(`jannah.intentions.${id}Hint`)}
        </ThemedText>
      </View>
      <SymbolView
        name={
          checked
            ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
            : { ios: "circle", android: "radio_button_unchecked", web: "radio_button_unchecked" }
        }
        size={22}
        tintColor={checked ? tokens.status.success.color : colors.mutedForeground}
      />
    </PressableScale>
  );
}

function MetricRow({ row, onPress }: { row: JannahJourneyRow; onPress: () => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();

  return (
    <PressableScale
      onPress={onPress}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${t(row.labelKey)}. ${row.value}`}
      style={[styles.metricRow, { borderTopColor: tokens.hairline }]}
    >
      <IconWell icon={METRIC_ICONS[row.id]} tint={colors.accent} well={40} size={18} />
      <View style={styles.metricCopy}>
        <View style={styles.metricHead}>
          <ThemedText type="smallBold">{t(row.labelKey)}</ThemedText>
          <ThemedText type="smallBold" style={{ color: colors.accent }}>
            {row.value}
          </ThemedText>
        </View>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(row.hintKey)}
        </ThemedText>
        {row.progress != null && row.progress > 0 ? (
          <ProgressBar value={row.progress} height={4} color={colors.accent} />
        ) : null}
      </View>
      <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

export default function JannahJourneyScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  useEnsureJannahIntentionsLoaded();

  const summary = useDailySummary();
  const streak = useStreak();
  const [khushuWeek, setKhushuWeek] = useState(0);
  const [tahajjudWeek, setTahajjudWeek] = useState(0);

  const locale = i18n.language?.split("-")[0];
  const formatCount = useCallback((value: number) => value.toLocaleString(locale), [locale]);

  const reloadWeekStats = useCallback(async () => {
    const today = getLocalDateString();
    const weekStart = addDays(today, -6);
    await khushuStore.getState().load();
    const khushuItems = khushuStore.getState().items.filter((item) => item.date >= weekStart);
    setKhushuWeek(khushuItems.length);

    const logs = await PrayerRepository.getAll();
    const tahajjudDates = prayerCompletionDates(logs, "tahajjud");
    let tahajjudCount = 0;
    for (let i = 0; i < 7; i += 1) {
      if (tahajjudDates.has(addDays(today, -i))) tahajjudCount += 1;
    }
    setTahajjudWeek(tahajjudCount);
  }, []);

  useEffect(() => {
    void reloadWeekStats();
  }, [reloadWeekStats]);

  const snapshot = useMemo(
    () =>
      buildJannahJourney({
        summary,
        streak,
        khushuThisWeek: khushuWeek,
        tahajjudThisWeek: tahajjudWeek,
        formatCount,
      }),
    [summary, streak, khushuWeek, tahajjudWeek, formatCount],
  );

  return (
    <ScreenLayout
      eyebrow={t("jannah.eyebrow")}
      title={t("jannah.journeyTitle")}
      subtitle={t("jannah.journeySubtitle")}
      onBack={() => goBackOrReplace(router, "/jannah")}
    >
      <Seo path="/jannah/journey" />
      <Stagger>
        <JannahCallout tone="accent">{t("jannah.journeyBanner")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("jannah.journeyToday")}
            icon={{ ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" }}
          />
          {!snapshot.hasActivity ? (
            <View style={styles.emptyWrap}>
              <IconWell
                icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
                well={48}
                size={22}
              />
              <ThemedText type="small" themeColor="mutedForeground" style={styles.empty}>
                {t("jannah.journeyEmpty")}
              </ThemedText>
            </View>
          ) : null}
          <View style={styles.rows}>
            {snapshot.rows.map((row) => (
              <MetricRow key={row.id} row={row} onPress={() => router.push(row.route)} />
            ))}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("jannah.intentionsTitle")}
            icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.intentionsHint}>
            {t("jannah.intentionsHint")}
          </ThemedText>
          <View style={styles.intentions}>
            {INTENTION_IDS.map((id) => (
              <IntentionRow key={id} id={id} />
            ))}
          </View>
        </Card>

        <JannahDisclaimer textKey="jannah.journeyDisclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  emptyWrap: {
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
  },
  empty: { textAlign: "center", lineHeight: 20, maxWidth: 280 },
  rows: { marginTop: Spacing.two },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  metricCopy: { flex: 1, gap: Spacing.one },
  metricHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  intentionsHint: { marginTop: Spacing.one, lineHeight: 18 },
  intentions: { marginTop: Spacing.three, gap: Spacing.two },
  intentionRow: {
    flexDirection: "row",
    gap: Spacing.three,
    alignItems: "center",
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  intentionCopy: { flex: 1, gap: Spacing.half },
});
