import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ensureIslamicHistoryContent,
  getIslamicHistoryEvents,
  isIslamicHistoryContentReady,
} from "@/lib/islamic-history";
import { goBackOrReplace } from "@/lib/navigation";

export default function HistoryScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureIslamicHistoryContent,
    isIslamicHistoryContentReady,
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const events = useMemo(() => getIslamicHistoryEvents(), [i18n.language, contentVersion]);
  const listenText = useMemo(
    () => events.map((event) => `${event.title}. ${event.body}`).join("\n\n"),
    [events],
  );

  return (
    <ScreenLayout
      eyebrow={t("history.eyebrow")}
      title={t("history.title")}
      subtitle={t("history.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/history" />
      <LearnReadingChrome surface="battles" listenText={listenText}>
        <LearnContentGate ready={contentReady}>
          <Stagger>
            <LearnQuizNavRow
              quizPath={"/history/quiz" as Href}
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
                      label={t("history.ceBadge", { year: event.year })}
                      compact
                      color={colors.accentText}
                      background={tokens.accentSoft}
                    />
                    {event.ah != null ? (
                      <Pill
                        label={t("history.ahBadge", { ah: event.ah })}
                        compact
                        color={tokens.status.success.color}
                        background={tokens.status.success.soft}
                      />
                    ) : null}
                    <Pill
                      label={t(`history.era.${event.era}`)}
                      compact
                      color={tokens.status.info.color}
                      background={tokens.status.info.soft}
                    />
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
                  <LearnProseText proseRole="title" style={styles.title}>
                    {event.title}
                  </LearnProseText>
                  <LearnProseText themeColor="mutedForeground">{event.body}</LearnProseText>
                </Card>
              </View>
            ))}
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
              {t("history.disclaimer")}
            </ThemedText>
          </Stagger>
        </LearnContentGate>
      </LearnReadingChrome>
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
