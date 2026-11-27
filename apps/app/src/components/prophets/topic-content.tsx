import type { ProphetsTopic } from "@munib-tracker/shared/types";
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
import { LearnProseText } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  useProphetsProgressActions,
  useProphetsTopicCompleted,
} from "@/stores/prophets-progress-store";

const IMPORTANCE_TONE: Record<
  NonNullable<ProphetsTopic["importance"]>,
  "success" | "warning" | "info" | "danger"
> = {
  foundational: "danger",
  obligatory: "success",
  "highly-recommended": "info",
  recommended: "warning",
};

export function ProphetsProfileCard({
  profile,
}: {
  profile: NonNullable<ProphetsTopic["profile"]>;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();

  const rows: { label: string; value: string }[] = [
    ...(profile.nation ? [{ label: t("prophets.profile.nation"), value: profile.nation }] : []),
    ...(profile.location
      ? [{ label: t("prophets.profile.location"), value: profile.location }]
      : []),
    ...(profile.era ? [{ label: t("prophets.profile.era"), value: profile.era }] : []),
    ...(profile.mission ? [{ label: t("prophets.profile.mission"), value: profile.mission }] : []),
  ];

  return (
    <Card>
      <SectionHeader
        title={t("prophets.profileTitle")}
        icon={{ ios: "person.fill", android: "person", web: "person" }}
      />
      {rows.length ? (
        // TV: each profile block is a D-pad stop so the long card scrolls by remote.
        <TvReadableBlock>
          <View style={styles.detailRows}>
            <LearnGrid maxColumns={2} gap={Spacing.three} passthrough>
              {rows.map((row) => (
                <View
                  key={row.label}
                  style={[styles.detailRow, { borderTopColor: tokens.hairline }]}
                >
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {row.label}
                  </ThemedText>
                  <LearnProseText>{row.value}</LearnProseText>
                </View>
              ))}
            </LearnGrid>
          </View>
        </TvReadableBlock>
      ) : null}

      {/* Tablet / desktop: challenges · miracles · events side by side. */}
      <LearnGrid maxColumns={2} gap={Spacing.three} passthrough>
        {profile.challenges?.length ? (
          <TvReadableBlock>
            <View style={styles.subsection}>
              <ThemedText type="smallBold">{t("prophets.profile.challenges")}</ThemedText>
              {profile.challenges.map((item) => (
                <LearnProseText key={item} themeColor="mutedForeground">
                  • {item}
                </LearnProseText>
              ))}
            </View>
          </TvReadableBlock>
        ) : null}

        {profile.miracles?.length ? (
          <TvReadableBlock>
            <View style={styles.subsection}>
              <ThemedText type="smallBold">{t("prophets.profile.miracles")}</ThemedText>
              {profile.miracles.map((item) => (
                <LearnProseText key={item} themeColor="mutedForeground">
                  • {item}
                </LearnProseText>
              ))}
            </View>
          </TvReadableBlock>
        ) : null}

        {profile.majorEvents?.length ? (
          <TvReadableBlock>
            <View style={styles.subsection}>
              <ThemedText type="smallBold">{t("prophets.profile.events")}</ThemedText>
              {profile.majorEvents.map((item) => (
                <LearnProseText key={item} themeColor="mutedForeground">
                  • {item}
                </LearnProseText>
              ))}
            </View>
          </TvReadableBlock>
        ) : null}
      </LearnGrid>

      {profile.lessons?.length ? (
        <TvReadableBlock>
          <View style={[styles.lessonBox, { backgroundColor: tokens.accentSoft }]}>
            <ThemedText type="caption" style={{ color: tokens.accentOnSoft }}>
              {t("prophets.profile.lessons")}
            </ThemedText>
            {profile.lessons.map((item) => (
              <LearnProseText key={item}>• {item}</LearnProseText>
            ))}
          </View>
        </TvReadableBlock>
      ) : null}

      {profile.facts?.length ? (
        <TvReadableBlock>
          <View style={styles.subsection}>
            <ThemedText type="smallBold">{t("prophets.profile.facts")}</ThemedText>
            {profile.facts.map((item) => (
              <ThemedText key={item} type="caption" themeColor="mutedForeground">
                • {item}
              </ThemedText>
            ))}
          </View>
        </TvReadableBlock>
      ) : null}
    </Card>
  );
}

export function ProphetsTopicContent({ topic }: { topic: ProphetsTopic }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const completed = useProphetsTopicCompleted(topic.id);
  const { toggleTopic } = useProphetsProgressActions();

  return (
    <View style={styles.stack}>
      {topic.importance ? (
        <Pill
          label={t(`prophets.importance.${topic.importance}`)}
          compact
          color={tokens.status[IMPORTANCE_TONE[topic.importance]].color}
          background={tokens.status[IMPORTANCE_TONE[topic.importance]].soft}
        />
      ) : null}

      <JannahTakeaway text={topic.summary} />
      <JannahBody paragraphs={topic.body} />

      {topic.profile ? <ProphetsProfileCard profile={topic.profile} /> : null}

      {topic.quran?.length ? <JannahQuranEvidence refs={topic.quran} /> : null}
      {topic.hadith?.length ? <JannahHadithEvidence refs={topic.hadith} /> : null}
      {topic.actions?.length ? <JannahActionSteps steps={topic.actions} /> : null}

      {topic.appLinks?.length ? (
        <Card>
          <SectionHeader
            title={t("prophets.continueInApp")}
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
        ns="prophets"
        topic={topic}
        sectionTitle={t("prophets.title")}
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
  detailRows: { marginTop: Spacing.three, gap: Spacing.two },
  detailRow: {
    gap: Spacing.half,
    paddingTop: Spacing.two,
    borderTopWidth: BorderWidth.hairline,
  },
  subsection: { marginTop: Spacing.three, gap: Spacing.one },
  lessonBox: {
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    gap: Spacing.one,
  },
  links: { gap: Spacing.two, marginTop: Spacing.three },
  topicDisclaimer: { paddingHorizontal: Spacing.one },
});
