import type { AqeedahTopic } from "@munib-tracker/shared/types";
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
import { useReadingTypography } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  useAqeedahProgressActions,
  useAqeedahTopicCompleted,
} from "@/stores/aqeedah-progress-store";

const IMPORTANCE_TONE: Record<
  NonNullable<AqeedahTopic["importance"]>,
  "success" | "warning" | "info" | "danger"
> = {
  foundational: "danger",
  obligatory: "success",
  "highly-recommended": "info",
  recommended: "warning",
};

function AqeedahMisconceptions({ items }: { items: NonNullable<AqeedahTopic["misconceptions"]> }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();

  return (
    <Card padding="three">
      <SectionHeader
        title={t("aqeedah.misconceptionsTitle")}
        icon={{ ios: "exclamationmark.bubble.fill", android: "forum", web: "forum" }}
      />
      <View style={styles.misconceptions}>
        {items.map((item) => (
          // TV: each misconception is a D-pad stop so the remote can scroll it.
          <TvReadableBlock key={item}>
            <View style={[styles.misconceptionRow, { backgroundColor: tokens.status.info.soft }]}>
              <ThemedText
                type="small"
                style={{
                  color: colors.foreground,
                  fontSize: sizes.translation,
                  lineHeight: sizes.translation * 1.45,
                }}
              >
                {item}
              </ThemedText>
            </View>
          </TvReadableBlock>
        ))}
      </View>
    </Card>
  );
}

export function AqeedahTopicContent({ topic }: { topic: AqeedahTopic }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const completed = useAqeedahTopicCompleted(topic.id);
  const { toggleTopic } = useAqeedahProgressActions();

  return (
    <View style={styles.stack}>
      {topic.importance ? (
        <Pill
          label={t(`aqeedah.importance.${topic.importance}`)}
          compact
          color={tokens.status[IMPORTANCE_TONE[topic.importance]].color}
          background={tokens.status[IMPORTANCE_TONE[topic.importance]].soft}
        />
      ) : null}

      <JannahTakeaway text={topic.summary} />
      <JannahBody paragraphs={topic.body} />

      {topic.quran?.length ? <JannahQuranEvidence refs={topic.quran} /> : null}
      {topic.hadith?.length ? <JannahHadithEvidence refs={topic.hadith} /> : null}
      {topic.misconceptions?.length ? <AqeedahMisconceptions items={topic.misconceptions} /> : null}
      {topic.actions?.length ? <JannahActionSteps steps={topic.actions} /> : null}

      {topic.appLinks?.length ? (
        <Card padding="three">
          <SectionHeader
            title={t("aqeedah.continueInApp")}
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
        ns="aqeedah"
        topic={topic}
        sectionTitle={t("aqeedah.title")}
        completed={completed}
        onToggleComplete={() => void toggleTopic(topic.id)}
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
  misconceptions: { gap: Spacing.two, marginTop: Spacing.three },
  misconceptionRow: {
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  links: { gap: Spacing.two, marginTop: Spacing.three },
  topicDisclaimer: { lineHeight: 18, paddingHorizontal: Spacing.one },
});
