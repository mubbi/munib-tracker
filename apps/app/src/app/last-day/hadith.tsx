import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import {
  JannahCallout,
  JannahDisclaimer,
  JannahHadithEvidence,
} from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureLastDayContent, getLastDayHadith, isLastDayContentReady } from "@/lib/last-day";
import { goBackOrReplace } from "@/lib/navigation";

export default function LastDayHadithScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(ensureLastDayContent, isLastDayContentReady);
  const entries = getLastDayHadith();
  const wide = useLearnHubLayout();
  // Wide web / tablets: hadith entries sit two per row.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 380, max: 2 });

  const grouped = useMemo(() => {
    const map = new Map<string, typeof entries>();
    for (const entry of entries) {
      const list = map.get(entry.theme) ?? [];
      list.push(entry);
      map.set(entry.theme, list);
    }
    return map;
  }, [entries]);

  const themes = [...grouped.keys()];

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.hadithTitle")}
      subtitle={t("lastDay.hadithSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/last-day/hadith" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("lastDay.hadithIntro")}</JannahCallout>

          <LearnReadingChrome surface="last_day">
            {themes.map((theme) => {
              const items = grouped.get(theme) ?? [];
              return (
                <Card key={theme} padding="three">
                  <SectionHeader
                    title={t(`lastDay.hadithTheme.${theme}`)}
                    icon={{
                      ios: "text.book.closed.fill",
                      android: "auto_stories",
                      web: "auto_stories",
                    }}
                  />
                  <LearnColumnsGrid columns={columns} gap={Spacing.four} style={styles.list}>
                    {items.map((entry) => (
                      <View key={entry.id} style={styles.entry}>
                        <JannahHadithEvidence refs={[entry.hadith]} />
                        {entry.context ? (
                          <TvReadableBlock>
                            <ThemedText type="caption" themeColor="mutedForeground">
                              {entry.context}
                            </ThemedText>
                          </TvReadableBlock>
                        ) : null}
                      </View>
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
  entry: { gap: Spacing.two },
});
