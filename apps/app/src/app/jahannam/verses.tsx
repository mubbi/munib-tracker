import { type Href, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { ScriptureMeaning } from "@/components/content/scripture-meaning";
import { QuranAyahBookmarkButton } from "@/components/jannah/bookmark-button";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
  useLearnTileStyle,
} from "@/components/jannah/hub-layout";
import { JannahActionRow, JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { ensureJahannamContent, getJahannamVerses, isJahannamContentReady } from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";
import { passageFromRef } from "@/lib/recite-along/passages";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";

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

/** Bookmark + recite along (D68) for one verse row; recite hides where practice is unavailable. */
function VerseActions({ verse }: { verse: { surah: number; ayahFrom: number; ayahTo?: number } }) {
  const passage = passageFromRef(verse);
  return (
    <>
      {passage ? <ReciteAlongButton passage={passage} appearance="icon" /> : null}
      <QuranAyahBookmarkButton surah={verse.surah} ayah={verse.ayahFrom} />
    </>
  );
}

function JahannamVersesList({ columns }: { columns: number }) {
  const router = useRouter();
  const tileStyle = useLearnTileStyle();
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
            <LearnColumnsGrid
              columns={columns}
              gap={Spacing.three}
              stackGap={0}
              style={styles.list}
            >
              {items.map((verse, index) => (
                <JannahActionRow
                  key={verse.id}
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
                    columns > 1
                      ? tileStyle
                      : index > 0 && {
                          borderTopColor: tokens.hairline,
                          borderTopWidth: StyleSheet.hairlineWidth,
                        },
                  ]}
                  actions={<VerseActions verse={verse} />}
                  trailing={
                    <SymbolView
                      name={chevronForwardIcon}
                      size={14}
                      tintColor={colors.mutedForeground}
                    />
                  }
                >
                  <IconWell
                    icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
                    tint={colors.accent}
                    well={36}
                    size={16}
                  />
                  <View style={styles.rowCopy}>
                    <ReferenceLine reference={verse.label} />
                    <ScriptureMeaning english={verse.excerpt} quranRef={verse}>
                      {(text) => (
                        <ThemedText
                          type="small"
                          themeColor="mutedForeground"
                          style={{
                            fontSize: sizes.translation,
                            lineHeight: sizes.translation * 1.45,
                          }}
                        >
                          {text}
                        </ThemedText>
                      )}
                    </ScriptureMeaning>
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
                </JannahActionRow>
              ))}
            </LearnColumnsGrid>
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
  const wide = useLearnHubLayout();
  // Wide web / tablets: verse cards flow into 2–3 columns per theme.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 320, max: 3 });
  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.versesTitle")}
      subtitle={t("jahannam.versesSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/jahannam/verses" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JahannamVersesList columns={columns} />
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

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jahannam/verses");
