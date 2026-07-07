import { accentColorIds, accentColors } from "@munib-tracker/theme/accents";
import { bestForeground } from "@munib-tracker/theme/color";
import type { AccentColorId, ColorMode } from "@munib-tracker/theme/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InlineCustomColorPicker } from "@/components/ui/inline-custom-color-picker";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { COLOR_PALETTE } from "@/constants/color-palette";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { normalizeHex, readableForeground } from "@/lib/color";
import { goBackOrReplace } from "@/lib/navigation";

const colorModeIds: ColorMode[] = ["light", "dark", "system"];

export default function AppearanceScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorModes = colorModeIds.map((id) => ({
    id,
    label: t(`appearance.mode${id.charAt(0).toUpperCase()}${id.slice(1)}`),
  }));
  const {
    colors,
    tokens,
    colorMode,
    accentColorId,
    customAccent,
    scheme,
    setColorMode,
    setAccentColor,
    setCustomAccent,
  } = useThemeTokens();

  const pickerValue = customAccent ?? colors.accent;
  const accentLabel = customAccent ?? accentColorId;

  return (
    <ScreenLayout
      eyebrow={t("appearance.eyebrow")}
      title={t("settings.appearance")}
      subtitle={t("settings.appearanceSub")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/settings/appearance" />
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
              <ThemedText type="subtitle">{t("appearance.themeTitle")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("appearance.themeHint")}
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
              <ThemedText type="subtitle">{t("appearance.accentTitle")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("appearance.accentHint")}
              </ThemedText>
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
                <PressableScale
                  key={id}
                  accessibilityLabel={accent.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setAccentColor(id as AccentColorId)}
                  scaleTo={0.9}
                  haptic="selection"
                  style={styles.presetItem}
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
                        tintColor={bestForeground(swatchColor)}
                      />
                    ) : null}
                  </View>
                  <ThemedText
                    type="caption"
                    style={{ color: selected ? colors.foreground : colors.mutedForeground }}
                    numberOfLines={1}
                  >
                    {accent.label}
                  </ThemedText>
                </PressableScale>
              );
            })}
          </View>

          <ThemedText type="label" themeColor="mutedForeground" style={styles.sectionLabel}>
            {t("appearance.accentAllColors")}
          </ThemedText>
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
                  scaleTo={0.92}
                  haptic="selection"
                  style={[
                    styles.paletteDot,
                    { backgroundColor: c },
                    selected && {
                      borderWidth: 3,
                      borderColor: colors.background,
                      transform: [{ scale: 1.12 }],
                    },
                  ]}
                >
                  {selected ? (
                    <SymbolView
                      name={{ ios: "checkmark", android: "check", web: "check" }}
                      size={12}
                      tintColor={readableForeground(c)}
                    />
                  ) : null}
                </PressableScale>
              );
            })}
          </View>

          <ThemedText type="label" themeColor="mutedForeground" style={styles.sectionLabel}>
            {t("appearance.customColorPicker")}
          </ThemedText>
          <InlineCustomColorPicker value={pickerValue} onChange={(hex) => setCustomAccent(hex)} />
        </Card>

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
  sectionLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    rowGap: Spacing.three,
  },
  presetItem: {
    width: "22%",
    minWidth: 72,
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
  paletteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: Spacing.two,
  },
  paletteDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderCurve: "continuous",
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
