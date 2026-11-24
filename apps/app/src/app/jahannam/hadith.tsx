import { type Href, useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScriptureMeaning } from "@/components/content/scripture-meaning";
import { HadithCitationBookmarkButton } from "@/components/jannah/bookmark-button";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureJahannamContent, getJahannamHadith, isJahannamContentReady } from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

const THEME_ORDER = ["warning", "mercy", "repentance", "accountability", "protection"] as const;

const THEME_ICONS: Record<(typeof THEME_ORDER)[number], SymbolViewProps["name"]> = {
  warning: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  mercy: { ios: "heart.fill", android: "favorite", web: "favorite" },
  repentance: { ios: "arrow.uturn.backward.circle.fill", android: "undo", web: "undo" },
  accountability: { ios: "scalemass.fill", android: "balance", web: "balance" },
  protection: { ios: "shield.fill", android: "shield", web: "shield" },
};

export default function JahannamHadithScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ready: contentReady } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  const { sizes } = useReadingTypography();
  const entries = getJahannamHadith();
  const wide = useLearnHubLayout();
  // Wide web / tablets: hadith quotes flow into 2–3 columns per theme.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 320, max: 3 });

  const grouped = useMemo(() => {
    const map = new Map<string, typeof entries>();
    for (const theme of THEME_ORDER) {
      map.set(
        theme,
        entries.filter((e) => e.theme === theme),
      );
    }
    return map;
  }, [entries]);

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.hadithTitle")}
      subtitle={t("jahannam.hadithSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/jahannam/hadith" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JannahCallout tone="info">{t("jahannam.hadithLead")}</JannahCallout>
            {THEME_ORDER.map((theme) => {
              const items = grouped.get(theme) ?? [];
              if (items.length === 0) return null;
              return (
                <Card key={theme} padding="three">
                  <SectionHeader
                    title={t(`jahannam.hadithTheme.${theme}`)}
                    icon={THEME_ICONS[theme]}
                  />
                  <LearnColumnsGrid columns={columns} gap={Spacing.three} style={styles.list}>
                    {items.map((entry) => (
                      <View
                        key={entry.id}
                        style={[
                          styles.quote,
                          columns > 1 && styles.quoteFill,
                          { backgroundColor: tokens.accentSoft },
                        ]}
                      >
                        <View style={styles.quoteMeta}>
                          <ThemedText type="caption" style={{ color: colors.accent, flex: 1 }}>
                            {entry.hadith.collection} · {entry.hadith.citation}
                          </ThemedText>
                          <View style={styles.quoteMetaActions}>
                            {entry.hadith.grade ? (
                              <Pill
                                label={t(`jahannam.grade.${entry.hadith.grade}`)}
                                compact
                                color={tokens.status.success.color}
                                background={tokens.status.success.soft}
                              />
                            ) : null}
                            <HadithCitationBookmarkButton
                              collection={entry.hadith.collection}
                              citation={entry.hadith.citation}
                            />
                          </View>
                        </View>
                        <TvReadableBlock>
                          <ScriptureMeaning english={entry.hadith.excerpt}>
                            {(text) => (
                              <ThemedText
                                type="small"
                                themeColor="mutedForeground"
                                style={{
                                  fontSize: sizes.translation,
                                  lineHeight: sizes.translation * 1.45,
                                  fontStyle: "italic",
                                }}
                              >
                                "{text}"
                              </ThemedText>
                            )}
                          </ScriptureMeaning>
                          {entry.context ? (
                            <ThemedText type="caption" themeColor="mutedForeground">
                              {entry.context}
                            </ThemedText>
                          ) : null}
                        </TvReadableBlock>
                      </View>
                    ))}
                  </LearnColumnsGrid>
                </Card>
              );
            })}
          </LearnReadingChrome>
          <JannahDisclaimer textKey="jahannam.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.two },
  quoteFill: { flexGrow: 1 },
  quote: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.two,
  },
  quoteMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  quoteMetaActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jahannam/hadith");
