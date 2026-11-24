import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { muhasabahPromptLabel } from "@/components/muhasabah/prompt-label";
import { ScreenLayout } from "@/components/screen-layout";
import { PhoneOnlyNotice } from "@/components/self-review/phone-only-notice";
import { VaultStateNotice } from "@/components/self-review/vault-state-notice";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { VaultLockGate } from "@/components/vault";
import { Radius, Spacing } from "@/constants/theme";
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { MUHASABAH_TREND_DAYS, promptTrends } from "@/lib/muhasabah/logic";
import { muhasabahDayKey } from "@/lib/muhasabah/model";
import { muhasabahActions, useMuhasabah } from "@/lib/muhasabah/muhasabah-store";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** One stacked bar per prompt: Yes / Partly / No counts over 30 days. No overall score. */
function TrendBar({ yes, partly, no }: { yes: number; partly: number; no: number }) {
  const { colors, tokens } = useThemeTokens();
  const total = yes + partly + no;
  if (total === 0) return <View style={[styles.bar, { backgroundColor: colors.muted }]} />;
  return (
    <View style={[styles.bar, { backgroundColor: colors.muted }]}>
      <View style={{ flex: yes, backgroundColor: tokens.status.success.color }} />
      <View style={{ flex: partly, backgroundColor: tokens.status.warning.color }} />
      <View style={{ flex: no, backgroundColor: tokens.status.info.color }} />
    </View>
  );
}

function HistoryContent() {
  const { t } = useTranslation();
  const { formatIso } = useFormatCalendarDate();
  const { config, entries, status, error } = useMuhasabah();
  const [pendingDelete, setPendingDelete] = useState<string | "all" | null>(null);
  const today = muhasabahDayKey(new Date());
  const trends = useMemo(
    () => promptTrends(entries, config.prompts, today),
    [entries, config.prompts, today],
  );

  if (status === "locked" || status === "error") {
    return <VaultStateNotice status={status} error={error} />;
  }
  if (status !== "ready") return null;
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={{ ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" }}
        title={t("muhasabah.history.emptyTitle")}
        description={t("muhasabah.history.emptyBody")}
      />
    );
  }

  return (
    <View style={styles.stack}>
      <Card padding="three">
        <SectionHeader
          title={t("muhasabah.history.trendsTitle", { days: MUHASABAH_TREND_DAYS })}
          subtitle={t("muhasabah.history.trendsSub")}
          icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
        />
        <View style={styles.trends}>
          {trends.map(({ promptId, tally, answered }) => (
            <View
              key={promptId}
              style={styles.trend}
              accessible
              accessibilityLabel={t("muhasabah.history.trendA11y", {
                prompt: muhasabahPromptLabel(t, promptId, config),
                yes: tally.yes,
                partly: tally.partly,
                no: tally.no,
              })}
            >
              <ThemedText type="small">{muhasabahPromptLabel(t, promptId, config)}</ThemedText>
              <TrendBar {...tally} />
              <ThemedText type="caption" themeColor="mutedForeground">
                {answered === 0
                  ? t("muhasabah.history.noAnswers")
                  : t("muhasabah.history.counts", {
                      yes: tally.yes,
                      partly: tally.partly,
                      no: tally.no,
                    })}
              </ThemedText>
            </View>
          ))}
        </View>
      </Card>

      {entries.map((entry) => (
        <Card key={entry.date} padding="three">
          <View style={styles.entry}>
            <ThemedText type="smallBold">{formatIso(entry.date)}</ThemedText>
            {Object.entries(entry.answers).map(([id, answer]) => (
              <ThemedText key={id} type="caption" themeColor="mutedForeground">
                {t("muhasabah.history.answerLine", {
                  prompt: muhasabahPromptLabel(t, id as never, config),
                  answer: t(`muhasabah.answers.${answer}`),
                })}
              </ThemedText>
            ))}
            {entry.gratitude ? (
              <ThemedText type="small">
                {t("muhasabah.history.gratitude", { text: entry.gratitude })}
              </ThemedText>
            ) : null}
            {entry.repentNote ? (
              <ThemedText type="small">
                {t("muhasabah.history.repent", { text: entry.repentNote })}
              </ThemedText>
            ) : entry.repented ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("muhasabah.history.repentFact")}
              </ThemedText>
            ) : null}
            {entry.intention ? (
              <ThemedText type="small">
                {t("muhasabah.history.intention", { text: entry.intention })}
              </ThemedText>
            ) : null}
            <Button
              label={t("muhasabah.history.delete")}
              variant="ghost"
              size="sm"
              onPress={() => setPendingDelete(entry.date)}
            />
          </View>
        </Card>
      ))}

      <Button
        label={t("muhasabah.history.deleteAll")}
        variant="secondary"
        onPress={() => setPendingDelete("all")}
      />

      <ConfirmDialog
        visible={pendingDelete != null}
        title={
          pendingDelete === "all"
            ? t("muhasabah.history.deleteAllTitle")
            : t("muhasabah.history.deleteTitle")
        }
        message={t("muhasabah.history.deleteBody")}
        confirmLabel={t("muhasabah.history.deleteConfirm")}
        destructive
        onConfirm={() => {
          const target = pendingDelete;
          setPendingDelete(null);
          if (target === "all") void muhasabahActions.removeAllEntries();
          else if (target) void muhasabahActions.removeEntry(target);
        }}
        onClose={() => setPendingDelete(null)}
      />
    </View>
  );
}

export default function MuhasabahHistoryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenLayout
      eyebrow={t("muhasabah.eyebrow")}
      title={t("muhasabah.history.title")}
      subtitle={t("muhasabah.history.subtitle")}
      onBack={() => goBackOrReplace(router, "/muhasabah")}
    >
      <Seo path="/muhasabah/history" />
      {isTV() ? (
        <PhoneOnlyNotice />
      ) : (
        <VaultLockGate>
          <HistoryContent />
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  trends: { gap: Spacing.three, marginTop: Spacing.three },
  trend: { gap: Spacing.one },
  bar: {
    flexDirection: "row",
    height: 10,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  entry: { gap: Spacing.one },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/muhasabah/history");
