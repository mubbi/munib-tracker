import { accentColorIds, accentColors } from "@munib-tracker/theme/accents";
import type { AccentColorId, ColorMode } from "@munib-tracker/theme/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const colorModes: { id: ColorMode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
];

export default function AppearanceScreen() {
  const router = useRouter();
  const { colors, tokens, colorMode, accentColorId, scheme, setColorMode, setAccentColor } =
    useThemeTokens();

  return (
    <ScreenLayout
      eyebrow="Settings"
      title="Appearance"
      subtitle="Theme & accent color"
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card>
          <View style={styles.sectionHead}>
            <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
              <SymbolView
                name={{ ios: "circle.lefthalf.filled", android: "contrast", web: "contrast" }}
                size={18}
                tintColor={colors.accent}
              />
            </View>
            <View style={styles.sectionTitle}>
              <ThemedText type="subtitle">Appearance</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                Choose light, dark, or follow your device
              </ThemedText>
            </View>
          </View>
          <SegmentedControl options={colorModes} value={colorMode} onChange={setColorMode} />
        </Card>

        <Card>
          <View style={styles.sectionHead}>
            <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
              <SymbolView
                name={{ ios: "paintpalette.fill", android: "palette", web: "palette" }}
                size={18}
                tintColor={colors.accent}
              />
            </View>
            <View style={styles.sectionTitle}>
              <ThemedText type="subtitle">Accent color</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                Gold matches the Munib brand
              </ThemedText>
            </View>
          </View>

          <View style={styles.swatchRow}>
            {accentColorIds.map((id) => {
              const accent = accentColors[id];
              const selected = accentColorId === id;
              const swatchColor = scheme === "dark" ? accent.dark : accent.light;
              return (
                <PressableScale
                  key={id}
                  accessibilityLabel={accent.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setAccentColor(id as AccentColorId)}
                  scaleTo={0.9}
                  haptic="selection"
                  style={styles.swatchItem}
                >
                  <View
                    style={[
                      styles.swatch,
                      {
                        backgroundColor: swatchColor,
                        borderColor: selected ? colors.foreground : tokens.hairline,
                        borderWidth: selected ? 2 : 1,
                      },
                      selected && styles.swatchSelected,
                    ]}
                  >
                    {selected ? (
                      <SymbolView
                        name={{ ios: "checkmark", android: "check", web: "check" }}
                        size={16}
                        tintColor={accent.foreground}
                      />
                    ) : null}
                  </View>
                  <ThemedText
                    type="caption"
                    style={{ color: selected ? colors.foreground : colors.mutedForeground }}
                  >
                    {accent.label}
                  </ThemedText>
                </PressableScale>
              );
            })}
          </View>
        </Card>

        <Card variant="muted">
          <ThemedText type="label" themeColor="mutedForeground">
            Preview
          </ThemedText>
          <View style={styles.previewRow}>
            <Button label="Sample action" size="sm" />
            <Button label="Secondary" size="sm" variant="secondary" />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.previewMeta}>
            Current mode: {colorMode} · accent: {accentColorId}
          </ThemedText>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
    marginBottom: Spacing.three,
  },
  iconWell: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    flex: 1,
    gap: 2,
  },
  swatchRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.four,
    rowGap: Spacing.three,
  },
  swatchItem: {
    alignItems: "center",
    gap: Spacing.one + 2,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  swatchSelected: {
    transform: [{ scale: 1.06 }],
  },
  previewRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
    flexWrap: "wrap",
  },
  previewMeta: {
    marginTop: Spacing.one,
  },
});
