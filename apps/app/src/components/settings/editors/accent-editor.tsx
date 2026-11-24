import { accentColorIds, accentColors } from "@munib-tracker/theme/accents";
import { bestForeground } from "@munib-tracker/theme/color";
import type { AccentColorId } from "@munib-tracker/theme/types";
import { SymbolView } from "expo-symbols";
import { type ComponentType, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { COLOR_PALETTE } from "@/constants/color-palette";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { normalizeHex, relativeLuminance } from "@/lib/color";
import { isTV } from "@/lib/platform/is-tv";

type InlineCustomColorPickerProps = {
  value: string;
  onChange: (hex: string) => void;
};

/** Settings-only — keep `reanimated-color-picker` out of the home entry graph. */
const InlineCustomColorPicker: ComponentType<InlineCustomColorPickerProps> =
  process.env.NODE_ENV === "test"
    ? // Jest cannot evaluate React.lazy's native `import()` without --experimental-vm-modules.

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      (
        require("@/components/ui/inline-custom-color-picker") as {
          InlineCustomColorPicker: ComponentType<InlineCustomColorPickerProps>;
        }
      ).InlineCustomColorPicker
    : lazy(() =>
        import("@/components/ui/inline-custom-color-picker").then((m) => ({
          default: m.InlineCustomColorPicker,
        })),
      );

/** Precompute once — luminance is pure and the palette is static. */
const HIGH_LUMINANCE_SWATCHES = new Set<string>(
  COLOR_PALETTE.filter((hex) => relativeLuminance(hex) > 0.85),
);

function needsSwatchBorder(hex: string): boolean {
  if (HIGH_LUMINANCE_SWATCHES.has(hex)) return true;
  return relativeLuminance(hex) > 0.85;
}

/**
 * Accent presets, the full palette, the custom picker and a live preview
 * (Appearance & home › Theme). Light/dark/system is the registry's segmented
 * row above it; both write the synced prefs the theme provider mirrors.
 */
export function AccentEditor() {
  const { t } = useTranslation();
  const {
    colors,
    tokens,
    colorMode,
    accentColorId,
    customAccent,
    scheme,
    setAccentColor,
    setCustomAccent,
  } = useThemeTokens();

  const tv = isTV();
  const pickerValue = customAccent ?? colors.accent;
  const selectedPreset = customAccent ? null : accentColors[accentColorId];
  const accentLabel = customAccent
    ? (normalizeHex(customAccent) ?? customAccent).toUpperCase()
    : (selectedPreset?.label ?? accentColorId);

  const customPicker = (
    <>
      <ThemedText type="label" themeColor="mutedForeground" style={styles.sectionLabel}>
        {t("appearance.customColorPicker")}
      </ThemedText>
      <Suspense
        fallback={
          <View style={styles.pickerFallback}>
            <ActivityIndicator color={colors.accent} />
          </View>
        }
      >
        <InlineCustomColorPicker value={pickerValue} onChange={(hex) => setCustomAccent(hex)} />
      </Suspense>
    </>
  );

  const accentCard = (
    <View>
      <View
        style={[
          styles.selectedBanner,
          {
            backgroundColor: tokens.accentSoft,
            borderColor: tokens.accentBorder,
          },
        ]}
      >
        <View
          style={[
            styles.selectedSwatch,
            {
              backgroundColor: colors.accent,
              borderColor: needsSwatchBorder(colors.accent) ? tokens.hairline : "transparent",
            },
          ]}
        />
        <View style={styles.selectedMeta}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("appearance.selectedAccent")}
          </ThemedText>
          <ThemedText type="small">{accentLabel}</ThemedText>
        </View>
      </View>

      <ThemedText type="label" themeColor="mutedForeground" style={styles.sectionLabel}>
        {t("appearance.accentPresets")}
      </ThemedText>
      <View style={styles.presetGrid}>
        {accentColorIds.map((id) => {
          const accent = accentColors[id];
          const selected = !customAccent && accentColorId === id;
          const swatchColor = scheme === "dark" ? accent.dark : accent.light;
          return (
            <View key={id} style={[styles.presetCell, tv && styles.presetCellTv]}>
              <PressableScale
                accessibilityLabel={accent.label}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setAccentColor(id as AccentColorId)}
                scaleTo={0.92}
                haptic="selection"
                rippleBorderless
                style={styles.presetPressable}
              >
                <View
                  style={[
                    styles.swatchRing,
                    {
                      // TV: the accent ring is the D-pad focus visual — mark
                      // selection with a soft hairline + checkmark instead.
                      borderColor: selected
                        ? tv
                          ? tokens.accentBorder
                          : colors.accent
                        : "transparent",
                      backgroundColor: selected ? tokens.accentSoft : "transparent",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.swatch,
                      {
                        backgroundColor: swatchColor,
                        borderColor: needsSwatchBorder(swatchColor)
                          ? tokens.hairline
                          : withAlpha(colors.foreground, 0.06),
                      },
                    ]}
                  >
                    {selected ? (
                      <SymbolView
                        name={{ ios: "checkmark", android: "check", web: "check" }}
                        size={15}
                        tintColor={bestForeground(swatchColor)}
                      />
                    ) : null}
                  </View>
                </View>
                <ThemedText
                  type="caption"
                  style={[
                    styles.presetLabel,
                    {
                      color: selected ? colors.foreground : colors.mutedForeground,
                      fontWeight: selected ? "600" : "400",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {accent.label}
                </ThemedText>
              </PressableScale>
            </View>
          );
        })}
      </View>

      <ThemedText type="label" themeColor="mutedForeground" style={styles.sectionLabel}>
        {t("appearance.accentAllColors")}
      </ThemedText>
      <View style={[styles.paletteCanvas, { backgroundColor: colors.muted }]}>
        <View style={styles.paletteGrid}>
          {COLOR_PALETTE.map((c) => {
            const normalized = normalizeHex(c);
            const selected =
              customAccent !== null &&
              normalized !== null &&
              normalizeHex(customAccent) === normalized;
            return (
              <PressableScale
                key={c}
                accessibilityLabel={c}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setCustomAccent(c)}
                scaleTo={0.9}
                haptic="selection"
                rippleBorderless
                style={[styles.palettePressable, tv && styles.paletteTv]}
              >
                <View
                  style={[
                    styles.paletteRing,
                    tv && styles.paletteTv,
                    {
                      borderColor: selected ? colors.foreground : "transparent",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.paletteDot,
                      {
                        backgroundColor: c,
                        borderColor: needsSwatchBorder(c) ? tokens.hairline : "transparent",
                      },
                    ]}
                  >
                    {selected ? (
                      <SymbolView
                        name={{ ios: "checkmark", android: "check", web: "check" }}
                        size={12}
                        tintColor={bestForeground(c)}
                      />
                    ) : null}
                  </View>
                </View>
              </PressableScale>
            );
          })}
        </View>
      </View>

      {/* The hue panel / slider are drag-only — on TV the palette above covers it.
          Wide web moves the picker into its own card in the end column. */}
      {tv ? null : customPicker}
    </View>
  );

  const previewCard = (
    <Card variant="muted">
      <ThemedText type="label" themeColor="mutedForeground">
        {t("appearance.preview")}
      </ThemedText>
      <View style={styles.previewRow}>
        <Button label={t("appearance.sampleAction")} size="sm" />
        <Button label={t("appearance.secondary")} size="sm" variant="secondary" />
      </View>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.previewMeta}>
        {t("appearance.previewMeta", { mode: colorMode, accent: accentLabel })}
      </ThemedText>
    </Card>
  );

  return (
    <View style={styles.stack}>
      {accentCard}
      {previewCard}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.three,
  },
  selectedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.one,
  },
  selectedSwatch: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  selectedMeta: {
    flex: 1,
    gap: 1,
  },
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  pickerFallback: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  // Percentage width lives on a plain View — PressableScale drops width from its
  // Android ripple host, which collapsed cells into clipped semicircles.
  presetCell: {
    width: "25%",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.half,
  },
  presetPressable: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: Spacing.one + 2,
  },
  swatchRing: {
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  presetLabel: {
    textAlign: "center",
    alignSelf: "stretch",
  },
  paletteCanvas: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    padding: Spacing.three,
  },
  paletteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two + 2,
    justifyContent: "flex-start",
  },
  // Fixed-size chips — reliable under PressableScale (no % width / aspectRatio).
  palettePressable: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  /** TV: 48dp D-pad targets with a round focus ring. */
  paletteTv: {
    width: tvDp(48),
    height: tvDp(48),
    borderRadius: Radius.pill,
  },
  /** TV: one row of presets across the landscape width. */
  presetCellTv: {
    width: "12.5%",
  },
  paletteRing: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  paletteDot: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
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
