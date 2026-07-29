import type { ReactNode } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type MushafPageFrameProps = {
  children: ReactNode;
  /** Rendered as a gilt page medallion beneath the frame (like a printed mushaf). */
  page?: number;
  /** Optional overlay (e.g. a font-loading spinner) rendered above the framed content. */
  overlay?: ReactNode;
  /**
   * When true the framed column stretches to fill the available height so its
   * content can be vertically justified (the 15-line mushaf). Page view leaves
   * this off so the leaf grows naturally with the flowing text.
   */
  fill?: boolean;
};

/** A small gilt lozenge that anchors each corner of the illuminated border. */
function CornerLozenge({ color, style }: { color: string; style: StyleProp<ViewStyle> }) {
  return <View style={[styles.lozenge, { backgroundColor: color }, style]} />;
}

/**
 * The "physical page" every Qur'an reading layout sits on. A warm parchment leaf
 * inside a gilt, double-ruled illuminated border with lozenge cornerstones and a
 * centered page medallion — so each screen reads like a real mushaf leaf rather
 * than an app card. The gold is constant across UI accents (see `Mushaf`).
 */
export function MushafPageFrame({ children, page, overlay, fill }: MushafPageFrameProps) {
  const { tokens } = useThemeTokens();
  const { mushaf } = tokens;

  return (
    <View style={[styles.root, fill && styles.rootFill]}>
      <View
        style={[
          styles.leaf,
          fill && styles.leafFill,
          { backgroundColor: mushaf.paper, borderColor: mushaf.frame },
        ]}
      >
        <CornerLozenge color={mushaf.frame} style={styles.lzTopStart} />
        <CornerLozenge color={mushaf.frame} style={styles.lzTopEnd} />
        <CornerLozenge color={mushaf.frame} style={styles.lzBottomStart} />
        <CornerLozenge color={mushaf.frame} style={styles.lzBottomEnd} />
        {overlay}
        <View style={[styles.inner, fill && styles.innerFill, { borderColor: mushaf.frameSoft }]}>
          {children}
        </View>
      </View>
      {page != null ? (
        <View style={styles.medallionWrap}>
          <View style={[styles.rule, { backgroundColor: mushaf.bandBorder }]} />
          <View
            style={[
              styles.medallion,
              { backgroundColor: mushaf.bandFill, borderColor: mushaf.bandBorder },
            ]}
          >
            <ThemedText type="caption" style={{ color: mushaf.ink }}>
              {page}
            </ThemedText>
          </View>
          <View style={[styles.rule, { backgroundColor: mushaf.bandBorder }]} />
        </View>
      ) : null}
    </View>
  );
}

const CORNER = 12;
const CORNER_INSET = -CORNER / 2 + 1.25;

const styles = StyleSheet.create({
  root: { width: "100%" },
  rootFill: { flexGrow: 1 },
  leaf: {
    width: "100%",
    minHeight: 460,
    borderWidth: 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    padding: Spacing.two,
    ...Shadows.sm,
  },
  // Grow to fill the viewport when short, but expand with tall content instead
  // of clipping — so vertically-justified lines never spill past the border.
  leafFill: { flexGrow: 1 },
  inner: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.sm - 3,
    borderCurve: "continuous",
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  innerFill: { flexGrow: 1 },
  lozenge: {
    position: "absolute",
    width: CORNER,
    height: CORNER,
    borderRadius: 2,
    transform: [{ rotate: "45deg" }],
    zIndex: 2,
  },
  lzTopStart: { top: CORNER_INSET, start: CORNER_INSET },
  lzTopEnd: { top: CORNER_INSET, end: CORNER_INSET },
  lzBottomStart: { bottom: CORNER_INSET, start: CORNER_INSET },
  lzBottomEnd: { bottom: CORNER_INSET, end: CORNER_INSET },
  medallionWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  rule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    maxWidth: 72,
  },
  medallion: {
    minWidth: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.half,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
});
