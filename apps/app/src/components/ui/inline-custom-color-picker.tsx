import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import ColorPicker, { HueSlider, Panel1, Preview } from "reanimated-color-picker";

import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { normalizeHexForPicker } from "@/lib/color";

type Props = {
  value: string;
  onChange: (hex: string) => void;
};

/**
 * Inline saturation/hue picker — same UI on iOS, Android, and web.
 *
 * `ColorPicker` re-syncs its internal HSV state (via `setColor`) whenever its
 * `value` prop changes. If we pipe the picker's own `onChange` output back into
 * `value`, the HSV↔hex round-trip never lands on a stable fixed point, so
 * `value` keeps changing and React throws "Maximum update depth exceeded". To
 * avoid that, we treat `value` as a seed: the picker is only re-synced for
 * genuine external changes (tapping a preset/palette swatch), never for the
 * echo of a colour it just emitted.
 */
export function InlineCustomColorPicker({ value, onChange }: Props) {
  const { colors } = useThemeTokens();
  const incoming = normalizeHexForPicker(value);
  const lastEmitted = useRef<string | null>(null);
  const [seed, setSeed] = useState(incoming);
  const [display, setDisplay] = useState(incoming);

  useEffect(() => {
    if (incoming !== lastEmitted.current) {
      setSeed(incoming);
      setDisplay(incoming);
    }
  }, [incoming]);

  const handleChange = useCallback(
    ({ hex }: { hex: string }) => {
      const next = normalizeHexForPicker(hex);
      lastEmitted.current = next;
      setDisplay(next);
      onChange(next);
    },
    [onChange],
  );

  return (
    <View style={styles.block}>
      <View style={[styles.wrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hexLabel}>
          {display.toUpperCase()}
        </ThemedText>
        <ColorPicker value={seed} onChangeJS={handleChange} style={styles.picker}>
          <Preview style={styles.preview} />
          <Panel1 style={styles.panel} />
          <HueSlider style={styles.hue} />
        </ColorPicker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: "100%",
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  wrap: {
    borderRadius: Radius.md,
    padding: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  hexLabel: {
    textAlign: "center",
    marginBottom: Spacing.two,
    letterSpacing: 0.5,
  },
  picker: {
    width: "100%",
    maxWidth: "100%",
    gap: Spacing.three,
    alignSelf: "center",
  },
  preview: {
    height: 36,
    borderRadius: Radius.sm,
  },
  panel: {
    height: 160,
    borderRadius: Radius.md,
  },
  hue: {
    height: 20,
    borderRadius: 10,
  },
});
