import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { VoiceTeachState } from "@/hooks/use-voice-tasbeeh";

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
};

/**
 * Teaching a zikr (NF-3.20, D50): live feedback while the person says it —
 * a level meter, "Got it 1/3" with one dot per sample, and a gentle note when a
 * sample can't be used. Counting starts by itself after the last sample; "Done"
 * keeps what was heard so far. Nothing here animates (reduced-motion safe).
 */
export function VoiceTeachPanel({ teach, label, level, speaking, onDone, onCancel }: Props) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const issue = teach.issue ? t(ISSUE_COPY[teach.issue]) : null;
  const prompt = label
    ? t("tasbeehVoice.teach.sayNow", { phrase: label })
    : t("tasbeehVoice.teach.sayNowOther");

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: withAlpha(colors.accent, tokens.isDark ? 0.4 : 0.25),
        },
      ]}
    >
      <ThemedText type="smallBold" style={{ color: colors.accentText }}>
        {prompt}
      </ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("tasbeehVoice.teach.pauseBetween")}
      </ThemedText>

      <View style={styles.row}>
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
      </View>

      <View style={styles.row}>
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
      </View>

      {issue ? (
        <ThemedText
          type="caption"
          accessibilityLiveRegion="polite"
          style={{ color: tokens.status.warning.color }}
        >
          {issue}
        </ThemedText>
      ) : null}

      <View style={styles.actions}>
        <Button
          label={t("tasbeehVoice.teach.cancel")}
          variant="ghost"
          onPress={onCancel}
          style={styles.action}
        />
        <Button
          label={t("tasbeehVoice.teach.done")}
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
    borderWidth: StyleSheet.hairlineWidth,
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
    borderWidth: 1.5,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  action: {
    flex: 1,
  },
});
