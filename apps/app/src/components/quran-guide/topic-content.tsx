import type { QuranGuideTopic } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { GuideTopicFooter } from "@/components/guide-topic-footer";
import {
  JannahActionSteps,
  JannahBody,
  JannahHadithEvidence,
  JannahQuranEvidence,
  JannahTakeaway,
} from "@/components/jannah/primitives";
import { LearnGrid } from "@/components/learn-guide/learn-wide-layout";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  useQuranGuideProgressActions,
  useQuranGuideTopicCompleted,
} from "@/stores/quran-guide-progress-store";

export function QuranGuideTopicContent({ topic }: { topic: QuranGuideTopic }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useThemeTokens();
  const completed = useQuranGuideTopicCompleted(topic.id);
  const { toggleTopic } = useQuranGuideProgressActions();

  return (
    <View style={styles.stack}>
      {topic.comingSoon ? (
        <Pill
          label={t("learnQuran.comingSoon")}
          compact
          color={colors.mutedForeground}
          background={colors.muted}
        />
      ) : null}

      {topic.importance ? (
        <Pill
          label={t(`learnQuran.importance.${topic.importance}`)}
          compact
          color={colors.mutedForeground}
          background={colors.muted}
        />
      ) : null}

      <JannahTakeaway text={topic.summary} />
      <JannahBody paragraphs={topic.body} />

      {topic.quran?.length ? <JannahQuranEvidence refs={topic.quran} /> : null}
      {topic.hadith?.length ? <JannahHadithEvidence refs={topic.hadith} /> : null}
      {topic.actions?.length ? <JannahActionSteps steps={topic.actions} /> : null}

      {topic.sources?.length ? (
        <Card>
          <SectionHeader
            title={t("learnQuran.sourcesTitle")}
            icon={{ ios: "books.vertical.fill", android: "library_books", web: "library_books" }}
          />
          <View style={styles.sources}>
            {topic.sources.map((source) => (
              <ThemedText key={source} type="small" themeColor="mutedForeground">
                • {source}
              </ThemedText>
            ))}
          </View>
        </Card>
      ) : null}

      {topic.appLinks?.length ? (
        <Card>
          <SectionHeader
            title={t("learnQuran.continueInApp")}
            icon={{ ios: "arrow.up.forward.app.fill", android: "open_in_new", web: "open_in_new" }}
          />
          <View style={styles.links}>
            <LearnGrid maxColumns={2} gap={Spacing.two} passthrough>
              {topic.appLinks.map((link) => (
                <Button
                  key={link.route}
                  label={link.label}
                  variant="secondary"
                  fullWidth
                  onPress={() => router.push(link.route as never)}
                />
              ))}
            </LearnGrid>
          </View>
        </Card>
      ) : null}

      <GuideTopicFooter
        ns="learnQuran"
        topic={topic}
        sectionTitle={t("learnQuran.title")}
        completed={completed}
        onToggleComplete={() => void toggleTopic(topic.id)}
        showComplete={!topic.comingSoon}
      />

      {topic.disclaimer ? (
        <TvReadableBlock>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.topicDisclaimer}>
            {topic.disclaimer}
          </ThemedText>
        </TvReadableBlock>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.four },
  sources: { gap: Spacing.one, marginTop: Spacing.three },
  links: { gap: Spacing.two, marginTop: Spacing.three },
  topicDisclaimer: { paddingHorizontal: Spacing.one },
});
