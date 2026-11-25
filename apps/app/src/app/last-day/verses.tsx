import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
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
import { JannahCallout, JannahDisclaimer, LearnActionRow } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { BorderWidth, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { ensureLastDayContent, getLastDayVerses, isLastDayContentReady } from "@/lib/last-day";
import { goBackOrReplace } from "@/lib/navigation";
import { passageFromRef } from "@/lib/recite-along/passages";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";

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

export default function LastDayVersesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const {
    ready: contentReady,
    error: contentError,
    retry,
  } = useEnsureContent(ensureLastDayContent, isLastDayContentReady);
  const verses = getLastDayVerses();
  const tileStyle = useLearnTileStyle();
  const chevronForwardIcon = useChevronForward();
  const wide = useLearnHubLayout();
  // Wide web / tablets: verse cards flow into 2–3 columns per theme.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 320, max: 3 });

  const grouped = useMemo(() => {
    const map = new Map<string, typeof verses>();
    for (const verse of verses) {
      const list = map.get(verse.theme) ?? [];
      list.push(verse);
      map.set(verse.theme, list);
    }
    return map;
  }, [verses]);

  const themes = [...grouped.keys()];

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.versesTitle")}
      subtitle={t("lastDay.versesSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/last-day/verses" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retry}>
        <Stagger>
          <JannahCallout tone="info">
            {tTv(t, "lastDay.versesIntro", "lastDay.versesIntroTv")}
          </JannahCallout>

          <LearnReadingChrome surface="last_day">
            {themes.map((theme) => {
              const items = grouped.get(theme) ?? [];
              return (
                <Card key={theme}>
                  <SectionHeader
                    title={t(`lastDay.verseTheme.${theme}`)}
                    icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
                  />
                  <LearnColumnsGrid
                    columns={columns}
                    gap={Spacing.three}
                    stackGap={0}
                    style={styles.list}
                  >
                    {items.map((verse, index) => (
                      <LearnActionRow
                        key={verse.id}
                        accessibilityRole="link"
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
                                borderTopWidth: BorderWidth.hairline,
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
                        <View style={styles.copy}>
                          <ReferenceLine reference={verse.label} />
                          <ScriptureMeaning english={verse.excerpt} quranRef={verse}>
                            {(text) => <LearnProseText>{text}</LearnProseText>}
                          </ScriptureMeaning>
                          <ThemedText type="caption" themeColor="mutedForeground">
                            {verse.context}
                          </ThemedText>
                          {verse.tafsirSummary ? (
                            <ThemedText type="caption" themeColor="mutedForeground">
                              {t("learnKit.tafsirNote", { text: verse.tafsirSummary })}
                            </ThemedText>
                          ) : null}
                        </View>
                      </LearnActionRow>
                    ))}
                  </LearnColumnsGrid>
                </Card>
              );
            })}
          </LearnReadingChrome>

          <JannahDisclaimer textKey="lastDay.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.three },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  copy: { flex: 1, gap: Spacing.one },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/last-day/verses");
