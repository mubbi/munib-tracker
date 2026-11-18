import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect } from "react";
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
import { TvLayout } from "@/constants/tv-layout";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  ARABIC_FONT_OPTIONS,
  arabicReadingLayout,
  DEFAULT_ARABIC_FONT_ID,
  resolveArabicLineHeight,
} from "@/lib/reading-typography";
import { routeMetadata } from "@/lib/seo/route-metadata";
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
  const tv = isTV();
  const { isListDetail } = useLargeScreenLayout();

  // Register Arabic picker faces only when this screen opens (dynamic import keeps TTFs out of `__common`).
  useEffect(() => {
    void (async () => {
      const [{ ARABIC_FONT_FILES }, Font] = await Promise.all([
        import("@/lib/arabic-font-files"),
        import("expo-font"),
      ]);
      await Font.loadAsync({ ...ARABIC_FONT_FILES });
    })();
  }, []);

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

  const preview = (
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
  );

  // Array (not a fragment) so phone Stagger still cascades each card.
  const controls = [
    <Card padding="three" key="family">
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
              {...(tv && selected ? { hasTVPreferredFocus: true } : {})}
              onPress={() => setArabicFamily(option.id)}
              style={[
                styles.familyRow,
                tv && styles.familyRowTv,
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
    </Card>,
    <Card padding="three" key="arabicSize">
      <ThemedText type="smallBold" style={styles.label}>
        {t("fonts.arabicText")}
      </ThemedText>
      <SegmentedControl<SizeId>
        options={ARABIC_SIZES.map((s) => ({ id: s.id, label: sizeLabel(s.id) }))}
        value={idForSize(ARABIC_SIZES, arabicSize, "m")}
        onChange={setArabic}
      />
    </Card>,
    <Card padding="three" key="translationSize">
      <ThemedText type="smallBold" style={styles.label}>
        {t("fonts.translationText")}
      </ThemedText>
      <SegmentedControl<SizeId>
        options={TEXT_SIZES.map((s) => ({ id: s.id, label: sizeLabel(s.id) }))}
        value={idForSize(TEXT_SIZES, translationSize, "m")}
        onChange={setTranslation}
      />
    </Card>,
    <ThemedText
      key="footer"
      type="caption"
      themeColor="mutedForeground"
      style={{ color: tokens.status.info.color }}
    >
      {t("fonts.footer")}
    </ThemedText>,
  ];

  return (
    <ScreenLayout
      eyebrow={t("fonts.eyebrow")}
      title={t("settings.fonts")}
      subtitle={t("fonts.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/settings/fonts" />
      {tv || isListDetail ? (
        // TV list–detail: controls on the start column, a live preview pinned beside
        // them so it stays visible while the D-pad walks the options. Wide web /
        // tablets reuse it so the preview sits beside the controls it reflects.
        <View style={styles.tvColumns}>
          <View style={styles.tvControls}>{controls}</View>
          <View style={styles.tvPreview}>{preview}</View>
        </View>
      ) : (
        <Stagger>
          {preview}
          {controls}
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  preview: {
    gap: Spacing.two,
  },
  arabic: {
    writingDirection: "rtl",
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
  familySample: { writingDirection: "rtl" },
  familyHint: { marginTop: Spacing.three },
  familyRowTv: { minHeight: TvLayout.minFocusTarget },
  tvColumns: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  tvControls: { flex: 3, minWidth: 0, gap: Spacing.four },
  tvPreview: { flex: 2, minWidth: 0 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/fonts");
