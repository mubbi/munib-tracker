import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { PracticeSummary } from "@/lib/quran-companion/types";

/** Word totals for a finished session, folded the way the copy talks about them. */
export type SummaryOutcome = {
  listened: boolean;
  heard: number;
  /** Includes unconfirmed mismatches when the engine cannot confirm them. */
  notSure: number;
  tryAgain: number;
  missed: number;
  total: number;
  /** The listener ran but caught no words at all (or the person ended before reciting). */
  nothingHeard: boolean;
};

export function summaryOutcome(summary: PracticeSummary): SummaryOutcome {
  const listened = summary.engine === "none";
  const heard = summary.matched + summary.corrected;
  const unconfirmed = !!summary.mismatchesUnconfirmed;
  const notSure = summary.uncertain + (unconfirmed ? summary.confirmedMismatch : 0);
  const tryAgain = unconfirmed ? 0 : summary.confirmedMismatch;
  const missed = summary.notReached;
  return {
    listened,
    heard,
    notSure,
    tryAgain,
    missed,
    total: heard + notSure + tryAgain + missed,
    nothingHeard: !listened && heard === 0 && notSure === 0 && tryAgain === 0,
  };
}

export type SummaryAction = {
  label: string;
  icon: SymbolViewProps["name"];
  onPress: () => void;
};

/**
 * Session summary card (§9.3): a headline, a proportion bar and the counts, the
 * next step, and the ayahs worth another go. Soft wording only. No percentage, no
 * score, no streak. A session where nothing was heard shows a tip, not a row of zeros.
 */
export function PracticeSessionSummary({
  summary,
  primary,
  secondary,
  onHear,
  onOpenAyah,
  progress,
}: {
  summary: PracticeSummary;
  primary: SummaryAction;
  /** Move on when the primary is a retry; otherwise "Practise again" (the whole passage). */
  secondary: SummaryAction | null;
  onHear: () => void;
  onOpenAyah: (ayah: number) => void;
  /** Revision sitting position, 1-based. */
  progress: { n: number; total: number } | null;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const o = summaryOutcome(summary);
  const { success, warning, danger } = tokens.status;

  const tone = o.listened
    ? success
    : o.nothingHeard
      ? warning
      : o.tryAgain > 0
        ? danger
        : o.notSure > 0 || o.missed > 0
          ? warning
          : success;

  const headline = o.listened
    ? t("quranCompanion.summary.headListened")
    : o.nothingHeard
      ? t("quranCompanion.result.headNothingHeard")
      : o.tryAgain > 0
        ? t("quranCompanion.result.headTryAgain", { count: o.tryAgain })
        : o.missed > 0
          ? t("quranCompanion.result.headMissed", { count: o.missed })
          : o.notSure > 0
            ? t("quranCompanion.result.headNotSure", { count: o.notSure })
            : t("quranCompanion.result.headAllMatched");

  const sub = o.listened
    ? t("quranCompanion.summary.listened")
    : o.nothingHeard
      ? t("quranCompanion.result.nothingHeardTip")
      : t("quranCompanion.result.heardOf", { heard: o.heard, total: o.total });

  const icon: SymbolViewProps["name"] = o.listened
    ? { ios: "headphones", android: "headphones", web: "headphones" }
    : o.nothingHeard
      ? { ios: "mic.slash.fill", android: "mic_off", web: "mic_off" }
      : tone === success
        ? { ios: "checkmark", android: "check", web: "check" }
        : { ios: "arrow.counterclockwise", android: "replay", web: "replay" };

  const showStats = !o.listened && !o.nothingHeard && o.total > 0;
  const segments = [
    { key: "matched", value: o.heard, color: success.color },
    { key: "tryAgain", value: o.tryAgain, color: danger.color },
    { key: "notSure", value: o.notSure, color: warning.color },
    { key: "missed", value: o.missed, color: colors.border },
  ].filter((s) => s.value > 0);

  const multiAyah = summary.ayahEnd > summary.ayahStart;
  const weak = !o.listened && multiAyah ? summary.weakAyahs : [];

  return (
    <Card padding="four" style={{ borderColor: tone.border, borderWidth: 1 }}>
      <View style={styles.head}>
        <View style={[styles.badge, { backgroundColor: tone.soft }]}>
          <SymbolView name={icon} size={24} tintColor={tone.color} />
        </View>
        <View style={styles.flex}>
          <ThemedText type="subtitle" style={styles.headline}>
            {headline}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {sub}
          </ThemedText>
        </View>
      </View>

      {showStats ? (
        <>
          <View
            style={[styles.bar, { backgroundColor: colors.muted }]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {segments.map(({ key, value: flex, color }) => (
              <View key={key} style={{ flex, backgroundColor: color }} />
            ))}
          </View>
          <View style={styles.stats}>
            <Stat
              label={t("quranCompanion.result.matched")}
              value={o.heard}
              color={success.text}
              dot={success.color}
            />
            {summary.mismatchesUnconfirmed ? null : (
              <Stat
                label={t("quranCompanion.result.tryAgain")}
                value={o.tryAgain}
                color={danger.text}
                dot={danger.color}
              />
            )}
            <Stat
              label={t("quranCompanion.result.notSure")}
              value={o.notSure}
              color={warning.text}
              dot={warning.color}
            />
            <Stat
              label={t("quranCompanion.result.missed")}
              value={o.missed}
              color={colors.foreground}
              dot={colors.mutedForeground}
            />
          </View>
        </>
      ) : null}

      {weak.length > 0 ? (
        <View style={[styles.group, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <ThemedText type="caption" style={[styles.groupTitle, { color: colors.foreground }]}>
            {t("quranCompanion.summary.weakAyahsTitle")}
          </ThemedText>
          <View style={styles.chips}>
            {weak.map((ayah) => (
              <PressableScale
                key={ayah}
                haptic="light"
                accessibilityRole="button"
                accessibilityLabel={t("quranCompanion.summary.practiseAyah", { ayah })}
                onPress={() => onOpenAyah(ayah)}
                style={[styles.chip, { backgroundColor: tone.soft, borderColor: tone.border }]}
              >
                <SymbolView
                  name={{ ios: "mic.fill", android: "mic", web: "mic" }}
                  size={12}
                  tintColor={tone.color}
                />
                <ThemedText type="smallBold">
                  {t("quranCompanion.summary.ayahChip", { ayah })}
                </ThemedText>
              </PressableScale>
            ))}
          </View>
        </View>
      ) : null}

      {progress ? (
        <View style={styles.progress}>
          <View style={styles.progressHead}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quranCompanion.revision.title")}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quranCompanion.revision.sittingProgress", progress)}
            </ThemedText>
          </View>
          <View
            style={[styles.progressTrack, { backgroundColor: colors.muted }]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <View
              style={{
                width: `${(progress.n / Math.max(progress.total, 1)) * 100}%`,
                backgroundColor: colors.accent,
                borderRadius: 3,
              }}
            />
          </View>
        </View>
      ) : null}

      <Button
        label={primary.label}
        icon={primary.icon}
        onPress={primary.onPress}
        fullWidth
        style={styles.primary}
      />
      <View style={styles.actions}>
        <Button
          label={t("quranCompanion.summary.hearAyah")}
          variant="secondary"
          onPress={onHear}
          icon={{ ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }}
          style={styles.flex}
        />
        {secondary ? (
          <Button
            label={secondary.label}
            variant="secondary"
            onPress={secondary.onPress}
            icon={secondary.icon}
            style={styles.flex}
          />
        ) : null}
      </View>
    </Card>
  );
}

function Stat({
  label,
  value,
  color,
  dot,
}: {
  label: string;
  value: number;
  color: string;
  dot: string;
}) {
  return (
    <View
      style={[styles.stat, value === 0 ? styles.statZero : null]}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <ThemedText type="subtitle" style={{ color }}>
        {value}
      </ThemedText>
      <View style={styles.statLabel}>
        <View style={[styles.dot, { backgroundColor: dot }]} />
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {label}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  head: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  headline: { fontSize: 20, lineHeight: 26 },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  bar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    gap: 2,
    marginTop: Spacing.four,
  },
  stats: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.three },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statZero: { opacity: 0.45 },
  statLabel: { flexDirection: "row", alignItems: "center", gap: 4, maxWidth: "100%" },
  dot: { width: 6, height: 6, borderRadius: 3 },
  group: {
    marginTop: Spacing.three,
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  groupTitle: { fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  progress: { marginTop: Spacing.three, gap: Spacing.one },
  progressHead: { flexDirection: "row", justifyContent: "space-between" },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden", flexDirection: "row" },
  primary: { marginTop: Spacing.four },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
});
