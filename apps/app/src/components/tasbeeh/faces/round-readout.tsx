import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { RoundState } from "@/lib/tasbeeh/rounds";

/**
 * Count readout shared by the round-based v2 faces (pebbles, fingers, rosette):
 * the count, "of N" / unlimited, and a round line when the target spans more
 * than one round. Decorative — the shell's stage button carries the a11y value.
 */
export function RoundReadout({
  count,
  target,
  complete,
  round,
  compact = false,
  colors: override,
}: {
  count: number;
  target: number;
  complete: boolean;
  round: RoundState;
  /** Smaller numerals (the count sits inside a shape). */
  compact?: boolean;
  /** Fixed colours for faces with their own backdrop (the night sky). */
  colors?: { count: string; caption: string; complete: string };
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const multiRound = target <= 0 || target > round.size;
  const countColor = complete
    ? (override?.complete ?? tokens.status.success.color)
    : override?.count;
  const captionStyle = override ? { color: override.caption } : undefined;
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
      <ThemedText
        type="caption"
        themeColor={override ? undefined : "mutedForeground"}
        style={captionStyle}
      >
        {target > 0 ? t("tasbeehUi.ofTarget", { target }) : t("tasbeehUi.unlimited")}
      </ThemedText>
      {multiRound ? (
        <ThemedText
          type="caption"
          themeColor={override ? undefined : "mutedForeground"}
          style={captionStyle}
        >
          {t("tasbeehDesigns.round", { lap: round.lap, done: round.done, size: round.size })}
        </ThemedText>
      ) : null}
    </View>
  );
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
