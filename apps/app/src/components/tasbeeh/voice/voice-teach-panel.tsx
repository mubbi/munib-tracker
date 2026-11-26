import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { VoiceTeachState } from "@/hooks/use-voice-tasbeeh";

const DONE_ICON = { ios: "checkmark", android: "check", web: "check" } as const;

const ISSUE_COPY = {
  "too-short": "tasbeehVoice.teach.issueShort",
  "too-long": "tasbeehVoice.teach.issueLong",
  different: "tasbeehVoice.teach.issueDifferent",
} as const;

type Props = {
  teach: VoiceTeachState;
  /** What to say (dataset title or the user's own title); null = "Something else". */
  label: string | null;
  /** 0–1 */
  level: number;
  speaking: boolean;
  onDone: () => void;
  onCancel: () => void;
  compact?: boolean;
};

/**
 * Teaching a zikr (NF-3.20, D50): live feedback while the person says it three
 * times — a level meter, "Got it 1/3" with one dot per sample, and a gentle note
 * when a sample can't be used. Counting starts by itself after the third sample;
 * "Done" (short, with a check, as wide as Cancel) keeps what was heard so far.
 * `compact`: the tight step-flow layout (guided session dock) — prompt, meter,
 * dots and progress on one line. Nothing here animates (reduced-motion safe).
 */
export function VoiceTeachPanel({
  teach,
  label,
  level,
  speaking,
  onDone,
  onCancel,
  compact = false,
}: Props) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const issue = teach.issue ? t(ISSUE_COPY[teach.issue]) : null;
  const prompt = label
    ? t("tasbeehVoice.teach.sayNow", { phrase: label })
    : t("tasbeehVoice.teach.sayNowOther");

  const meter = (
    <View
      style={[styles.meterTrack, { backgroundColor: withAlpha(colors.accent, 0.18) }]}
      accessibilityRole="progressbar"
      accessibilityLabel={t("tasbeehVoice.levelA11y")}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(level * 100) }}
    >
      <View
        style={[
          styles.meterFill,
          {
            width: `${Math.round(level * 100)}%`,
            backgroundColor: speaking ? colors.accent : withAlpha(colors.accent, 0.5),
          },
        ]}
      />
    </View>
  );
  const progress = (
    <>
      <View
        style={styles.dots}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {Array.from({ length: teach.target }, (_, i) => (
          <View
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length progress dots.
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i < teach.accepted ? colors.accent : "transparent",
                borderColor: colors.accent,
              },
            ]}
          />
        ))}
      </View>
      <ThemedText
        type="smallBold"
        accessibilityLiveRegion="polite"
        style={{ color: colors.accentText }}
      >
        {teach.accepted > 0
          ? t("tasbeehVoice.teach.progress", { heard: teach.accepted, total: teach.target })
          : t("tasbeehVoice.teach.listening")}
      </ThemedText>
    </>
  );

  return (
    <View
      testID="voice-teach-panel"
      style={[
        styles.panel,
        compact && styles.panelCompact,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: withAlpha(colors.accent, tokens.isDark ? 0.4 : 0.25),
        },
      ]}
    >
      <ThemedText type="smallBold" style={{ color: colors.accentText }}>
        {prompt}
      </ThemedText>
      {compact ? null : (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("tasbeehVoice.teach.pauseBetween")}
        </ThemedText>
      )}

      {/* Meter, sample dots and progress: one line when compact, two otherwise. */}
      {compact ? (
        <View style={styles.row}>
          {meter}
          {progress}
        </View>
      ) : (
        <>
          <View style={styles.row}>{meter}</View>
          <View style={styles.row}>{progress}</View>
        </>
      )}

      {issue ? (
        <ThemedText
          type="caption"
          accessibilityLiveRegion="polite"
          style={{ color: tokens.status.warning.onSoft }}
        >
          {issue}
        </ThemedText>
      ) : null}

      <View style={styles.actions}>
        <Button
          label={t("tasbeehVoice.teach.cancel")}
          variant="ghost"
          size={compact ? "sm" : undefined}
          onPress={onCancel}
          style={styles.action}
        />
        <Button
          label={t("tasbeehVoice.teach.doneShort")}
          icon={DONE_ICON}
          size={compact ? "sm" : undefined}
          onPress={onDone}
          disabled={teach.accepted === 0}
          style={styles.action}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  panelCompact: {
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  meterTrack: {
    flex: 1,
    height: 8,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  dots: {
    flexDirection: "row",
    gap: Spacing.one,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: BorderWidth.thick,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  /** Equal halves: the short "Done" never wraps and matches Cancel. */
  action: {
    flex: 1,
    flexBasis: 0,
  },
});
