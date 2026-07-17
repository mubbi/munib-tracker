import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { FocusHighlight } from "@/components/ui/focus-highlight";
import { Pill } from "@/components/ui/pill";
import { Radius, Spacing } from "@/constants/theme";
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { useScreenFocus } from "@/hooks/use-screen-focus";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getUpcomingEvents } from "@/lib/islamic-events";
import { goBackOrReplace } from "@/lib/navigation";
import { useLocation } from "@/stores/location-store";

export default function IslamicEventsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { formatIso } = useFormatCalendarDate();
  const { scrollRef, register, onScroll, isFocused } = useScreenFocus();
  const location = useLocation();

  const events = useMemo(
    () => getUpcomingEvents(undefined, 12, location.timeZone),
    [location.timeZone],
  );

  const formatDate = (iso: string) =>
    formatIso(iso, {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const countdown = (days: number) =>
    days === 0 ? t("events.today") : t("events.inDays", { count: days });

  return (
    <ScreenLayout
      eyebrow={t("events.eyebrow")}
      title={t("events.title")}
      subtitle={t("events.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path="/events" />
      <View style={styles.list}>
        <LearnQuizNavRow
          quizPath={"/events/quiz" as Href}
          titleKey="common.learnQuiz.title"
          subtitleKey="common.learnQuiz.hint"
        />
        {events.map((event) => (
          <FocusHighlight
            key={`${event.id}-${event.hijriYear}`}
            ref={register(event.id)}
            active={isFocused(event.id)}
          >
            <Card padding="three">
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: tokens.accentSoft }]}>
                  <SymbolView
                    name={{ ios: "star.fill", android: "star", web: "star" }}
                    size={18}
                    tintColor={colors.accent}
                  />
                </View>
                <View style={styles.body}>
                  <ThemedText type="smallBold">{t(`events.names.${event.id}`)}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {formatDate(event.date)} · {t("events.hijriYear", { year: event.hijriYear })}
                  </ThemedText>
                </View>
                <Pill
                  label={countdown(event.daysUntil)}
                  color={colors.accent}
                  background={tokens.accentSoft}
                />
              </View>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.description}>
                {t(`events.descriptions.${event.id}`)}
              </ThemedText>
            </Card>
          </FocusHighlight>
        ))}

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
          {t("events.disclaimer")}
        </ThemedText>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, gap: 2 },
  description: { marginTop: Spacing.two, lineHeight: 20 },
  disclaimer: { textAlign: "center", marginTop: Spacing.two },
});
