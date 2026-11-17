import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useLearnHubLayout } from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureBattlesContent, getBattlesTimeline, isBattlesContentReady } from "@/lib/battles";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";

export default function BattlesTimelineScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const { ready: contentReady } = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const events = getBattlesTimeline();
  const wide = useLearnHubLayout();
  // Wide web / tablets: steps alternate either side of a centred rail.
  const zigzag = wide.contentWidth >= 760;

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.timelineTitle")}
      subtitle={t("battles.timelineSubtitle")}
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/battles/timeline" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("battles.timelineIntro")}</JannahCallout>

          {events.map((event, index) => {
            const card = (
              <PressableScale
                haptic="light"
                // TV: keep link-less events focusable so the D-pad can step
                // through (and scroll) the whole timeline.
                disabled={!event.topicId && !isTV()}
                accessibilityRole={event.topicId ? "button" : "text"}
                onPress={
                  event.topicId
                    ? () =>
                        router.push({
                          pathname: "/battles/[topic]",
                          params: { topic: event.topicId ?? "" },
                        })
                    : undefined
                }
                style={styles.cardPressable}
              >
                <Card padding="three" style={styles.card}>
                  <View style={styles.badges}>
                    <Pill
                      label={t("seerah.ceBadge", { year: event.year })}
                      compact
                      color={colors.accentText}
                      background={tokens.accentSoft}
                    />
                    {event.ah != null ? (
                      <Pill
                        label={t("seerah.ahBadge", { ah: event.ah })}
                        compact
                        color={tokens.status.success.color}
                        background={tokens.status.success.soft}
                      />
                    ) : null}
                    {event.location ? (
                      <View style={styles.location}>
                        <SymbolView
                          name={{ ios: "mappin", android: "place", web: "place" }}
                          size={11}
                          tintColor={colors.mutedForeground}
                        />
                        <ThemedText type="caption" themeColor="mutedForeground">
                          {event.location}
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>
                  <ThemedText type="smallBold" style={styles.title}>
                    {event.title}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {event.body}
                  </ThemedText>
                  {event.topicId ? (
                    <View style={styles.linkRow}>
                      <ThemedText type="caption" style={{ color: colors.accent }}>
                        {t("battles.readBattle")}
                      </ThemedText>
                      <SymbolView name={chevronForwardIcon} size={12} tintColor={colors.accent} />
                    </View>
                  ) : null}
                </Card>
              </PressableScale>
            );
            const rail = (
              <View style={styles.railColumn}>
                <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                {index < events.length - 1 ? (
                  <View style={[styles.rail, { backgroundColor: tokens.hairline }]} />
                ) : null}
              </View>
            );
            if (!zigzag) {
              return (
                <View key={event.id} style={styles.row}>
                  {rail}
                  {card}
                </View>
              );
            }
            const startSide = index % 2 === 0;
            return (
              <View key={event.id} style={styles.row}>
                <View style={styles.side}>{startSide ? card : null}</View>
                {rail}
                <View style={styles.side}>{startSide ? null : card}</View>
              </View>
            );
          })}

          <JannahDisclaimer textKey="battles.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.three },
  side: { flex: 1, minWidth: 0 },
  railColumn: { alignItems: "center", width: tvDp(16), paddingTop: Spacing.three },
  dot: { width: tvDp(12), height: tvDp(12), borderRadius: Radius.pill },
  rail: { width: tvDp(2), flex: 1, marginTop: Spacing.one },
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
  location: { flexDirection: "row", alignItems: "center", gap: 2 },
  title: { marginBottom: Spacing.one },
  linkRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one, marginTop: Spacing.two },
});
