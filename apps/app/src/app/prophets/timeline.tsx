import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnTwoColumnTimeline,
  useLearnTimelineTwoColumn,
} from "@/components/learn-guide/learn-timeline";
import { useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { ensureProphetsContent, getProphetsTimeline, isProphetsContentReady } from "@/lib/prophets";
import { useChevronForward } from "@/lib/rtl";

const noop = () => {};

export default function ProphetsTimelineScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const { ready: contentReady } = useEnsureContent(ensureProphetsContent, isProphetsContentReady);
  const events = getProphetsTimeline();
  const tv = isTV();
  const { maxContentWidth } = useLearnWideLayout();
  // Desktop: staggered two-column timeline across the wide canvas.
  const twoColumn = useLearnTimelineTwoColumn();

  const renderCard = (event: (typeof events)[number]) => (
    <PressableScale
      haptic="light"
      // TV: keep link-less events focusable so the D-pad can scroll the timeline.
      disabled={!event.prophetId && !tv}
      accessibilityRole={event.prophetId ? "button" : "text"}
      onPress={
        event.prophetId
          ? () =>
              router.push({
                pathname: "/prophets/[topic]",
                params: { topic: event.prophetId ?? "" },
              })
          : tv
            ? noop
            : undefined
      }
      style={twoColumn ? styles.timelineCardPressable : styles.cardPressable}
    >
      <Card padding="three" style={twoColumn ? undefined : styles.card}>
        <View style={styles.badges}>
          <Pill
            label={event.era}
            compact
            color={colors.accentText}
            background={tokens.accentSoft}
          />
        </View>
        <ThemedText type="smallBold" style={styles.title}>
          {event.title}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {event.body}
        </ThemedText>
        {event.prophetId ? (
          <View style={styles.linkRow}>
            <ThemedText type="caption" style={{ color: colors.accent }}>
              {t("prophets.readTopic")}
            </ThemedText>
            <SymbolView name={chevronForwardIcon} size={12} tintColor={colors.accent} />
          </View>
        ) : null}
      </Card>
    </PressableScale>
  );

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={t("prophets.timelineTitle")}
      subtitle={t("prophets.timelineSubtitle")}
      onBack={() => goBackOrReplace(router, "/prophets" as Href)}
      maxContentWidth={twoColumn ? maxContentWidth : undefined}
    >
      <Seo path="/prophets/timeline" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("prophets.timelineIntro")}</JannahCallout>

          {twoColumn ? (
            <LearnTwoColumnTimeline
              items={events}
              keyOf={(event) => event.id}
              renderCard={renderCard}
            />
          ) : null}
          {twoColumn
            ? null
            : events.map((event, index) => (
                <View key={event.id} style={styles.row}>
                  <View style={styles.railColumn}>
                    <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                    {index < events.length - 1 ? (
                      <View style={[styles.rail, { backgroundColor: tokens.hairline }]} />
                    ) : null}
                  </View>
                  {renderCard(event)}
                </View>
              ))}

          <JannahDisclaimer textKey="prophets.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.three },
  railColumn: { alignItems: "center", width: 16, paddingTop: Spacing.three },
  dot: { width: 12, height: 12, borderRadius: Radius.pill },
  rail: { width: 2, flex: 1, marginTop: Spacing.one },
  timelineCardPressable: {
    marginBottom: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  cardPressable: {
    flex: 1,
    marginBottom: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
  },
  card: { flex: 1 },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
    marginBottom: Spacing.two,
  },
  title: { marginBottom: Spacing.one },
  linkRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one, marginTop: Spacing.two },
});
