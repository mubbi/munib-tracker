import type { SalahGuideTopic } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReligiousTextStack } from "@/components/content/religious-text-stack";
import { GuideTopicFooter } from "@/components/guide-topic-footer";
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
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { PAUSE_CIRCLE_ICON, PLAY_CIRCLE_ICON } from "@/constants/media-icons";
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

const RULING_TONE: Record<
  NonNullable<SalahGuideTopic["steps"]>[number]["ruling"] & string,
  "success" | "warning" | "info" | "danger"
> = {
  fard: "danger",
  wajib: "warning",
  sunnah: "info",
};

export type SalahGuideStepsAudioProps = {
  /** 0-based index of the sentence currently playing, when syncing audio. */
  activeStepIndex?: number | null;
  /** True when phrase or follow-along audio is actively playing. */
  isPlaying?: boolean;
  /** Play / seek this sentence (phrase queue or follow-along seek). */
  onPressStep?: (index: number) => void;
  /** Play the full phrase queue from the start (or pause if already active). */
  onPressPlayAll?: () => void;
  /** True when the phrase queue is the active audio session. */
  phrasesActive?: boolean;
  /** When set, only these steps are pressable (others have no Arabic clip). */
  hasAudioAtStep?: (index: number) => boolean;
  /**
   * Register a step row for auto-scroll while audio highlight moves
   * (`useScrollToActive` callback ref factory).
   */
  registerStep?: (index: number) => (node: View | null) => void;
};

function SalahGuideSteps({
  steps,
  audio,
}: {
  steps: NonNullable<SalahGuideTopic["steps"]>;
  audio?: SalahGuideStepsAudioProps;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();
  const hasAudio = audio?.onPressStep != null;

  return (
    <Card padding="three">
      <SectionHeader
        title={t("salahGuide.stepsTitle")}
        icon={{ ios: "list.number", android: "format_list_numbered", web: "format_list_numbered" }}
      />
      {hasAudio ? (
        <View style={styles.phraseControls}>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.phraseHint}>
            {t("salahGuide.adhan.learnPhrasesHint")}
          </ThemedText>
          {audio?.onPressPlayAll ? (
            <Button
              label={
                audio.phrasesActive && audio.isPlaying
                  ? t("salahGuide.adhan.pausePhrases")
                  : t("salahGuide.adhan.playPhrases")
              }
              variant="secondary"
              fullWidth
              icon={audio.phrasesActive && audio.isPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
              onPress={audio.onPressPlayAll}
            />
          ) : null}
        </View>
      ) : null}
      <View style={styles.steps}>
        {steps.map((step, index) => {
          const isActive = audio?.activeStepIndex === index;
          const stepHasAudio = audio?.hasAudioAtStep ? audio.hasAudioAtStep(index) : hasAudio;
          const row = (
            <>
              <View
                style={[
                  styles.stepBadge,
                  {
                    backgroundColor: isActive ? colors.accent : tokens.accentSoft,
                  },
                ]}
              >
                <ThemedText
                  type="smallBold"
                  style={{ color: isActive ? colors.accentText : colors.accent }}
                >
                  {index + 1}
                </ThemedText>
              </View>
              <View style={styles.stepCopy}>
                <View style={styles.stepHeader}>
                  <ThemedText type="smallBold" style={styles.stepTitle}>
                    {step.title}
                  </ThemedText>
                  {step.ruling ? (
                    <Pill
                      label={t(`salahGuide.ruling.${step.ruling}`)}
                      compact
                      color={tokens.status[RULING_TONE[step.ruling]].color}
                      background={tokens.status[RULING_TONE[step.ruling]].soft}
                    />
                  ) : null}
                </View>
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
                {step.arabic || step.transliteration || step.translation ? (
                  <View style={styles.phraseBlock}>
                    {stepHasAudio ? (
                      <IconWell
                        icon={isActive && audio?.isPlaying ? PAUSE_CIRCLE_ICON : PLAY_CIRCLE_ICON}
                        size={14}
                        well={28}
                        radius={Radius.sm}
                        tint={isActive ? colors.accent : colors.mutedForeground}
                        background={isActive ? tokens.accentSoft : colors.card}
                        style={styles.phrasePlayCue}
                      />
                    ) : null}
                    <View style={styles.phraseText}>
                      <ReligiousTextStack
                        arabic={step.arabic}
                        transliteration={step.transliteration}
                        translation={step.translation}
                        compact
                      />
                    </View>
                  </View>
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
            </>
          );

          if (!hasAudio || !stepHasAudio) {
            return (
              <View key={step.title} ref={audio?.registerStep?.(index)} style={styles.stepRow}>
                {row}
              </View>
            );
          }

          return (
            <PressableScale
              key={step.title}
              ref={audio?.registerStep?.(index)}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("salahGuide.adhan.playPhrase", {
                n: index + 1,
                title: step.title,
              })}
              onPress={() => audio?.onPressStep?.(index)}
              style={[
                styles.stepRow,
                styles.stepRowPressable,
                {
                  backgroundColor: isActive ? tokens.accentSoft : colors.muted,
                  borderColor: isActive ? colors.accent : "transparent",
                },
              ]}
            >
              {row}
            </PressableScale>
          );
        })}
      </View>
    </Card>
  );
}

export function SalahGuideTopicContent({
  topic,
  stepsAudio,
}: {
  topic: SalahGuideTopic;
  stepsAudio?: SalahGuideStepsAudioProps;
}) {
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
      {topic.steps?.length ? <SalahGuideSteps steps={topic.steps} audio={stepsAudio} /> : null}
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

      <GuideTopicFooter
        ns="salahGuide"
        topic={topic}
        sectionTitle={t("salahGuide.title")}
        completed={completed}
        onToggleComplete={() => void toggleTopic(topic.id)}
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
  phraseControls: { gap: Spacing.two, marginTop: Spacing.three },
  phraseHint: { lineHeight: 18 },
  steps: { gap: Spacing.three, marginTop: Spacing.three },
  stepRow: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  stepRowPressable: {
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCopy: { flex: 1, gap: Spacing.one },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  stepTitle: { flexShrink: 1 },
  stepBody: {},
  phraseBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  phrasePlayCue: {
    marginTop: 2,
    // Decorative — the step row PressableScale already handles play/pause.
    pointerEvents: "none",
  },
  phraseText: { flex: 1, minWidth: 0 },
  tip: {
    marginTop: Spacing.one,
    padding: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  links: { gap: Spacing.two, marginTop: Spacing.three },
  topicDisclaimer: { lineHeight: 18, paddingHorizontal: Spacing.one },
});
