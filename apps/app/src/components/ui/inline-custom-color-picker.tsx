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

/** Inline saturation/hue picker — same UI on iOS, Android, and web (no browser popup). */
export function InlineCustomColorPicker({ value, onChange }: Props) {
  const { colors } = useThemeTokens();
  const hex = normalizeHexForPicker(value);

  return (
    <View style={styles.block}>
      <View style={[styles.wrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hexLabel}>
          {hex}
        </ThemedText>
        <ColorPicker
          value={hex}
          onChangeJS={({ hex: next }: { hex: string }) => onChange(next)}
          style={styles.picker}
        >
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
