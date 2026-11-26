import { accentColorIds, accentColors } from "@munib-tracker/theme/accents";
import { bestForeground } from "@munib-tracker/theme/color";
import type { AccentColorId } from "@munib-tracker/theme/types";
import { SymbolView } from "expo-symbols";
import { type ComponentType, lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { TvSwitchTrack } from "@/components/ui/switch-row";
import { TextField } from "@/components/ui/text-field";
import { COLOR_PALETTE } from "@/constants/color-palette";
import { BorderWidth, Control, Radius, Spacing, withAlpha } from "@/constants/theme";
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

const CHECK = { ios: "checkmark", android: "check", web: "check" } as const;

/** Very light swatches need a hairline so they don't vanish on a light card. */
function needsSwatchBorder(hex: string): boolean {
  return relativeLuminance(hex) > 0.85;
}

/**
 * True when the theme had to lift/deepen the user's custom accent for UI use
 * (`ensureReadableAccent` in the theme resolver). The stored hex is unchanged.
 */
export function isAccentAdjusted(customAccent: string | null, resolvedAccent: string): boolean {
  if (!customAccent) return false;
  const stored = normalizeHex(customAccent);
  const shown = normalizeHex(resolvedAccent);
  return stored != null && shown != null && stored !== shown;
}

/** One round swatch in a 44pt target; ring + check when selected. */
function Swatch({
  color,
  label,
  selected,
  onPress,
  testID,
}: {
  color: string;
  label: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
}) {
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  return (
    <PressableScale
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      scaleTo={0.9}
      haptic="selection"
      rippleBorderless
      style={[styles.swatchTarget, tv && styles.swatchTargetTv]}
    >
      <View
        style={[
          styles.swatchRing,
          tv && styles.swatchRingTv,
          {
            // TV: the accent ring is the D-pad focus visual — selection is the
            // foreground ring + check instead.
            borderColor: selected ? (tv ? tokens.hairline : colors.foreground) : "transparent",
          },
        ]}
      >
        <View
          style={[
            styles.swatchDot,
            tv && styles.swatchDotTv,
            {
              backgroundColor: color,
              borderColor: needsSwatchBorder(color)
                ? tokens.hairline
                : withAlpha(colors.foreground, 0.06),
            },
          ]}
        >
          {selected ? (
            <SymbolView name={CHECK} size={13} tintColor={bestForeground(color)} />
          ) : null}
        </View>
      </View>
    </PressableScale>
  );
}

/**
 * Appearance › Accent: one row of the 12 preset swatches plus a final "More"
 * swatch that opens a named sheet with the 36-colour palette (D-UX7) and the
 * custom wheel + hex field, then a small live preview strip (button / toggle /
 * chip). A custom accent too dark or light for the current theme is shown
 * lightness-adjusted (same hue) with an "Adjusted for readability" note; the
 * user's hex is stored unchanged. TV: presets only — no sheet, no picker.
 */
export function AccentEditor() {
  const { t } = useTranslation();
  const { colors, tokens, accentColorId, customAccent, scheme, setAccentColor, setCustomAccent } =
    useThemeTokens();
  const tv = isTV();
  const [moreOpen, setMoreOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState<string | null>(null);

  const selectedPreset = customAccent ? null : accentColors[accentColorId];
  const customHex = customAccent
    ? (normalizeHex(customAccent) ?? customAccent).toUpperCase()
    : null;
  const accentLabel = customHex ?? selectedPreset?.label ?? accentColorId;
  const adjusted = isAccentAdjusted(customAccent, colors.accent);
  const pickerValue = customAccent ?? colors.accent;

  const hexValue = hexDraft ?? customHex ?? "";
  const hexValid = hexDraft == null || normalizeHex(hexDraft) != null;
  const applyHex = () => {
    if (hexDraft == null) return;
    const next = normalizeHex(hexDraft.startsWith("#") ? hexDraft : `#${hexDraft}`);
    if (next) {
      setCustomAccent(next);
      setHexDraft(null);
    }
  };

  return (
    <View style={styles.stack}>
      <View style={styles.copy}>
        <View style={styles.titleLine}>
          <ThemedText type="small" style={styles.title}>
            {t("appearance.accentTitle")}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {accentLabel}
          </ThemedText>
        </View>
      </View>

      <View style={styles.swatches} testID="accent-presets">
        {accentColorIds.map((id) => {
          const accent = accentColors[id];
          return (
            <Swatch
              key={id}
              testID={`accent-preset-${id}`}
              color={scheme === "dark" ? accent.dark : accent.light}
              label={accent.label}
              selected={!customAccent && accentColorId === id}
              onPress={() => setAccentColor(id as AccentColorId)}
            />
          );
        })}
        {tv ? null : (
          <PressableScale
            testID="accent-more"
            accessibilityRole="button"
            accessibilityLabel={t("appearance.moreColors")}
            accessibilityHint={t("appearance.moreColorsHint")}
            accessibilityState={{ selected: customAccent != null }}
            onPress={() => setMoreOpen(true)}
            scaleTo={0.9}
            haptic="selection"
            rippleBorderless
            style={styles.swatchTarget}
          >
            <View
              style={[
                styles.swatchRing,
                { borderColor: customAccent ? colors.foreground : "transparent" },
              ]}
            >
              <View
                style={[
                  styles.swatchDot,
                  styles.moreDot,
                  {
                    backgroundColor: customAccent ? colors.accent : colors.muted,
                    borderColor: colors.border,
                  },
                ]}
              >
                <SymbolView
                  name={
                    customAccent
                      ? CHECK
                      : { ios: "ellipsis", android: "more_horiz", web: "more_horiz" }
                  }
                  size={14}
                  tintColor={customAccent ? colors.accentForeground : colors.foreground}
                />
              </View>
            </View>
          </PressableScale>
        )}
      </View>

      {adjusted ? (
        <View style={styles.note} testID="accent-adjusted-note">
          <SymbolView
            name={{ ios: "info.circle", android: "info", web: "info" }}
            size={14}
            tintColor={colors.mutedForeground}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.noteText}>
            {t("appearance.accentAdjusted")}
          </ThemedText>
        </View>
      ) : null}

      {/* Live preview strip: drawn only (nothing to press), hidden from assistive tech. */}
      <View
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.preview, { backgroundColor: colors.muted }]}
        testID="accent-preview"
      >
        <View style={[styles.previewButton, { backgroundColor: colors.accent }]}>
          <ThemedText type="caption" weight="semibold" style={{ color: colors.accentForeground }}>
            {t("appearance.sampleAction")}
          </ThemedText>
        </View>
        <TvSwitchTrack value />
        <View
          style={[
            styles.previewChip,
            { backgroundColor: tokens.accentSoft, borderColor: colors.accent },
          ]}
        >
          <ThemedText type="caption" weight="semibold" style={{ color: tokens.accentOnSoft }}>
            {t("appearance.selectedAccent")}
          </ThemedText>
        </View>
      </View>

      {tv ? null : (
        <Sheet
          visible={moreOpen}
          onClose={() => {
            setMoreOpen(false);
            setHexDraft(null);
          }}
          variant="bottom"
          solid
          title={t("appearance.moreColors")}
        >
          <View style={styles.sheetBody}>
            <ThemedText type="label" themeColor="mutedForeground">
              {t("appearance.accentAllColors")}
            </ThemedText>
            <View style={[styles.palette, { backgroundColor: colors.muted }]}>
              {COLOR_PALETTE.map((c) => {
                const normalized = normalizeHex(c);
                const selected =
                  customAccent != null &&
                  normalized != null &&
                  normalizeHex(customAccent) === normalized;
                return (
                  <Swatch
                    key={c}
                    color={c}
                    label={c}
                    selected={selected}
                    onPress={() => setCustomAccent(c)}
                  />
                );
              })}
            </View>

            <ThemedText type="label" themeColor="mutedForeground">
              {t("appearance.customColorPicker")}
            </ThemedText>
            <Suspense
              fallback={
                // P8-04: the lazy colour picker loads behind a skeleton, not a spinner.
                <SkeletonPlaceholder preset="card" count={1} style={styles.pickerFallback} />
              }
            >
              <InlineCustomColorPicker
                value={pickerValue}
                onChange={(hex) => setCustomAccent(hex)}
              />
            </Suspense>
            <TextField
              label={t("appearance.hexLabel")}
              value={hexValue}
              onChangeText={setHexDraft}
              onSubmitEditing={applyHex}
              onBlur={applyHex}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={7}
              returnKeyType="done"
              keyboardType={Platform.OS === "ios" ? "ascii-capable" : "default"}
              error={hexValid ? undefined : t("appearance.hexInvalid")}
            />
            {adjusted ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("appearance.accentAdjusted")}
              </ThemedText>
            ) : null}
            <Button
              label={t("settingsPanel.done")}
              fullWidth
              onPress={() => {
                applyHex();
                setMoreOpen(false);
              }}
            />
          </View>
        </Sheet>
      )}
    </View>
  );
}

const SWATCH_TV = tvDp(48);

const styles = StyleSheet.create({
  stack: { gap: Spacing.two },
  copy: { gap: Spacing.half },
  titleLine: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    columnGap: Spacing.two,
  },
  title: { flexShrink: 1 },
  swatches: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: Spacing.half,
    rowGap: Spacing.half,
  },
  // Fixed-size targets — reliable under PressableScale (no % width / aspectRatio).
  swatchTarget: {
    width: Control.minTouch,
    height: Control.minTouch,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchTargetTv: { width: SWATCH_TV, height: SWATCH_TV, borderRadius: Radius.pill },
  swatchRing: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thick,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchRingTv: { width: SWATCH_TV, height: SWATCH_TV },
  swatchDot: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchDotTv: { width: tvDp(36), height: tvDp(36) },
  moreDot: { borderStyle: "dashed", borderWidth: BorderWidth.thin },
  note: { flexDirection: "row", alignItems: "center", gap: Spacing.oneHalf },
  noteText: { flexShrink: 1 },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  previewButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  previewChip: {
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  sheetBody: { gap: Spacing.three },
  palette: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.half,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  pickerFallback: { minHeight: 160 },
});
