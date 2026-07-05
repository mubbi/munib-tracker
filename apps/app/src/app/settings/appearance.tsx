import { accentColorIds, accentColors } from "@munib-tracker/theme/accents";
import { bestForeground } from "@munib-tracker/theme/color";
import type { AccentColorId, ColorMode } from "@munib-tracker/theme/types";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InlineCustomColorPicker } from "@/components/ui/inline-custom-color-picker";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { COLOR_PALETTE } from "@/constants/color-palette";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { normalizeHex, readableForeground } from "@/lib/color";
import { currentSeasonalTheme, SEASONAL_THEMES, type SeasonalThemeId } from "@/lib/seasonal-themes";

const colorModeIds: ColorMode[] = ["light", "dark", "system"];

const SEASON_ICONS: Record<SeasonalThemeId, SymbolViewProps["name"]> = {
  ramadan: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" },
  hajj: { ios: "building.columns.fill", android: "account_balance", web: "account_balance" },
};

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
  const activeSeason = currentSeasonalTheme();

  return (
    <ScreenLayout
      eyebrow={t("appearance.eyebrow")}
      title={t("settings.appearance")}
      subtitle={t("settings.appearanceSub")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
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
                name={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
                size={18}
                tintColor={colors.accent}
              />
            </View>
            <View style={styles.sectionTitle}>
              <ThemedText type="subtitle">{t("seasonalTheme.title")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("seasonalTheme.hint")}
              </ThemedText>
            </View>
          </View>

          {activeSeason && !customAccent && accentColorId !== activeSeason.accentId ? (
            <View style={[styles.suggestion, { backgroundColor: tokens.accentSoft }]}>
              <SymbolView
                name={{ ios: "wand.and.stars", android: "auto_fix_high", web: "auto_fix_high" }}
                size={16}
                tintColor={colors.accent}
              />
              <ThemedText type="caption" style={{ color: colors.accentText, flex: 1 }}>
                {t("seasonalTheme.suggestion", {
                  season: t(`seasonalTheme.${activeSeason.id}Label`),
                })}
              </ThemedText>
              <Button
                label={t("seasonalTheme.apply")}
                size="sm"
                onPress={() => setAccentColor(activeSeason.accentId)}
              />
            </View>
          ) : null}

          <View style={styles.seasonList}>
            {SEASONAL_THEMES.map((season) => {
              const accent = accentColors[season.accentId];
              const swatchColor = scheme === "dark" ? accent.dark : accent.light;
              const selected = !customAccent && accentColorId === season.accentId;
              const inSeason = activeSeason?.id === season.id;
              return (
                <PressableScale
                  key={season.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={t(`seasonalTheme.${season.id}Label`)}
                  onPress={() => setAccentColor(season.accentId)}
                  scaleTo={0.98}
                  haptic="selection"
                  style={[
                    styles.seasonRow,
                    {
                      backgroundColor: colors.muted,
                      borderColor: selected ? colors.accent : tokens.hairline,
                      borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <View style={[styles.seasonSwatch, { backgroundColor: swatchColor }]}>
                    <SymbolView
                      name={SEASON_ICONS[season.id]}
                      size={18}
                      tintColor={bestForeground(swatchColor)}
                    />
                  </View>
                  <View style={styles.seasonCopy}>
                    <View style={styles.seasonTitleRow}>
                      <ThemedText type="smallBold">
                        {t(`seasonalTheme.${season.id}Label`)}
                      </ThemedText>
                      {inSeason ? (
                        <Pill
                          label={t("seasonalTheme.inSeason")}
                          compact
                          color={tokens.status.success.color}
                          background={tokens.status.success.soft}
                        />
                      ) : null}
                    </View>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t(`seasonalTheme.${season.id}Desc`)}
                    </ThemedText>
                  </View>
                  {selected ? (
                    <SymbolView
                      name={{
                        ios: "checkmark.circle.fill",
                        android: "check_circle",
                        web: "check_circle",
                      }}
                      size={20}
                      tintColor={colors.accent}
                    />
                  ) : null}
                </PressableScale>
              );
            })}
          </View>
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
                        // Derive the checkmark colour from the actual swatch fill so it
                        // stays visible on every preset in both light and dark mode.
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
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    marginBottom: Spacing.three,
  },
  seasonList: {
    gap: Spacing.two,
  },
  seasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  seasonSwatch: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  seasonCopy: { flex: 1, gap: 2 },
  seasonTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
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
