import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import {
  LearnColumnsGrid,
  LearnTwoPane,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { FocusHighlight } from "@/components/ui/focus-highlight";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useScreenFocus } from "@/hooks/use-screen-focus";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import { getHajjGuideSectionOrder, getHajjGuideTopicsBySection } from "@/lib/hajj-guide";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";

const SECTION_ICONS: Record<string, AppIcon> = {
  virtues: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  obligation: { ios: "building.columns.fill", android: "mosque", web: "mosque" },
  types: { ios: "square.stack.3d.up.fill", android: "layers", web: "layers" },
  ihram: { ios: "person.fill", android: "person", web: "person" },
  umrah: { ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" },
  hajj: { ios: "map.fill", android: "map", web: "map" },
  rulings: { ios: "list.bullet.clipboard.fill", android: "fact_check", web: "fact_check" },
  prep: { ios: "suitcase.fill", android: "luggage", web: "luggage" },
};

export default function HajjScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { scrollRef, register, onScroll, isFocused } = useScreenFocus();
  const wide = useLearnHubLayout();
  // Columns inside cards: main column (card padding × 2 subtracted); asides stack.
  const navCols = learnColumnsFor(wide.mainWidth - Spacing.three * 2, { minCell: 280, max: 2 });
  const asideCols = wide.twoPane ? 1 : navCols;
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topicsBySection = useMemo(
    () => getHajjGuideTopicsBySection(),
    [i18n.language, overlayVersion],
  );
  const sectionOrder = getHajjGuideSectionOrder();

  const intro = <JannahCallout tone="info">{t("hajj.intro")}</JannahCallout>;

  const quizRow = (
    <LearnQuizNavRow
      quizPath={"/hajj/quiz" as Href}
      titleKey="common.learnQuiz.title"
      subtitleKey="common.learnQuiz.hint"
    />
  );

  const checklistsCard = (
    <Card padding="three">
      <SectionHeader
        title={t("hajj.checklistsTitle")}
        icon={{ ios: "checklist", android: "checklist", web: "checklist" }}
      />
      <LearnColumnsGrid columns={asideCols} style={styles.gridTop}>
        <JannahNavRow
          icon={{ ios: "map.fill", android: "map", web: "map" }}
          title={t("hajj.hajjChecklistTitle")}
          subtitle={t("hajj.hajjChecklistHint")}
          onPress={() => router.push("/hajj/checklist" as Href)}
        />
        <JannahNavRow
          icon={{
            ios: "arrow.triangle.2.circlepath",
            android: "sync",
            web: "sync",
          }}
          title={t("hajj.umrahChecklistTitle")}
          subtitle={t("hajj.umrahChecklistHint")}
          onPress={() => router.push("/umrah/checklist" as Href)}
        />
      </LearnColumnsGrid>
    </Card>
  );

  const sectionCards = sectionOrder.map((section) => {
    const topics = topicsBySection[section];
    if (!topics?.length) return null;
    return (
      <Card key={section} padding="three">
        <SectionHeader
          title={t(`hajj.section.${section}`)}
          icon={
            SECTION_ICONS[section] ?? {
              ios: "book.fill",
              android: "menu_book",
              web: "menu_book",
            }
          }
        />
        <LearnColumnsGrid columns={navCols} style={styles.gridTop}>
          {topics.map((topic) => (
            <FocusHighlight key={topic.id} ref={register(topic.id)} active={isFocused(topic.id)}>
              <JannahNavRow
                icon={{
                  ios: "text.book.closed",
                  android: "article",
                  web: "article",
                }}
                title={topic.title}
                subtitle={topic.summary}
                // TV: land the D-pad on the deep-linked topic.
                preferredFocus={isFocused(topic.id)}
                onPress={() =>
                  router.push({
                    pathname: "/hajj/[topic]",
                    params: { topic: topic.id },
                  } as unknown as Href)
                }
              />
            </FocusHighlight>
          ))}
        </LearnColumnsGrid>
      </Card>
    );
  });

  const disclaimer = <JannahDisclaimer textKey="hajj.disclaimer" />;

  return (
    <ScreenLayout
      eyebrow={t("hajj.eyebrow")}
      title={t("hajj.title")}
      subtitle={t("hajj.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
      scrollRef={scrollRef}
      onScroll={onScroll}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/hajj" />
      {wide.twoPane ? (
        <Stagger>
          {intro}
          <LearnTwoPane
            main={sectionCards}
            aside={
              <>
                {quizRow}
                {checklistsCard}
              </>
            }
          />
          {disclaimer}
        </Stagger>
      ) : (
        <Stagger>
          {intro}
          {quizRow}
          {checklistsCard}
          {sectionCards}
          {disclaimer}
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  gridTop: { marginTop: Spacing.three },
});
