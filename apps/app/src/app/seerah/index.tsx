import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { ensureSeerahContent, getSeerahEvents, isSeerahContentReady } from "@/lib/seerah";

export default function SeerahScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureSeerahContent,
    isSeerahContentReady,
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const events = useMemo(() => getSeerahEvents(), [i18n.language, contentVersion]);
  const listenText = useMemo(
    () => events.map((event) => `${event.title}. ${event.body}`).join("\n\n"),
    [events],
  );

  return (
    <ScreenLayout
      eyebrow={t("seerah.eyebrow")}
      title={t("seerah.title")}
      subtitle={t("seerah.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/seerah" />
      <LearnContentGate ready={contentReady}>
        <LearnReadingChrome surface="battles" listenText={listenText}>
          <Stagger>
            <LearnQuizNavRow
              quizPath={"/seerah/quiz" as Href}
              titleKey="common.learnQuiz.title"
              subtitleKey="common.learnQuiz.hint"
            />
            {events.map((event, index) => (
              <View key={event.id} style={styles.row}>
                <View style={styles.railColumn}>
                  <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                  {index < events.length - 1 ? (
                    <View style={[styles.rail, { backgroundColor: tokens.hairline }]} />
                  ) : null}
                </View>
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
                </Card>
              </View>
            ))}
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
              {t("seerah.disclaimer")}
            </ThemedText>
          </Stagger>
        </LearnReadingChrome>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: Spacing.three },
  railColumn: { alignItems: "center", width: 16, paddingTop: Spacing.three },
  dot: {
    width: 12,
    height: 12,
    borderRadius: Radius.pill,
  },
  rail: { width: 2, flex: 1, marginTop: Spacing.one },
  card: { flex: 1, marginBottom: Spacing.three },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexWrap: "wrap",
    marginBottom: Spacing.two,
  },
  location: { flexDirection: "row", alignItems: "center", gap: 2 },
  title: { marginBottom: Spacing.one },
  disclaimer: { textAlign: "center", marginBottom: Spacing.three },
});
