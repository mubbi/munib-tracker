import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
  JannahActionSteps,
  JannahDisclaimer,
  JannahHadithEvidence,
  JannahQuranEvidence,
  JannahTakeaway,
} from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getQuranGuideTheme } from "@/lib/quran-guide";

export default function LearnQuranThemeDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = getQuranGuideTheme(id);

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={theme?.title ?? t("learnQuran.themesTitle")}
      subtitle={theme?.summary ?? ""}
      onBack={() =>
        router.canGoBack() ? router.back() : router.replace("/learn-quran/themes" as Href)
      }
    >
      <Seo path="/learn-quran/themes" />
      {!theme ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("learnQuran.notFound")}
          actionLabel={t("learnQuran.themesTitle")}
          onAction={() => router.replace("/learn-quran/themes" as Href)}
        />
      ) : (
        <Stagger>
          <LearnReadingChrome surface="learn_quran">
            <JannahTakeaway text={theme.summary} />
            <Card padding="three">
              <SectionHeader
                title={t("learnQuran.lessonsTitle")}
                icon={{ ios: "lightbulb.fill", android: "lightbulb", web: "lightbulb" }}
              />
              <View style={styles.lessons}>
                {theme.lessons.map((lesson) => (
                  <ThemedText key={lesson} type="small" themeColor="mutedForeground">
                    • {lesson}
                  </ThemedText>
                ))}
              </View>
            </Card>
            {theme.quran?.length ? <JannahQuranEvidence refs={theme.quran} /> : null}
            {theme.hadith?.length ? <JannahHadithEvidence refs={theme.hadith} /> : null}
            {theme.actions?.length ? <JannahActionSteps steps={theme.actions} /> : null}
            {theme.appLinks?.length ? (
              <View style={styles.links}>
                {theme.appLinks.map((link) => (
                  <Button
                    key={link.route}
                    label={link.label}
                    variant="secondary"
                    fullWidth
                    onPress={() => router.push(link.route as never)}
                  />
                ))}
              </View>
            ) : null}
          </LearnReadingChrome>
          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  lessons: { gap: Spacing.two, marginTop: Spacing.three },
  links: { gap: Spacing.two },
});
