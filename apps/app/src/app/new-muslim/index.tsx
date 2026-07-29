import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { getNewMuslimSectionOrder, getNewMuslimTopicsBySection } from "@/lib/new-muslim";

const SECTION_ICONS: Record<string, AppIcon> = {
  start: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  pillars: { ios: "checklist", android: "checklist", web: "checklist" },
  faith: { ios: "circle.hexagongrid.fill", android: "hub", web: "hub" },
  prayer: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  "next-steps": {
    ios: "chart.line.uptrend.xyaxis",
    android: "trending_up",
    web: "trending_up",
  },
  faq: { ios: "questionmark.circle", android: "help", web: "help" },
};

export default function NewMuslimScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topicsBySection = useMemo(
    () => getNewMuslimTopicsBySection(),
    [i18n.language, overlayVersion],
  );
  const sectionOrder = getNewMuslimSectionOrder();

  return (
    <ScreenLayout
      eyebrow={t("newMuslim.eyebrow")}
      title={t("newMuslim.title")}
      subtitle={t("newMuslim.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/new-muslim" />
      <Stagger>
        <JannahCallout tone="info">{t("newMuslim.intro")}</JannahCallout>

        <LearnQuizNavRow
          quizPath={"/new-muslim/quiz" as Href}
          titleKey="common.learnQuiz.title"
          subtitleKey="common.learnQuiz.hint"
        />

        {sectionOrder.map((section) => {
          const topics = topicsBySection[section];
          if (!topics?.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`newMuslim.section.${section}`)}
                icon={
                  SECTION_ICONS[section] ?? {
                    ios: "book.fill",
                    android: "menu_book",
                    web: "menu_book",
                  }
                }
              />
              <View style={styles.rows}>
                {topics.map((topic) => (
                  <JannahNavRow
                    key={topic.id}
                    icon={{ ios: "text.book.closed", android: "article", web: "article" }}
                    title={topic.title}
                    subtitle={topic.summary}
                    onPress={() =>
                      router.push({
                        pathname: "/new-muslim/[topic]",
                        params: { topic: topic.id },
                      } as Href)
                    }
                  />
                ))}
              </View>
            </Card>
          );
        })}

        <JannahDisclaimer textKey="newMuslim.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
