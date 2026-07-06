import type { SalahGuideTopic } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReligiousTextStack } from "@/components/content/religious-text-stack";
import {
  JannahActionSteps,
  JannahBody,
  JannahHadithEvidence,
  JannahQuranEvidence,
  JannahTakeaway,
} from "@/components/jannah/primitives";
import { useReadingTypography } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  useSalahGuideProgressActions,
  useSalahGuideTopicCompleted,
} from "@/stores/salah-guide-progress-store";

const IMPORTANCE_TONE: Record<
  NonNullable<SalahGuideTopic["importance"]>,
  "success" | "warning" | "info" | "danger"
> = {
  foundational: "danger",
  obligatory: "success",
  "highly-recommended": "info",
  recommended: "warning",
};

function SalahGuideSteps({ steps }: { steps: NonNullable<SalahGuideTopic["steps"]> }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();

  return (
    <Card padding="three">
      <SectionHeader
        title={t("salahGuide.stepsTitle")}
        icon={{ ios: "list.number", android: "format_list_numbered", web: "format_list_numbered" }}
      />
      <View style={styles.steps}>
        {steps.map((step, index) => (
          <View key={step.title} style={styles.stepRow}>
            <View style={[styles.stepBadge, { backgroundColor: tokens.accentSoft }]}>
              <ThemedText type="smallBold" style={{ color: colors.accent }}>
                {index + 1}
              </ThemedText>
            </View>
            <View style={styles.stepCopy}>
              <ThemedText type="smallBold">{step.title}</ThemedText>
              <ThemedText
                type="small"
                themeColor="mutedForeground"
                style={[
                  styles.stepBody,
                  { fontSize: sizes.translation, lineHeight: sizes.translation * 1.45 },
                ]}
              >
                {step.body}
              </ThemedText>
              {step.arabic || step.transliteration ? (
                <ReligiousTextStack
                  arabic={step.arabic}
                  transliteration={step.transliteration}
                  compact
                />
              ) : null}
              {step.tip ? (
                <View style={[styles.tip, { backgroundColor: tokens.status.warning.soft }]}>
                  <ThemedText
                    type="caption"
                    style={{
                      color: colors.foreground,
                      fontSize: sizes.transliteration,
                      lineHeight: sizes.transliteration * 1.35,
                    }}
                  >
                    {step.tip}
                  </ThemedText>
                </View>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

export function SalahGuideTopicContent({ topic }: { topic: SalahGuideTopic }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { tokens } = useThemeTokens();
  const completed = useSalahGuideTopicCompleted(topic.id);
  const { toggleTopic } = useSalahGuideProgressActions();

  return (
    <View style={styles.stack}>
      {topic.importance ? (
        <Pill
          label={t(`salahGuide.importance.${topic.importance}`)}
          compact
          color={tokens.status[IMPORTANCE_TONE[topic.importance]].color}
          background={tokens.status[IMPORTANCE_TONE[topic.importance]].soft}
        />
      ) : null}

      <JannahTakeaway text={topic.summary} />
      <JannahBody paragraphs={topic.body} />

      {topic.quran?.length ? <JannahQuranEvidence refs={topic.quran} /> : null}
      {topic.hadith?.length ? <JannahHadithEvidence refs={topic.hadith} /> : null}
      {topic.steps?.length ? <SalahGuideSteps steps={topic.steps} /> : null}
      {topic.actions?.length ? <JannahActionSteps steps={topic.actions} /> : null}

      {topic.appLinks?.length ? (
        <Card padding="three">
          <SectionHeader
            title={t("salahGuide.continueInApp")}
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

      <Button
        label={completed ? t("salahGuide.markIncomplete") : t("salahGuide.markComplete")}
        variant={completed ? "secondary" : "primary"}
        fullWidth
        onPress={() => void toggleTopic(topic.id)}
      />

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
  steps: { gap: Spacing.three, marginTop: Spacing.three },
  stepRow: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCopy: { flex: 1, gap: Spacing.one },
  stepBody: {},
  tip: {
    marginTop: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  links: { gap: Spacing.two, marginTop: Spacing.three },
  topicDisclaimer: { lineHeight: 18, paddingHorizontal: Spacing.one },
});
