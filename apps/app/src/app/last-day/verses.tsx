import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { QuranAyahBookmarkButton } from "@/components/jannah/bookmark-button";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
  useLearnTileStyle,
} from "@/components/jannah/hub-layout";
import { JannahActionRow, JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { ensureLastDayContent, getLastDayVerses, isLastDayContentReady } from "@/lib/last-day";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function LastDayVersesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ready: contentReady } = useEnsureContent(ensureLastDayContent, isLastDayContentReady);
  const { sizes } = useReadingTypography();
  const verses = getLastDayVerses();
  const tileStyle = useLearnTileStyle();
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
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">
            {tTv(t, "lastDay.versesIntro", "lastDay.versesIntroTv")}
          </JannahCallout>

          <LearnReadingChrome surface="last_day">
            {themes.map((theme) => {
              const items = grouped.get(theme) ?? [];
              return (
                <Card key={theme} padding="three">
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
                      <JannahActionRow
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
                                borderTopWidth: StyleSheet.hairlineWidth,
                              },
                        ]}
                        actions={
                          <QuranAyahBookmarkButton surah={verse.surah} ayah={verse.ayahFrom} />
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
                          <ThemedText
                            type="small"
                            style={{
                              fontSize: sizes.translation,
                              lineHeight: sizes.translation * 1.45,
                            }}
                          >
                            {verse.excerpt}
                          </ThemedText>
                          <ThemedText type="caption" themeColor="mutedForeground">
                            {verse.context}
                          </ThemedText>
                          {verse.tafsirSummary ? (
                            <Pill
                              label={verse.tafsirSummary}
                              compact
                              color={colors.mutedForeground}
                              background={colors.muted}
                            />
                          ) : null}
                        </View>
                      </JannahActionRow>
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
