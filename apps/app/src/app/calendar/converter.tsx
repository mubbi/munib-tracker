import type { AppLocale } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import {
  JannahCallout,
  JannahDisclaimer,
  JannahQuickLinkGrid,
} from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatCalendarDate } from "@/lib/calendar-format";
import { gregorianToHijri, hijriMonthLabel, hijriMonthLength, hijriToGregorian } from "@/lib/hijri";
import { toAppLocale } from "@/lib/locale-bcp47";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";

type ConverterDirection = "toHijri" | "toGregorian";

type ConversionResult = {
  primary: string;
  sourceLabel: string;
};

export default function DateConverterScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const locale: AppLocale = toAppLocale(i18n.language ?? "en");
  const now = new Date();
  const todayHijri = gregorianToHijri(now);

  const [direction, setDirection] = useState<ConverterDirection>("toHijri");

  const [gYear, setGYear] = useState(String(now.getFullYear()));
  const [gMonth, setGMonth] = useState(String(now.getMonth() + 1));
  const [gDay, setGDay] = useState(String(now.getDate()));

  const [hYear, setHYear] = useState(String(todayHijri.year));
  const [hMonth, setHMonth] = useState(String(todayHijri.month));
  const [hDay, setHDay] = useState(String(todayHijri.day));

  function resetToToday() {
    const nowLocal = new Date();
    const hijriNow = gregorianToHijri(nowLocal);
    setGYear(String(nowLocal.getFullYear()));
    setGMonth(String(nowLocal.getMonth() + 1));
    setGDay(String(nowLocal.getDate()));
    setHYear(String(hijriNow.year));
    setHMonth(String(hijriNow.month));
    setHDay(String(hijriNow.day));
  }

  const result = useMemo((): ConversionResult | undefined => {
    if (direction === "toHijri") {
      const y = Number.parseInt(gYear, 10);
      const m = Number.parseInt(gMonth, 10);
      const d = Number.parseInt(gDay, 10);
      if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return undefined;
      if (m < 1 || m > 12 || d < 1 || d > 31) return undefined;
      const source = new Date(y, m - 1, d);
      if (source.getMonth() !== m - 1) return undefined;
      const hijri = gregorianToHijri(source);
      return {
        primary: `${hijri.day} ${hijriMonthLabel(hijri.year, hijri.month, locale)}`,
        sourceLabel: formatCalendarDate(source, "gregorian", locale),
      };
    }

    const y = Number.parseInt(hYear, 10);
    const m = Number.parseInt(hMonth, 10);
    const d = Number.parseInt(hDay, 10);
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return undefined;
    if (m < 1 || m > 12 || d < 1 || d > hijriMonthLength(y, m)) return undefined;
    const gregorian = hijriToGregorian(y, m, d);
    return {
      primary: formatCalendarDate(gregorian, "gregorian", locale),
      sourceLabel: `${d} ${hijriMonthLabel(y, m, locale)}`,
    };
  }, [direction, gYear, gMonth, gDay, hYear, hMonth, hDay, locale]);

  const quickLinks = useMemo(
    () => [
      {
        id: "calendar",
        icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" } as AppIcon,
        title: t("dateConverter.quickCalendar"),
        subtitle: t("dateConverter.quickCalendarHint"),
        tint: colors.accent,
        onPress: () => router.push("/calendar" as Href),
      },
      {
        id: "events",
        icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" } as AppIcon,
        title: t("dateConverter.quickEvents"),
        subtitle: t("dateConverter.quickEventsHint"),
        tint: tokens.status.info.color,
        onPress: () => router.push("/events" as Href),
      },
      {
        id: "ramadan",
        icon: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" } as AppIcon,
        title: t("dateConverter.quickRamadan"),
        subtitle: t("dateConverter.quickRamadanHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/ramadan" as Href),
      },
      {
        id: "history",
        icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" } as AppIcon,
        title: t("dateConverter.quickHistory"),
        subtitle: t("dateConverter.quickHistoryHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/history" as Href),
      },
    ],
    [router, t, colors.accent, tokens],
  );

  const inputIcon =
    direction === "toHijri"
      ? ({ ios: "calendar", android: "calendar_today", web: "calendar_today" } as AppIcon)
      : ({ ios: "moon", android: "dark_mode", web: "dark_mode" } as AppIcon);
  const resultIcon =
    direction === "toHijri"
      ? ({ ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" } as AppIcon)
      : ({ ios: "calendar", android: "calendar_month", web: "calendar_month" } as AppIcon);

  return (
    <ScreenLayout
      eyebrow={t("dateConverter.eyebrow")}
      title={t("dateConverter.title")}
      subtitle={t("dateConverter.subtitle")}
      onBack={() => goBackOrReplace(router, "/calendar")}
    >
      <Seo path="/calendar/converter" />
      <Stagger>
        <JannahCallout tone="info">{t("dateConverter.intro")}</JannahCallout>

        <Card padding="three">
          <SectionHeader
            title={t("dateConverter.directionTitle")}
            icon={{ ios: "arrow.left.arrow.right", android: "swap_horiz", web: "swap_horiz" }}
          />
          <SegmentedControl<ConverterDirection>
            options={[
              { id: "toHijri", label: t("dateConverter.toHijri") },
              { id: "toGregorian", label: t("dateConverter.toGregorian") },
            ]}
            value={direction}
            onChange={setDirection}
          />
        </Card>

        <Card padding="three">
          <SectionHeader
            title={
              direction === "toHijri"
                ? t("dateConverter.gregorianDateLabel")
                : t("dateConverter.hijriDateLabel")
            }
            icon={inputIcon}
          />
          <View style={styles.fieldRow}>
            <DateField
              label={t("dateConverter.day")}
              value={direction === "toHijri" ? gDay : hDay}
              onChange={direction === "toHijri" ? setGDay : setHDay}
            />
            <DateField
              label={t("dateConverter.month")}
              value={direction === "toHijri" ? gMonth : hMonth}
              onChange={direction === "toHijri" ? setGMonth : setHMonth}
            />
            <DateField
              label={t("dateConverter.year")}
              value={direction === "toHijri" ? gYear : hYear}
              onChange={direction === "toHijri" ? setGYear : setHYear}
              flexGrow={1.4}
            />
          </View>
          <View style={styles.actions}>
            <Button
              label={t("dateConverter.useToday")}
              variant="secondary"
              size="sm"
              onPress={resetToToday}
            />
          </View>
        </Card>

        <Card
          padding="three"
          style={{
            backgroundColor: tokens.accentSoft,
            borderColor: withAlpha(colors.accent, 0.35),
            borderWidth: StyleSheet.hairlineWidth,
          }}
        >
          <View style={styles.resultTop}>
            <IconWell
              icon={resultIcon}
              tint={colors.accent}
              background={withAlpha(colors.accent, 0.16)}
              well={44}
              size={20}
            />
            <View style={styles.resultCopy}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {direction === "toHijri"
                  ? t("dateConverter.hijriDateLabel")
                  : t("dateConverter.gregorianDateLabel")}
              </ThemedText>
              <ThemedText
                type="header"
                heading={2}
                style={{ color: result ? colors.accent : colors.mutedForeground }}
              >
                {result?.primary ?? t("dateConverter.invalidDate")}
              </ThemedText>
              {result ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("dateConverter.resultFrom", { date: result.sourceLabel })}
                </ThemedText>
              ) : null}
            </View>
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("dateConverter.quickLinksTitle")}
            icon={{ ios: "square.grid.2x2.fill", android: "apps", web: "apps" }}
          />
          <JannahQuickLinkGrid items={quickLinks} />
        </Card>

        <JannahDisclaimer textKey="dateConverter.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

function DateField({
  label,
  value,
  onChange,
  flexGrow = 1,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  flexGrow?: number;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View style={[styles.field, { flexGrow }]}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={label}
        style={[
          styles.input,
          {
            backgroundColor: colors.muted,
            color: colors.foreground,
            borderColor: tokens.hairline,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  field: { flex: 1, gap: Spacing.one },
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    minHeight: 48,
  },
  actions: {
    marginTop: Spacing.three,
    alignItems: "flex-start",
  },
  resultTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
  },
  resultCopy: { flex: 1, gap: Spacing.one },
});
