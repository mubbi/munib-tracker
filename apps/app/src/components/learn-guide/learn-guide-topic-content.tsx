import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { GuideTopicFooter } from "@/components/guide-topic-footer";
import {
  JannahActionSteps,
  JannahBody,
  JannahCallout,
  JannahHadithEvidence,
  JannahQuranEvidence,
  JannahTakeaway,
} from "@/components/jannah/primitives";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";

/**
 * Shared body for the newer `LearnGuideTopic`-shaped Learn modules (Laylat
 * al-Qadr, the two Eids, ruqyah, new Muslim, Islamic finance). Mirrors the
 * evidence/actions/appLinks layout established by `AqeedahTopicContent`, minus
 * per-lesson progress tracking (these modules don't have a progress store).
 */
export function LearnGuideTopicContent({
  topic,
  ns,
  sectionTitle,
}: {
  topic: LearnGuideTopic;
  /** i18n namespace that owns this module's `continueInApp` / share labels. */
  ns: string;
  /** Translated module title shown on the share card. */
  sectionTitle: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.stack}>
      <JannahTakeaway text={topic.summary} />
      <JannahBody paragraphs={topic.body} />

      {topic.quran?.length ? <JannahQuranEvidence refs={topic.quran} /> : null}
      {topic.hadith?.length ? <JannahHadithEvidence refs={topic.hadith} /> : null}

      {topic.madhhabNote ? <JannahCallout tone="info">{topic.madhhabNote}</JannahCallout> : null}

      {topic.actions?.length ? <JannahActionSteps steps={topic.actions} /> : null}

      {topic.appLinks?.length ? (
        <Card padding="three">
          <SectionHeader
            title={t(`${ns}.continueInApp`)}
            icon={{ ios: "arrow.up.forward.app.fill", android: "open_in_new", web: "open_in_new" }}
          />
          <View style={styles.links}>
            {topic.appLinks.map((link) => (
              <Button
                key={link.route}
                label={link.label}
                variant="secondary"
                fullWidth
                onPress={() => router.push(link.route as Href)}
              />
            ))}
          </View>
        </Card>
      ) : null}

      <GuideTopicFooter ns={ns} topic={topic} sectionTitle={sectionTitle} />

      {topic.disclaimer ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.topicDisclaimer}>
          {topic.disclaimer}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.four },
  links: { gap: Spacing.two, marginTop: Spacing.three },
  topicDisclaimer: { lineHeight: 18, paddingHorizontal: Spacing.one },
});
