import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { RoundState } from "@/lib/tasbeeh/rounds";

/** The line under a count on every face: "of 33", "Complete" or "unlimited". */
export function targetCaption(t: TFunction, target: number, complete: boolean): string {
  if (target <= 0) return t("tasbeehUi.unlimited");
  return complete ? t("tasbeehUi.complete") : t("tasbeehUi.ofTarget", { target });
}

type ReadoutColors = { count: string; caption: string; complete: string };

/**
 * Count readout shared by the faces that draw their own scene (misbaha and the
 * round-based v2 faces): the count, the target caption and an optional detail
 * line (round, strand size). Decorative — the shell's stage button carries the
 * accessible value.
 */
export function CountReadout({
  count,
  target,
  complete,
  detail,
  compact = false,
  colors: override,
}: {
  count: number;
  target: number;
  complete: boolean;
  /** Third line, e.g. "Round 2 · 7 of 33" or "99-bead strand". */
  detail?: string;
  /** Smaller numerals (the count sits inside a shape). */
  compact?: boolean;
  /** Fixed colours for faces that sit the count on their own backdrop. */
  colors?: ReadoutColors;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const countColor = complete
    ? (override?.complete ?? tokens.status.success.color)
    : override?.count;
  const captionStyle = override ? { color: override.caption } : undefined;
  const captionColor = override ? undefined : "mutedForeground";
  return (
    <View style={styles.readout} pointerEvents="none">
      {complete && !override ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: tokens.status.success.soft, borderRadius: Radius.pill },
          ]}
        />
      ) : null}
      <ThemedText
        type={compact ? "subtitle" : "display"}
        style={[styles.count, countColor ? { color: countColor } : null]}
      >
        {count}
      </ThemedText>
      <ThemedText type="caption" themeColor={captionColor} style={captionStyle}>
        {targetCaption(t, target, complete)}
      </ThemedText>
      {detail ? (
        <ThemedText type="caption" themeColor={captionColor} style={captionStyle}>
          {detail}
        </ThemedText>
      ) : null}
    </View>
  );
}

/**
 * {@link CountReadout} for the round-based v2 faces (pebbles, fingers, rosette,
 * night sky): adds the round line when the target spans more than one round.
 */
export function RoundReadout({
  round,
  ...props
}: Omit<Parameters<typeof CountReadout>[0], "detail"> & { round: RoundState }) {
  const { t } = useTranslation();
  const multiRound = props.target <= 0 || props.target > round.size;
  const detail = multiRound
    ? t("tasbeehDesigns.round", { lap: round.lap, done: round.done, size: round.size })
    : undefined;
  return <CountReadout {...props} detail={detail} />;
}

const styles = StyleSheet.create({
  readout: {
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  count: {
    fontVariant: ["tabular-nums"],
  },
});
