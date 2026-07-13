import { type Href, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureQuranGuideContent, getQuranGuideTajweedLessons } from "@/lib/quran-guide";

export default function LearnQuranTajweedScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors } = useThemeTokens();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void ensureQuranGuideContent().then(() => setReady(true));
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const lessons = useMemo(
    () => (ready ? getQuranGuideTajweedLessons() : []),
    [i18n.language, ready],
  );

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.tajweedTitle")}
      subtitle={t("learnQuran.tajweedSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/tajweed" />
      <Stagger>
        <JannahCallout tone="info">{t("learnQuran.tajweedIntro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("learnQuran.tajweedListTitle")}
            icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
          />
          {!ready ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : (
            <View style={styles.rows}>
              {lessons.map((lesson) => (
                <JannahNavRow
                  key={lesson.id}
                  icon={{ ios: "music.note", android: "music_note", web: "music_note" }}
                  title={lesson.title}
                  subtitle={lesson.summary}
                  onPress={() =>
                    router.push({
                      pathname: "/learn-quran/tajweed/[id]",
                      params: { id: lesson.id },
                    })
                  }
                />
              ))}
            </View>
          )}
        </Card>

        <JannahDisclaimer textKey="learnQuran.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: Spacing.five, alignItems: "center" },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
