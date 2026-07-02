import { accentColorIds, accentColors } from "@munib-tracker/theme/accents";
import type { AccentColorId, ColorMode } from "@munib-tracker/theme/types";
import { Pressable, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const colorModes: { id: ColorMode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
];

export default function SettingsScreen() {
  const { colors, colorMode, accentColorId, setColorMode, setAccentColor } = useTheme();

  return (
    <ScreenLayout title="Settings" subtitle="Appearance & preferences">
      <ThemedView type="card" style={[styles.sectionCard, { borderColor: colors.border }]}>
        <ThemedText type="smallBold">Appearance</ThemedText>
        <ThemedText themeColor="mutedForeground">
          Choose light, dark, or follow your device setting.
        </ThemedText>
        <View style={styles.segmentRow}>
          {colorModes.map((mode) => {
            const selected = colorMode === mode.id;
            return (
              <Pressable
                key={mode.id}
                onPress={() => setColorMode(mode.id)}
                style={[
                  styles.segmentButton,
                  {
                    backgroundColor: selected ? colors.accent : colors.muted,
                    borderColor: colors.border,
                  },
                ]}
              >
                <ThemedText
                  type="smallBold"
                  style={{ color: selected ? colors.accentForeground : colors.foreground }}
                >
                  {mode.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </ThemedView>

      <ThemedView type="card" style={[styles.sectionCard, { borderColor: colors.border }]}>
        <ThemedText type="smallBold">Accent color</ThemedText>
        <ThemedText themeColor="mutedForeground">
          Gold matches the Munib brand. Pick what feels right for you.
        </ThemedText>
        <View style={styles.swatchRow}>
          {accentColorIds.map((id) => {
            const accent = accentColors[id];
            const selected = accentColorId === id;
            return (
              <Pressable
                key={id}
                accessibilityLabel={accent.label}
                onPress={() => setAccentColor(id as AccentColorId)}
                style={[
                  styles.swatch,
                  {
                    backgroundColor: accent.dark,
                    borderColor: selected ? colors.accent : colors.border,
                    borderWidth: selected ? 3 : 1,
                  },
                ]}
              />
            );
          })}
        </View>
      </ThemedView>

      <ThemedView type="card" style={[styles.previewCard, { borderColor: colors.border }]}>
        <ThemedText type="smallBold">Preview</ThemedText>
        <ThemedView type="muted" style={[styles.previewButton, { backgroundColor: colors.accent }]}>
          <ThemedText style={{ color: colors.accentForeground }} type="smallBold">
            Sample action
          </ThemedText>
        </ThemedView>
        <ThemedText themeColor="mutedForeground">
          Current mode: {colorMode} · accent: {accentColorId}
        </ThemedText>
      </ThemedView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderCurve: "continuous",
  },
  segmentRow: {
    flexDirection: "row",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  segmentButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderCurve: "continuous",
  },
  swatchRow: {
    flexDirection: "row",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderCurve: "continuous",
  },
  previewCard: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderCurve: "continuous",
  },
  previewButton: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    borderCurve: "continuous",
  },
});
