import { type Href, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { QuranAyahBookmarkButton } from "@/components/jannah/bookmark-button";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
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
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { ensureJahannamContent, getJahannamVerses, isJahannamContentReady } from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";
import { useChevronForward } from "@/lib/rtl";

const THEME_ORDER = [
  "warnings",
  "mercy",
  "repentance",
  "accountability",
  "justice",
  "hope",
] as const;

const THEME_ICONS: Record<(typeof THEME_ORDER)[number], SymbolViewProps["name"]> = {
  warnings: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  mercy: { ios: "heart.fill", android: "favorite", web: "favorite" },
  repentance: { ios: "arrow.uturn.backward.circle.fill", android: "undo", web: "undo" },
  accountability: { ios: "scalemass.fill", android: "balance", web: "balance" },
  justice: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  hope: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
};

function JahannamVersesList() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();
  const chevronForwardIcon = useChevronForward();
  const verses = getJahannamVerses();

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
      <JannahCallout tone="info">
        {tTv(t, "jahannam.versesLead", "jahannam.versesLeadTv")}
      </JannahCallout>
      {THEME_ORDER.map((theme) => {
        const items = grouped.get(theme) ?? [];
        if (items.length === 0) return null;
        return (
          <Card key={theme} padding="three">
            <SectionHeader title={t(`jahannam.verseTheme.${theme}`)} icon={THEME_ICONS[theme]} />
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
                      style={{
                        fontSize: sizes.translation,
                        lineHeight: sizes.translation * 1.45,
                      }}
                    >
                      {verse.excerpt}
                    </ThemedText>
                    {verse.context ? (
                      <ThemedText type="caption" themeColor="mutedForeground">
                        {verse.context}
                      </ThemedText>
                    ) : null}
                    {verse.tafsirSummary ? (
                      <ThemedText type="caption" themeColor="mutedForeground" style={styles.tafsir}>
                        {t("jahannam.tafsirNote")}: {verse.tafsirSummary}
                      </ThemedText>
                    ) : null}
                  </View>
                  <QuranAyahBookmarkButton surah={verse.surah} ayah={verse.ayahFrom} />
                  <SymbolView
                    name={chevronForwardIcon}
                    size={14}
                    tintColor={colors.mutedForeground}
                  />
                </PressableScale>
              ))}
            </View>
          </Card>
        );
      })}
    </>
  );
}

export default function JahannamVersesScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const { ready: contentReady } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.versesTitle")}
      subtitle={t("jahannam.versesSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
    >
      <Seo path="/jahannam/verses" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JahannamVersesList />
          </LearnReadingChrome>
          <JannahDisclaimer textKey="jahannam.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  rowCopy: { flex: 1, gap: Spacing.one },
  tafsir: { lineHeight: 16, fontStyle: "italic" },
});
