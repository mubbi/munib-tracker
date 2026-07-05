import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Radius, Spacing } from "@/constants/theme";
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getUpcomingEvents } from "@/lib/islamic-events";

export default function IslamicEventsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { formatIso } = useFormatCalendarDate();

  const events = useMemo(() => getUpcomingEvents(undefined, 9), []);

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
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/events" />
      <View style={styles.list}>
        {events.map((event) => (
          <Card key={`${event.id}-${event.hijriYear}`} padding="three">
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
          </Card>
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
  disclaimer: { textAlign: "center", marginTop: Spacing.two },
});
