import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ARABIC_FONT_OPTIONS,
  arabicReadingLayout,
  DEFAULT_ARABIC_FONT_ID,
  resolveArabicLineHeight,
} from "@/lib/reading-typography";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

const ARABIC_SIZES = [
  { id: "s", size: 22 },
  { id: "m", size: 28 },
  { id: "l", size: 36 },
] as const;

const TEXT_SIZES = [
  { id: "s", size: 14 },
  { id: "m", size: 16 },
  { id: "l", size: 18 },
] as const;

type SizeId = "s" | "m" | "l";

const SIZE_LABEL_KEY: Record<SizeId, string> = { s: "small", m: "medium", l: "large" };

function idForSize(
  sizes: readonly { id: SizeId; size: number }[],
  value: number | undefined,
  fallback: SizeId,
): SizeId {
  return sizes.find((s) => s.size === value)?.id ?? fallback;
}

export default function FontsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const prefs = usePreferences();
  const { update } = usePreferencesActions();
  const sizeLabel = (id: SizeId) => t(`fonts.${SIZE_LABEL_KEY[id]}`);

  const arabicSize = prefs.fontPrefs.arabic.size ?? 28;
  const translationSize = prefs.fontPrefs.translation.size ?? 16;
  const arabicFamily = prefs.fontPrefs.arabic.family ?? DEFAULT_ARABIC_FONT_ID;

  const setArabic = (id: SizeId) => {
    const size = ARABIC_SIZES.find((s) => s.id === id)?.size ?? 28;
    void update({ fontPrefs: { ...prefs.fontPrefs, arabic: { ...prefs.fontPrefs.arabic, size } } });
  };
  const setArabicFamily = (family: string) => {
    void update({
      fontPrefs: { ...prefs.fontPrefs, arabic: { ...prefs.fontPrefs.arabic, family } },
    });
  };
  const setTranslation = (id: SizeId) => {
    const size = TEXT_SIZES.find((s) => s.id === id)?.size ?? 16;
    void update({
      fontPrefs: { ...prefs.fontPrefs, translation: { ...prefs.fontPrefs.translation, size } },
    });
  };

  return (
    <ScreenLayout
      eyebrow={t("fonts.eyebrow")}
      title={t("settings.fonts")}
      subtitle={t("fonts.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/settings/fonts" />
      <Stagger>
        <Card variant="muted" style={styles.preview}>
          <ThemedText type="label" themeColor="mutedForeground">
            {t("fonts.preview")}
          </ThemedText>
          <ThemedText type="arabic" style={[styles.arabic, arabicReadingLayout(arabicSize)]}>
            سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
          </ThemedText>
          <ThemedText style={{ fontSize: translationSize, lineHeight: translationSize * 1.5 }}>
            {t("fonts.sampleTranslation")}
          </ThemedText>
        </Card>

        <Card padding="three">
          <ThemedText type="smallBold" style={styles.label}>
            {t("fonts.arabicFamilyTitle")}
          </ThemedText>
          <View style={styles.familyList}>
            {ARABIC_FONT_OPTIONS.map((option) => {
              const selected = option.id === arabicFamily;
              return (
                <PressableScale
                  key={option.id}
                  haptic="selection"
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={t(option.labelKey)}
                  onPress={() => setArabicFamily(option.id)}
                  style={[
                    styles.familyRow,
                    { backgroundColor: selected ? tokens.accentSoft : colors.muted },
                  ]}
                >
                  <View style={styles.familyBody}>
                    <ThemedText type="small">{t(option.labelKey)}</ThemedText>
                    <ThemedText
                      style={[
                        styles.familySample,
                        arabicReadingLayout(20),
                        {
                          fontFamily: option.fontFamily ?? Fonts.serif,
                          lineHeight: resolveArabicLineHeight(20, option.id),
                        },
                      ]}
                      numberOfLines={1}
                    >
                      بِسْمِ اللَّهِ
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
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.familyHint}>
            {t("fonts.arabicFamilyHint")}
          </ThemedText>
        </Card>

        <Card padding="three">
          <ThemedText type="smallBold" style={styles.label}>
            {t("fonts.arabicText")}
          </ThemedText>
          <SegmentedControl<SizeId>
            options={ARABIC_SIZES.map((s) => ({ id: s.id, label: sizeLabel(s.id) }))}
            value={idForSize(ARABIC_SIZES, arabicSize, "m")}
            onChange={setArabic}
          />
        </Card>

        <Card padding="three">
          <ThemedText type="smallBold" style={styles.label}>
            {t("fonts.translationText")}
          </ThemedText>
          <SegmentedControl<SizeId>
            options={TEXT_SIZES.map((s) => ({ id: s.id, label: sizeLabel(s.id) }))}
            value={idForSize(TEXT_SIZES, translationSize, "m")}
            onChange={setTranslation}
          />
        </Card>

        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={{ color: tokens.status.info.color }}
        >
          {t("fonts.footer")}
        </ThemedText>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  preview: {
    gap: Spacing.two,
  },
  arabic: {
    writingDirection: "rtl",
    textAlign: "right",
  },
  label: {
    marginBottom: Spacing.three,
  },
  familyList: { gap: Spacing.two },
  familyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  familyBody: { flex: 1, gap: 2 },
  familySample: { writingDirection: "rtl", textAlign: "right" },
  familyHint: { marginTop: Spacing.three },
});
