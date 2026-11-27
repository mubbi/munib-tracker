import { type Href, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { JourneyIntentionRow, JourneyMetricRow } from "@/components/learn-mizan/journey-rows";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureJahannamContent, isJahannamContentReady } from "@/lib/jahannam";
import { buildJahannamJourney, type JahannamJourneyRow } from "@/lib/jahannam-journey";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  JAHANNAM_INTENTION_IDS,
  type JahannamIntentionId,
  useEnsureJahannamIntentionsLoaded,
  useJahannamIntention,
  useJahannamIntentionActions,
  useJahannamIntentionsCount,
  useJahannamReflectionStreak,
} from "@/stores/jahannam-intentions-store";
import { useDailySummary } from "@/stores/tracker-store";

const INTENTION_ICONS: Record<JahannamIntentionId, AppIcon> = {
  istighfar: { ios: "arrow.uturn.backward.circle.fill", android: "undo", web: "undo" },
  repentance: { ios: "heart.fill", android: "favorite", web: "favorite" },
  "guard-tongue": { ios: "mouth.fill", android: "record_voice_over", web: "record_voice_over" },
  charity: { ios: "banknote.fill", android: "payments", web: "payments" },
  character: { ios: "person.fill.checkmark", android: "verified_user", web: "verified_user" },
  reconcile: { ios: "person.2.fill", android: "group", web: "group" },
};

const METRIC_ICONS: Record<JahannamJourneyRow["id"], AppIcon> = {
  salah: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  istighfar: { ios: "arrow.uturn.backward.circle.fill", android: "undo", web: "undo" },
  quran: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  charity: { ios: "banknote.fill", android: "payments", web: "payments" },
  character: { ios: "person.fill.checkmark", android: "verified_user", web: "verified_user" },
  repentance: { ios: "heart.fill", android: "favorite", web: "favorite" },
  rights: { ios: "person.2.fill", android: "group", web: "group" },
  reflection: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
};

function IntentionRow({ id }: { id: JahannamIntentionId }) {
  const { t } = useTranslation();
  const checked = useJahannamIntention(id);
  const { toggle } = useJahannamIntentionActions();
  return (
    <JourneyIntentionRow
      icon={INTENTION_ICONS[id]}
      title={t(`jahannam.intentions.${id}`)}
      hint={t(`jahannam.intentions.${id}Hint`)}
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
  row: JahannamJourneyRow;
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

export default function JahannamJourneyScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  useEnsureJahannamIntentionsLoaded();

  const summary = useDailySummary();
  const intentionsSet = useJahannamIntentionsCount();
  const reflectionStreak = useJahannamReflectionStreak();

  const {
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  const wide = useLearnHubLayout();
  // Wide web / tablets: metrics and intentions lay out two per row.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 320, max: 2 });
  const locale = i18n.language?.split("-")[0];
  const formatCount = useCallback((value: number) => value.toLocaleString(locale), [locale]);

  const snapshot = useMemo(
    () =>
      buildJahannamJourney({
        summary,
        reflectionStreak,
        intentionsSet,
        intentionsTotal: JAHANNAM_INTENTION_IDS.length,
        formatCount,
      }),
    [summary, reflectionStreak, intentionsSet, formatCount],
  );

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.journeyTitle")}
      subtitle={t("jahannam.journeySubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/jahannam/journey" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <Stagger>
          <JannahCallout tone="accent">{t("jahannam.journeyBanner")}</JannahCallout>

          <Card>
            <SectionHeader
              title={t("jahannam.journeyToday")}
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
                  {t("jahannam.journeyEmpty")}
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
              title={t("jahannam.intentionsTitle")}
              icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.intentionsHint}>
              {t("jahannam.intentionsHint")}
            </ThemedText>
            <LearnColumnsGrid columns={columns} style={styles.intentions}>
              {JAHANNAM_INTENTION_IDS.map((id) => (
                <IntentionRow key={id} id={id} />
              ))}
            </LearnColumnsGrid>
          </Card>

          <JannahDisclaimer textKey="jahannam.journeyDisclaimer" />
        </Stagger>
      </LearnContentGate>
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
export const generateMetadata = routeMetadata("/jahannam/journey");
