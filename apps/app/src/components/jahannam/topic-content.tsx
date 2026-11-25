import type { JahannamTopic } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { GuideTopicFooter } from "@/components/guide-topic-footer";
import {
  HadithEvidence,
  JannahActionSteps,
  JannahBody,
  JannahTakeaway,
  QuranEvidence,
} from "@/components/jannah/primitives";
import { WarningLadderBlock } from "@/components/learn-mizan";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";

export function JahannamTopicContent({ topic }: { topic: JahannamTopic }) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.stack}>
      {/* Importance is a label, not a status — one neutral tone for every level (G-29). */}
      {topic.importance ? (
        <Pill label={t(`jahannam.importance.${topic.importance}`)} compact tone="neutral" />
      ) : null}

      <JannahTakeaway text={topic.summary} />
      <JannahBody paragraphs={topic.body} />

      {topic.id === "destructive-sins" && topic.destructiveItems?.length ? (
        <WarningLadderBlock items={topic.destructiveItems} />
      ) : null}

      {topic.quran?.length ? <QuranEvidence refs={topic.quran} /> : null}
      {topic.hadith?.length ? <HadithEvidence refs={topic.hadith} /> : null}
      {topic.actions?.length ? <JannahActionSteps steps={topic.actions} /> : null}

      {topic.appLinks?.length ? (
        <Card>
          <SectionHeader
            title={t("jahannam.relatedLessons")}
            icon={{ ios: "arrow.up.forward.app.fill", android: "open_in_new", web: "open_in_new" }}
          />
          <View style={styles.links}>
            {topic.appLinks.map((link) => (
              <Button
                key={link.route}
                label={link.label}
                variant="secondary"
                fullWidth
                onPress={() => router.push(link.route as never)}
              />
            ))}
          </View>
        </Card>
      ) : null}

      <GuideTopicFooter
        ns="jahannam"
        topic={topic}
        sectionTitle={t("jahannam.title")}
        showComplete={false}
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
  links: { gap: Spacing.two, marginTop: Spacing.three },
  topicDisclaimer: { paddingHorizontal: Spacing.one },
});
