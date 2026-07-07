import { type Href, useRouter } from "expo-router";
import { goBackOrReplace } from "@/lib/navigation";
import { SymbolView } from "expo-symbols";
import { useCallback, useMemo } from "react";
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
import { buildJahannamJourney, type JahannamJourneyRow } from "@/lib/jahannam-journey";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { chevronForward } from "@/lib/rtl";
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
  const { colors, tokens } = useThemeTokens();
  const checked = useJahannamIntention(id);
  const { toggle } = useJahannamIntentionActions();

  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={t(`jahannam.intentions.${id}`)}
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
          {t(`jahannam.intentions.${id}`)}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(`jahannam.intentions.${id}Hint`)}
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

function MetricRow({ row, onPress }: { row: JahannamJourneyRow; onPress: () => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

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
      <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

export default function JahannamJourneyScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  useEnsureJahannamIntentionsLoaded();

  const summary = useDailySummary();
  const intentionsSet = useJahannamIntentionsCount();
  const reflectionStreak = useJahannamReflectionStreak();

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
      onBack={() => (goBackOrReplace(router, "/jahannam" as Href))}
    >
      <Seo path="/jahannam/journey" />
      <Stagger>
        <JannahCallout tone="accent">{t("jahannam.journeyBanner")}</JannahCallout>

        <Card padding="three">
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
          <View style={styles.rows}>
            {snapshot.rows.map((row) => (
              <MetricRow key={row.id} row={row} onPress={() => router.push(row.route)} />
            ))}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("jahannam.intentionsTitle")}
            icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.intentionsHint}>
            {t("jahannam.intentionsHint")}
          </ThemedText>
          <View style={styles.intentions}>
            {JAHANNAM_INTENTION_IDS.map((id) => (
              <IntentionRow key={id} id={id} />
            ))}
          </View>
        </Card>

        <JannahDisclaimer textKey="jahannam.journeyDisclaimer" />
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
