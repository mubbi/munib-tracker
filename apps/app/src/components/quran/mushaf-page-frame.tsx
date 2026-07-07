import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type MushafPageFrameProps = {
  children: ReactNode;
  /** Rendered as a small centered page number beneath the frame (like a printed mushaf). */
  page?: number;
  /** Optional overlay (e.g. a font-loading spinner) rendered above the framed content. */
  overlay?: ReactNode;
};

/**
 * A decorative "physical page" surface shared by both Qur'an reader layouts
 * (flowing page view + 15-line mushaf). A double ruled border evokes a printed
 * mushaf frame and the centered page number sits beneath it, so every page feels
 * like a real Qur'an leaf rather than a plain card.
 */
export function MushafPageFrame({ children, page, overlay }: MushafPageFrameProps) {
  const { colors, tokens } = useThemeTokens();

  return (
    <Card padding="two" style={styles.card}>
      {overlay}
      <View style={[styles.frameOuter, { borderColor: tokens.accentBorder }]}>
        <View style={[styles.frameInner, { borderColor: tokens.hairline }]}>{children}</View>
      </View>
      {page != null ? (
        <View style={styles.pageNumberWrap}>
          <View
            style={[
              styles.pageNumber,
              { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
            ]}
          >
            <ThemedText type="caption" style={{ color: colors.accent }}>
              {page}
            </ThemedText>
          </View>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  frameOuter: {
    flex: 1,
    minHeight: 440,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    padding: Spacing.one,
  },
  frameInner: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  pageNumberWrap: {
    alignItems: "center",
    marginTop: Spacing.two,
  },
  pageNumber: {
    minWidth: 40,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
});
