import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  JannahCallout,
  JannahDisclaimer,
  JannahHadithEvidence,
} from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getLastDayHadith } from "@/lib/last-day";
import { goBackOrReplace } from "@/lib/navigation";

export default function LastDayHadithScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const entries = getLastDayHadith();

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
    >
      <Seo path="/last-day/hadith" />
      <Stagger>
        <JannahCallout tone="info">{t("lastDay.hadithIntro")}</JannahCallout>

        <LearnReadingChrome surface="last_day">
          {themes.map((theme) => {
            const items = grouped.get(theme) ?? [];
            return (
              <Card key={theme} padding="three" style={styles.card}>
                <SectionHeader
                  title={t(`lastDay.hadithTheme.${theme}`)}
                  icon={{
                    ios: "text.book.closed.fill",
                    android: "auto_stories",
                    web: "auto_stories",
                  }}
                />
                <View style={styles.list}>
                  {items.map((entry) => (
                    <View key={entry.id} style={styles.entry}>
                      <JannahHadithEvidence refs={[entry.hadith]} />
                      {entry.context ? (
                        <ThemedText type="caption" themeColor="mutedForeground">
                          {entry.context}
                        </ThemedText>
                      ) : null}
                    </View>
                  ))}
                </View>
              </Card>
            );
          })}
        </LearnReadingChrome>

        <JannahDisclaimer textKey="lastDay.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.three },
  list: { marginTop: Spacing.three, gap: Spacing.four },
  entry: { gap: Spacing.two },
});
