import type { LearnDuaTopic } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { GuideTopicFooter } from "@/components/guide-topic-footer";
import {
  JannahActionSteps,
  JannahBody,
  JannahDuaBlock,
  JannahHadithEvidence,
  JannahQuranEvidence,
  JannahTakeaway,
} from "@/components/jannah/primitives";
import { LearnGrid } from "@/components/learn-guide/learn-wide-layout";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { usePassageLabel } from "@/components/quran/recite-along-label";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { learnDuaPhrasePassage } from "@/lib/recite-along/learn-dua";
import {
  useLearnDuaProgressActions,
  useLearnDuaTopicCompleted,
} from "@/stores/learn-dua-progress-store";

const IMPORTANCE_TONE: Record<
  NonNullable<LearnDuaTopic["importance"]>,
  "success" | "warning" | "info" | "danger"
> = {
  foundational: "danger",
  obligatory: "success",
  "highly-recommended": "info",
  recommended: "warning",
};

export function LearnDuaTopicContent({ topic }: { topic: LearnDuaTopic }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const completed = useLearnDuaTopicCompleted(topic.id);
  const { toggleTopic } = useLearnDuaProgressActions();
  const passageLabel = usePassageLabel();

  return (
    <View style={styles.stack}>
      {topic.importance ? (
        <Pill
          label={t(`learnDua.importance.${topic.importance}`)}
          compact
          color={tokens.status[IMPORTANCE_TONE[topic.importance]].color}
          background={tokens.status[IMPORTANCE_TONE[topic.importance]].soft}
        />
      ) : null}

      <JannahTakeaway text={topic.summary} />
      <JannahBody paragraphs={topic.body} />

      {topic.phrases?.map((phrase) => {
        // D68: a dua in Qur'anic words → recite the cited ayah(s) along.
        const recitePassage = learnDuaPhrasePassage(topic.id, phrase.id);
        return (
          <View key={phrase.id} style={styles.phraseStack}>
            <JannahDuaBlock
              title={`${phrase.title} — ${phrase.when}`}
              arabic={phrase.arabic}
              transliteration={phrase.transliteration}
              translation={phrase.translation}
              reference={phrase.reference}
            />
            {phrase.variants?.map((variant, index) => (
              <JannahDuaBlock
                key={`${phrase.id}-variant-${variant.reference ?? index}`}
                title={t("zikr.alternateWording")}
                arabic={variant.arabic}
                transliteration={variant.transliteration}
                translation={variant.translation ?? phrase.translation}
                reference={variant.reference}
              />
            ))}
            {recitePassage ? (
              <ReciteAlongButton
                passage={recitePassage}
                label={t("reciteAlong.withPassage", { passage: passageLabel(recitePassage) })}
                variant="ghost"
                size="sm"
                style={styles.recite}
              />
            ) : null}
          </View>
        );
      })}

      {topic.quran?.length ? <JannahQuranEvidence refs={topic.quran} /> : null}
      {topic.hadith?.length ? <JannahHadithEvidence refs={topic.hadith} /> : null}
      {topic.actions?.length ? <JannahActionSteps steps={topic.actions} /> : null}

      {topic.appLinks?.length ? (
        <Card padding="three">
          <SectionHeader
            title={t("learnDua.continueInApp")}
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
        ns="learnDua"
        topic={topic}
        sectionTitle={t("learnDua.title")}
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
  phraseStack: { gap: Spacing.three },
  recite: { alignSelf: "flex-start" },
  links: { gap: Spacing.two, marginTop: Spacing.three },
  topicDisclaimer: { lineHeight: 18, paddingHorizontal: Spacing.one },
});
