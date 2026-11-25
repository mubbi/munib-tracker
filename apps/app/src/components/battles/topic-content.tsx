import type { BattlesTopic } from "@munib-tracker/shared/types";
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
  useBattlesProgressActions,
  useBattlesTopicCompleted,
} from "@/stores/battles-progress-store";

const IMPORTANCE_TONE: Record<
  NonNullable<BattlesTopic["importance"]>,
  "success" | "warning" | "info" | "danger"
> = {
  foundational: "danger",
  obligatory: "success",
  "highly-recommended": "info",
  recommended: "warning",
};

function BattlesBattleDetailsCard({
  details,
}: {
  details: NonNullable<BattlesTopic["battleDetails"]>;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();

  const rows: { label: string; value: string }[] = [
    { label: t("battles.detail.location"), value: details.location },
    ...(details.modernLocation
      ? [{ label: t("battles.detail.modernLocation"), value: details.modernLocation }]
      : []),
    ...(details.hijriDate ? [{ label: t("battles.detail.hijri"), value: details.hijriDate }] : []),
    ...(details.gregorianYear
      ? [{ label: t("battles.detail.year"), value: String(details.gregorianYear) }]
      : []),
    ...(details.muslimForces
      ? [{ label: t("battles.detail.muslimForces"), value: details.muslimForces }]
      : []),
    ...(details.opposingForces
      ? [{ label: t("battles.detail.opposingForces"), value: details.opposingForces }]
      : []),
    ...(details.muslimCommander
      ? [{ label: t("battles.detail.muslimCommander"), value: details.muslimCommander }]
      : []),
    ...(details.opposingCommander
      ? [{ label: t("battles.detail.opposingCommander"), value: details.opposingCommander }]
      : []),
    ...(details.weather ? [{ label: t("battles.detail.weather"), value: details.weather }] : []),
    { label: t("battles.detail.outcome"), value: details.outcome },
  ];

  return (
    <Card>
      <SectionHeader
        title={t("battles.detailTitle")}
        icon={{ ios: "map.fill", android: "map", web: "map" }}
      />
      <TvReadableBlock>
        <View style={styles.detailRows}>
          {rows.map((row) => (
            <View key={row.label} style={[styles.detailRow, { borderTopColor: tokens.hairline }]}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {row.label}
              </ThemedText>
              <LearnProseText>{row.value}</LearnProseText>
            </View>
          ))}
        </View>
      </TvReadableBlock>

      {details.keyEvents.length ? (
        <TvReadableBlock>
          <View style={styles.subsection}>
            <ThemedText type="smallBold">{t("battles.detail.keyEvents")}</ThemedText>
            {details.keyEvents.map((event) => (
              <LearnProseText key={event} themeColor="mutedForeground">
                • {event}
              </LearnProseText>
            ))}
          </View>
        </TvReadableBlock>
      ) : null}

      <TvReadableBlock>
        <View style={[styles.lessonBox, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="caption" style={{ color: tokens.accentOnSoft }}>
            {t("battles.detail.leadership")}
          </ThemedText>
          <LearnProseText>{details.leadershipLesson}</LearnProseText>
        </View>

        <View style={[styles.lessonBox, { backgroundColor: tokens.status.success.soft }]}>
          <ThemedText type="caption" style={{ color: tokens.status.success.onSoft }}>
            {t("battles.detail.spiritual")}
          </ThemedText>
          <LearnProseText>{details.spiritualLesson}</LearnProseText>
        </View>
      </TvReadableBlock>

      {details.facts?.length ? (
        <TvReadableBlock>
          <View style={styles.subsection}>
            <ThemedText type="smallBold">{t("battles.detail.facts")}</ThemedText>
            {details.facts.map((fact) => (
              <ThemedText key={fact} type="caption" themeColor="mutedForeground">
                • {fact}
              </ThemedText>
            ))}
          </View>
        </TvReadableBlock>
      ) : null}
    </Card>
  );
}

export function BattlesTopicContent({ topic }: { topic: BattlesTopic }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const completed = useBattlesTopicCompleted(topic.id);
  const { toggleTopic } = useBattlesProgressActions();

  return (
    <View style={styles.stack}>
      {topic.importance ? (
        <Pill
          label={t(`battles.importance.${topic.importance}`)}
          compact
          color={tokens.status[IMPORTANCE_TONE[topic.importance]].color}
          background={tokens.status[IMPORTANCE_TONE[topic.importance]].soft}
        />
      ) : null}

      <JannahTakeaway text={topic.summary} />
      <JannahBody paragraphs={topic.body} />

      {topic.battleDetails ? <BattlesBattleDetailsCard details={topic.battleDetails} /> : null}

      {topic.quran?.length ? <JannahQuranEvidence refs={topic.quran} /> : null}
      {topic.hadith?.length ? <JannahHadithEvidence refs={topic.hadith} /> : null}
      {topic.actions?.length ? <JannahActionSteps steps={topic.actions} /> : null}

      {topic.appLinks?.length ? (
        <Card>
          <SectionHeader
            title={t("battles.continueInApp")}
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
        ns="battles"
        topic={topic}
        sectionTitle={t("battles.title")}
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
