import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicWordRowStyle } from "@/lib/quran-companion/arabic-row";
import { type AyahPracticeState, countWords } from "@/lib/quran-companion/reduce-session";
import type { FeedbackTiming } from "@/lib/quran-companion/types";
import { chevronForward, useIsRTL } from "@/lib/rtl";

/**
 * What happened in the take that just ended (§9.2 "after each ayah"): a headline,
 * a proportion bar + counts, the actual words in each group (tap to hear one), and
 * the next step. Soft wording only — "try again", "not sure", "not reached"; never
 * "wrong" or a score. A take where nothing was heard gets its own tip instead of
 * a wall of zeros.
 */
export function PracticeAyahResult({
  ayah,
  timing,
  isLast,
  canFinish,
  onNext,
  onRetry,
  onHear,
  onHearWord,
  onFinish,
}: {
  ayah: AyahPracticeState;
  timing: FeedbackTiming;
  isLast: boolean;
  canFinish: boolean;
  onNext: () => void;
  onRetry: () => void;
  onHear: () => void;
  onHearWord: (index: number) => void;
  onFinish: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const rtl = useIsRTL();
  const c = countWords(ayah);
  const total = ayah.words.length || 1;
  const heard = c.matched + c.corrected;
  const showWords = timing !== "end";

  const indexes = (state: string) =>
    ayah.states.map((s, i) => (s === state ? i : -1)).filter((i) => i >= 0);
  const tryAgain = indexes("confirmedMismatch");
  const notSure = indexes("uncertain");
  const missed = indexes("upcoming");
  const nothingHeard = heard === 0 && tryAgain.length === 0 && notSure.length === 0;

  const tone = nothingHeard
    ? tokens.status.warning
    : tryAgain.length > 0
      ? tokens.status.danger
      : notSure.length > 0 || missed.length > 0
        ? tokens.status.warning
        : tokens.status.success;
  const allGood = tone === tokens.status.success;
  const headline = nothingHeard
    ? t("quranCompanion.result.headNothingHeard")
    : tryAgain.length > 0
      ? t("quranCompanion.result.headTryAgain", { count: tryAgain.length })
      : missed.length > 0
        ? t("quranCompanion.result.headMissed", { count: missed.length })
        : notSure.length > 0
          ? t("quranCompanion.result.headNotSure", { count: notSure.length })
          : t("quranCompanion.result.headAllMatched");
  const icon: SymbolViewProps["name"] = nothingHeard
    ? { ios: "mic.slash.fill", android: "mic_off", web: "mic_off" }
    : allGood
      ? { ios: "checkmark", android: "check", web: "check" }
      : { ios: "arrow.counterclockwise", android: "replay", web: "replay" };

  const segments = [
    { key: "matched", value: heard, color: tokens.status.success.color },
    { key: "tryAgain", value: c.confirmedMismatch, color: tokens.status.danger.color },
    { key: "notSure", value: c.uncertain, color: tokens.status.warning.color },
    { key: "missed", value: c.notReached, color: colors.border },
  ].filter((s) => s.value > 0);

  const group = (title: string, list: number[], color: string, soft: string) =>
    list.length > 0 && showWords ? (
      <View style={[styles.group, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <View style={styles.groupHead}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <ThemedText type="caption" style={[styles.groupTitle, { color: colors.foreground }]}>
            {title}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {list.length}
          </ThemedText>
        </View>
        <View style={[styles.words, arabicWordRowStyle(rtl)]}>
          {list.map((i) => (
            <PressableScale
              key={`${i}:${ayah.words[i]}`}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={`${ayah.words[i]}, ${t("quranCompanion.word.tapToHear")}`}
              onPress={() => onHearWord(i)}
              style={[styles.wordChip, { backgroundColor: soft, borderColor: color }]}
            >
              <ThemedText type="arabic" style={styles.wordText}>
                {ayah.words[i]}
              </ThemedText>
              <SymbolView
                name={{ ios: "speaker.wave.2", android: "volume_up", web: "volume_up" }}
                size={12}
                tintColor={color}
              />
            </PressableScale>
          ))}
        </View>
      </View>
    ) : null;

  const link = (label: string, onPress: () => void, disabled?: boolean) => (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.link, disabled ? styles.disabled : null]}
    >
      <ThemedText type="smallBold" themeColor="mutedForeground">
        {label}
      </ThemedText>
      <SymbolView name={chevronForward()} size={12} tintColor={colors.mutedForeground} />
    </PressableScale>
  );

  return (
    <Card padding="three" style={{ borderColor: tone.border, borderWidth: 1 }}>
      <View style={styles.head}>
        <View style={[styles.badge, { backgroundColor: tone.soft }]}>
          <SymbolView name={icon} size={20} tintColor={tone.color} />
        </View>
        <View style={styles.flex}>
          <ThemedText type="smallBold">{headline}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {nothingHeard
              ? t("quranCompanion.result.nothingHeardTip")
              : t("quranCompanion.result.heardOf", { heard, total })}
          </ThemedText>
        </View>
      </View>

      {nothingHeard ? null : (
        <>
          <View
            style={[styles.bar, { backgroundColor: colors.muted }]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {segments.map((s) => (
              <View key={s.key} style={{ flex: s.value, backgroundColor: s.color }} />
            ))}
          </View>
          <View style={styles.stats}>
            <Stat
              label={t("quranCompanion.result.matched")}
              value={heard}
              color={tokens.status.success.color}
            />
            <Stat
              label={t("quranCompanion.result.tryAgain")}
              value={c.confirmedMismatch}
              color={tokens.status.danger.color}
            />
            <Stat
              label={t("quranCompanion.result.notSure")}
              value={c.uncertain}
              color={tokens.status.warning.color}
            />
            <Stat
              label={t("quranCompanion.result.missed")}
              value={c.notReached}
              color={colors.foreground}
            />
          </View>

          {group(
            t("quranCompanion.result.groupTryAgain"),
            tryAgain,
            tokens.status.danger.color,
            tokens.status.danger.soft,
          )}
          {group(
            t("quranCompanion.result.groupNotSure"),
            notSure,
            tokens.status.warning.color,
            tokens.status.warning.soft,
          )}
          {group(
            t("quranCompanion.result.groupMissed"),
            missed,
            colors.mutedForeground,
            colors.card,
          )}
        </>
      )}

      <View style={styles.actions}>
        {allGood ? (
          isLast ? (
            <Button
              label={t("quranCompanion.result.finish")}
              onPress={onFinish}
              disabled={!canFinish}
              style={styles.flex}
            />
          ) : (
            <Button
              label={t("quranCompanion.result.nextAyah")}
              onPress={onNext}
              style={styles.flex}
              icon={{ ios: "arrow.forward", android: "arrow_forward", web: "arrow_forward" }}
            />
          )
        ) : (
          <Button
            label={t("quranCompanion.result.reciteAgain")}
            onPress={onRetry}
            style={styles.flex}
            icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
          />
        )}
        <Button
          label={t("quranCompanion.dock.hear")}
          variant="secondary"
          onPress={onHear}
          icon={{ ios: "speaker.wave.2.fill", android: "volume_up", web: "volume_up" }}
        />
      </View>
      {!allGood ? (
        <View style={styles.secondary}>
          {isLast
            ? link(t("quranCompanion.result.finish"), onFinish, !canFinish)
            : link(t("quranCompanion.result.moveOn"), onNext)}
        </View>
      ) : null}
    </Card>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  const zero = value === 0;
  return (
    <View
      style={[styles.stat, zero ? styles.statZero : null]}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <ThemedText type="subtitle" style={{ color }}>
        {value}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  head: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bar: {
    flexDirection: "row",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    gap: 2,
    marginTop: Spacing.three,
  },
  stats: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.two },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statZero: { opacity: 0.45 },
  group: {
    marginTop: Spacing.three,
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  groupHead: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  groupTitle: { flex: 1, fontWeight: "600" },
  dot: { width: 8, height: 8, borderRadius: 4 },
  words: { flexWrap: "wrap", gap: Spacing.one },
  wordChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  wordText: { fontSize: 20, lineHeight: 34, writingDirection: "rtl" },
  actions: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.three },
  secondary: { alignItems: "center", marginTop: Spacing.two },
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  disabled: { opacity: 0.5 },
});
