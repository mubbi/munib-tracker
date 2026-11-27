import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
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
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { tTv } from "@/lib/i18n/t-tv";
import { ensureLastDayContent, getLastDayLessonCount, isLastDayContentReady } from "@/lib/last-day";
import type { LastDayPreparationRowId } from "@/lib/last-day-preparation";
import { buildLastDayPreparation } from "@/lib/last-day-preparation";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureLastDayProgressLoaded,
  useLastDayCharacterChecked,
  useLastDayCompletedCount,
  useLastDayProgressActions,
  useLastDayRepentanceChecked,
} from "@/stores/last-day-progress-store";
import { useDailySummary } from "@/stores/tracker-store";

const ROW_ICONS: Record<LastDayPreparationRowId, AppIcon> = {
  salah: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  quran: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  dhikr: { ios: "heart.fill", android: "favorite", web: "favorite" },
  charity: { ios: "banknote.fill", android: "payments", web: "payments" },
  repentance: { ios: "arrow.uturn.backward.circle.fill", android: "undo", web: "undo" },
  rights: { ios: "person.2.fill", android: "people", web: "people" },
  character: { ios: "person.fill.checkmark", android: "verified_user", web: "verified_user" },
  reflection: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
  learning: { ios: "graduationcap.fill", android: "school", web: "school" },
};

const TOGGLE_ROWS: LastDayPreparationRowId[] = ["repentance", "character"];

type PreparationRowModel = ReturnType<typeof buildLastDayPreparation>["rows"][number];

/** In-place daily intention (ticks here, never navigates) — G-50. */
function IntentionToggleRow({
  row,
  today,
  onToggle,
}: {
  row: PreparationRowModel;
  today: string;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const repentance = useLastDayRepentanceChecked(today);
  const character = useLastDayCharacterChecked(today);
  const checked = row.id === "repentance" ? repentance : character;
  return (
    <JourneyIntentionRow
      icon={ROW_ICONS[row.id]}
      title={t(row.labelKey)}
      hint={tTv(t, row.hintKey, `${row.hintKey}Tv`)}
      checked={checked}
      onToggle={onToggle}
    />
  );
}

export default function LastDayPreparationScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const summary = useDailySummary();
  useEnsureLastDayProgressLoaded();
  const completedCount = useLastDayCompletedCount();
  const { toggleRepentance, toggleCharacter } = useLastDayProgressActions();
  const {
    version: contentVersion,
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureLastDayContent, isLastDayContentReady);
  const today = getLocalDateString();
  const wide = useLearnHubLayout();
  // Wide web / tablets: habit rows lay out two per row.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 320, max: 2 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildLastDayPreparation({
        summary,
        lessonsCompleted: completedCount,
        lessonsTotal: getLastDayLessonCount(),
        repentanceChecked: false,
        characterChecked: false,
        formatCount: (n) => n.toLocaleString(i18n.language),
      }),
    [summary, completedCount, i18n.language, contentVersion],
  );

  // Two kinds of row, two groups (G-50): trackers navigate away, intentions tick in place.
  const trackerRows = snapshot.rows.filter((row) => !TOGGLE_ROWS.includes(row.id));
  const intentionRows = snapshot.rows.filter((row) => TOGGLE_ROWS.includes(row.id));
  const toggle = (id: LastDayPreparationRowId) =>
    void (id === "repentance" ? toggleRepentance(today) : toggleCharacter(today));

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.preparationTitle")}
      subtitle={t("lastDay.preparationSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/last-day/preparation" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <Stagger>
          <JannahCallout tone="info">{t("lastDay.preparationIntro")}</JannahCallout>

          <Card>
            <SectionHeader
              title={t("lastDay.preparationHabitsTitle")}
              icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
              {tTv(t, "lastDay.preparationTrackersHint", "lastDay.preparationTrackersHintTv")}
            </ThemedText>
            <LearnColumnsGrid columns={columns} stackGap={0} style={styles.list}>
              {trackerRows.map((row) => (
                <JourneyMetricRow
                  key={row.id}
                  icon={ROW_ICONS[row.id]}
                  label={t(row.labelKey)}
                  value={row.value}
                  hint={tTv(t, row.hintKey, `${row.hintKey}Tv`)}
                  progress={row.progress}
                  tiled={columns > 1}
                  onPress={() => router.push(row.route)}
                />
              ))}
            </LearnColumnsGrid>
          </Card>

          {intentionRows.length ? (
            <Card>
              <SectionHeader
                title={t("lastDay.preparationIntentionsTitle")}
                icon={{
                  ios: "checkmark.circle.fill",
                  android: "check_circle",
                  web: "check_circle",
                }}
              />
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
                {t("lastDay.preparationIntentionsHint")}
              </ThemedText>
              <LearnColumnsGrid columns={columns} style={styles.list}>
                {intentionRows.map((row) => (
                  <IntentionToggleRow
                    key={row.id}
                    row={row}
                    today={today}
                    onToggle={() => toggle(row.id)}
                  />
                ))}
              </LearnColumnsGrid>
            </Card>
          ) : null}

          <JannahDisclaimer textKey="lastDay.preparationDisclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one },
  list: { marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/last-day/preparation");
