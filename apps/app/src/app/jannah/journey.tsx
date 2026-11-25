import { addDays, getLocalDateString, prayerCompletionDates } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { JourneyIntentionRow, JourneyMetricRow } from "@/components/learn-mizan/journey-rows";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { PrayerRepository } from "@/db/repositories/prayer-repository";
import { buildJannahJourney, type JannahJourneyRow } from "@/lib/jannah-journey";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
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
  const checked = useJannahIntention(id);
  const { toggle } = useJannahIntentionActions();
  return (
    <JourneyIntentionRow
      icon={INTENTION_ICONS[id]}
      title={t(`jannah.intentions.${id}`)}
      hint={t(`jannah.intentions.${id}Hint`)}
      checked={checked}
      onToggle={() => void toggle(id)}
    />
  );
}

function MetricRow({
  row,
  onPress,
  tiled,
}: {
  row: JannahJourneyRow;
  onPress: () => void;
  tiled: boolean;
}) {
  const { t } = useTranslation();
  return (
    <JourneyMetricRow
      icon={METRIC_ICONS[row.id]}
      label={t(row.labelKey)}
      value={row.value}
      hint={t(row.hintKey)}
      progress={row.progress}
      onPress={onPress}
      tiled={tiled}
    />
  );
}

export default function JannahJourneyScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  useEnsureJannahIntentionsLoaded();
  const wide = useLearnHubLayout();
  // Wide web / tablets: metrics and intentions lay out two per row.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 320, max: 2 });

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
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/jannah/journey" />
      <Stagger>
        <JannahCallout tone="accent">{t("jannah.journeyBanner")}</JannahCallout>

        <Card>
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
          <LearnColumnsGrid columns={columns} stackGap={0} style={styles.rows}>
            {snapshot.rows.map((row) => (
              <MetricRow
                key={row.id}
                row={row}
                tiled={columns > 1}
                onPress={() => router.push(row.route)}
              />
            ))}
          </LearnColumnsGrid>
        </Card>

        <Card>
          <SectionHeader
            title={t("jannah.intentionsTitle")}
            icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.intentionsHint}>
            {t("jannah.intentionsHint")}
          </ThemedText>
          <LearnColumnsGrid columns={columns} style={styles.intentions}>
            {INTENTION_IDS.map((id) => (
              <IntentionRow key={id} id={id} />
            ))}
          </LearnColumnsGrid>
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
  empty: { textAlign: "center", maxWidth: 280 },
  rows: { marginTop: Spacing.two },
  intentionsHint: { marginTop: Spacing.one },
  intentions: { marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jannah/journey");
