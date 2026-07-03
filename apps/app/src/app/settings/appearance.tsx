import { accentColorIds, accentColors } from "@munib-tracker/theme/accents";
import type { AccentColorId, ColorMode } from "@munib-tracker/theme/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { contrastRatio, isValidHex, normalizeHex, readableForeground } from "@/lib/color";

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
  const [hexDraft, setHexDraft] = useState(customAccent ?? "");

  const draftValid = isValidHex(hexDraft);
  const draftContrast = draftValid
    ? contrastRatio(normalizeHex(hexDraft) ?? "#000000", "#FFFFFF")
    : 0;

  return (
    <ScreenLayout
      eyebrow={t("appearance.eyebrow")}
      title={t("settings.appearance")}
      subtitle={t("settings.appearanceSub")}
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

        <Card>
          <View style={styles.sectionHead}>
            <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
              <SymbolView
                name={{ ios: "eyedropper.halffull", android: "colorize", web: "colorize" }}
                size={18}
                tintColor={colors.accent}
              />
            </View>
            <View style={styles.sectionTitle}>
              <ThemedText type="subtitle">{t("appearance.customTitle")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {customAccent
                  ? t("appearance.customUsing", { hex: customAccent })
                  : t("appearance.customHint")}
              </ThemedText>
            </View>
          </View>

          <View style={styles.hexRow}>
            <View
              style={[
                styles.hexPreview,
                {
                  backgroundColor: draftValid
                    ? (normalizeHex(hexDraft) ?? colors.muted)
                    : colors.muted,
                  borderColor: tokens.hairline,
                },
              ]}
            >
              {draftValid ? (
                <SymbolView
                  name={{ ios: "checkmark", android: "check", web: "check" }}
                  size={16}
                  tintColor={readableForeground(normalizeHex(hexDraft) ?? "#000000")}
                />
              ) : null}
            </View>
            <TextInput
              value={hexDraft}
              onChangeText={(text) => setHexDraft(text.slice(0, 7))}
              autoCapitalize="characters"
              autoCorrect={false}
              placeholder="#1E7A63"
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.hexInput,
                {
                  color: colors.foreground,
                  backgroundColor: colors.muted,
                  borderColor: colors.border,
                },
              ]}
            />
            <Button
              label={t("common.apply")}
              size="sm"
              disabled={!draftValid}
              onPress={() => setCustomAccent(hexDraft)}
            />
          </View>

          {draftValid && draftContrast < 3 ? (
            <ThemedText
              type="caption"
              style={[styles.contrast, { color: tokens.status.warning.color }]}
            >
              {t("appearance.lowContrast")}
            </ThemedText>
          ) : null}

          {customAccent ? (
            <Button
              label={t("appearance.reset")}
              variant="ghost"
              size="sm"
              onPress={() => {
                setCustomAccent(null);
                setHexDraft("");
              }}
              style={styles.reset}
            />
          ) : null}
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
            {t("appearance.previewMeta", { mode: colorMode, accent: accentColorId })}
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
  hexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  hexPreview: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hexInput: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
    fontWeight: "600",
  },
  contrast: {
    marginTop: Spacing.two,
  },
  reset: {
    marginTop: Spacing.two,
  },
});
