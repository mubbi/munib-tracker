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
import { getRuqyahSectionOrder, getRuqyahTopicsBySection } from "@/lib/ruqyah";

const SECTION_ICONS: Record<string, AppIcon> = {
  basics: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  verses: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
  "daily-protection": { ios: "shield.fill", android: "shield", web: "shield" },
  reminders: { ios: "info.circle.fill", android: "info", web: "info" },
};

export default function RuqyahScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topicsBySection = useMemo(
    () => getRuqyahTopicsBySection(),
    [i18n.language, overlayVersion],
  );
  const sectionOrder = getRuqyahSectionOrder();

  return (
    <ScreenLayout
      eyebrow={t("ruqyah.eyebrow")}
      title={t("ruqyah.title")}
      subtitle={t("ruqyah.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/ruqyah" />
      <Stagger>
        <JannahCallout tone="info">{t("ruqyah.intro")}</JannahCallout>

        <LearnQuizNavRow
          quizPath={"/ruqyah/quiz" as Href}
          titleKey="common.learnQuiz.title"
          subtitleKey="common.learnQuiz.hint"
        />

        {sectionOrder.map((section) => {
          const topics = topicsBySection[section];
          if (!topics?.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`ruqyah.section.${section}`)}
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
                        pathname: "/ruqyah/[topic]",
                        params: { topic: topic.id },
                      } as Href)
                    }
                  />
                ))}
              </View>
            </Card>
          );
        })}

        <JannahDisclaimer textKey="ruqyah.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
