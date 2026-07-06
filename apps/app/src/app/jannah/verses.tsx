import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { QuranAyahBookmarkButton } from "@/components/jannah/bookmark-button";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getJannahVerses } from "@/lib/jannah";
import { chevronForward } from "@/lib/rtl";

const THEME_ORDER = ["description", "reward", "ranks", "mercy", "supplication"] as const;

const THEME_ICONS: Record<(typeof THEME_ORDER)[number], SymbolViewProps["name"]> = {
  description: { ios: "leaf.fill", android: "park", web: "park" },
  reward: { ios: "gift.fill", android: "card_giftcard", web: "card_giftcard" },
  ranks: { ios: "stairs", android: "stairs", web: "stairs" },
  mercy: { ios: "heart.fill", android: "favorite", web: "favorite" },
  supplication: {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
};

function JannahVersesList() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();
  const verses = getJannahVerses();

  const grouped = useMemo(() => {
    const map = new Map<string, typeof verses>();
    for (const theme of THEME_ORDER) {
      map.set(
        theme,
        verses.filter((v) => v.theme === theme),
      );
    }
    return map;
  }, [verses]);

  return (
    <>
      <JannahCallout tone="info">{t("jannah.versesLead")}</JannahCallout>

      {THEME_ORDER.map((theme) => {
        const items = grouped.get(theme) ?? [];
        if (items.length === 0) return null;
        return (
          <Card key={theme} padding="three">
            <SectionHeader title={t(`jannah.verseTheme.${theme}`)} icon={THEME_ICONS[theme]} />
            <View style={styles.list}>
              {items.map((verse, index) => (
                <PressableScale
                  key={verse.id}
                  haptic="light"
                  accessibilityRole="link"
                  accessibilityLabel={`${verse.label}. ${verse.excerpt}`}
                  onPress={() =>
                    router.push({
                      pathname: "/quran/[surah]",
                      params: { surah: String(verse.surah), ayah: String(verse.ayahFrom) },
                    })
                  }
                  style={[
                    styles.row,
                    index > 0 && {
                      borderTopColor: tokens.hairline,
                      borderTopWidth: StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <IconWell
                    icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
                    tint={colors.accent}
                    well={36}
                    size={16}
                  />
                  <View style={styles.rowCopy}>
                    <ReferenceLine reference={verse.label} />
                    <ThemedText
                      type="small"
                      themeColor="mutedForeground"
                      style={[
                        styles.excerpt,
                        { fontSize: sizes.translation, lineHeight: sizes.translation * 1.45 },
                      ]}
                    >
                      {verse.excerpt}
                    </ThemedText>
                  </View>
                  <QuranAyahBookmarkButton surah={verse.surah} ayah={verse.ayahFrom} />
                  <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
                </PressableScale>
              ))}
            </View>
          </Card>
        );
      })}
    </>
  );
}

export default function JannahVersesScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScreenLayout
      eyebrow={t("jannah.eyebrow")}
      title={t("jannah.versesTitle")}
      subtitle={t("jannah.versesSubtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/jannah"))}
    >
      <Seo path="/jannah/verses" />
      <Stagger>
        <LearnReadingChrome surface="jannah">
          <JannahVersesList />
        </LearnReadingChrome>

        <JannahDisclaimer />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  rowCopy: { flex: 1, gap: Spacing.one },
  excerpt: { lineHeight: 20 },
});
