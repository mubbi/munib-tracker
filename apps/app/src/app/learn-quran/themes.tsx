import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideThemes,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";

export default function LearnQuranThemesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const themes = getQuranGuideThemes();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.themesTitle")}
      subtitle={t("learnQuran.themesSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/themes" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("learnQuran.themesIntro")}</JannahCallout>

          <Card padding="three">
            <SectionHeader
              title={t("learnQuran.themesListTitle")}
              icon={{ ios: "tag.fill", android: "label", web: "label" }}
            />
            <View style={styles.rows}>
              {themes.map((theme) => (
                <JannahNavRow
                  key={theme.id}
                  icon={{ ios: "leaf.fill", android: "park", web: "park" }}
                  title={theme.title}
                  subtitle={theme.summary}
                  onPress={() =>
                    router.push({
                      pathname: "/learn-quran/theme/[id]",
                      params: { id: theme.id },
                    })
                  }
                />
              ))}
            </View>
          </Card>

          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
