import type { AppLocale } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import {
  JannahCallout,
  JannahDisclaimer,
  JannahQuickLinkGrid,
} from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { ToolSeo } from "@/components/seo/tool-seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { NumberField } from "@/components/ui/number-field";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SelectField } from "@/components/ui/select-field";
import { Stagger } from "@/components/ui/stagger";
import { BorderWidth, Breakpoints, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatCalendarDate } from "@/lib/calendar-format";
import {
  gregorianToHijri,
  hijriMonthLabel,
  hijriMonthLength,
  hijriMonthName,
  hijriToGregorian,
} from "@/lib/hijri";
import { localeToBcp47, toAppLocale } from "@/lib/locale-bcp47";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useLocation } from "@/stores/location-store";

type ConverterDirection = "toHijri" | "toGregorian";

type ConversionResult = {
  primary: string;
  sourceLabel: string;
  /** The converted date as numbers, used to seed the other direction. */
  target: { year: number; month: number; day: number };
};

const MONTH_IDS = Array.from({ length: 12 }, (_, i) => String(i + 1));

/** Largest year the converter accepts. */
const MAX_YEAR = 9999;

export default function DateConverterScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const locale: AppLocale = toAppLocale(i18n.language ?? "en");
  const location = useLocation();
  const now = new Date();
  // Shared Hijri engine (sighting / Umm al-Qura) + the stored location timezone.
  const todayHijri = gregorianToHijri(now, location.timeZone);

  const [direction, setDirection] = useState<ConverterDirection>("toHijri");
  const { width } = useWindowDimensions();
  /** Tablet / desktop web: inputs on the start side, the converted date beside them. */
  const twoPane = !isTV() && width >= Breakpoints.listDetail;

  const [gYear, setGYear] = useState<number | undefined>(now.getFullYear());
  const [gMonth, setGMonth] = useState(String(now.getMonth() + 1));
  const [gDay, setGDay] = useState<number | undefined>(now.getDate());

  const [hYear, setHYear] = useState<number | undefined>(todayHijri.year);
  const [hMonth, setHMonth] = useState(String(todayHijri.month));
  const [hDay, setHDay] = useState<number | undefined>(todayHijri.day);

  function resetToToday() {
    const nowLocal = new Date();
    const hijriNow = gregorianToHijri(nowLocal, location.timeZone);
    setGYear(nowLocal.getFullYear());
    setGMonth(String(nowLocal.getMonth() + 1));
    setGDay(nowLocal.getDate());
    setHYear(hijriNow.year);
    setHMonth(String(hijriNow.month));
    setHDay(hijriNow.day);
  }

  const gregorianMonthOptions = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(localeToBcp47(i18n.language ?? "en"), {
      month: "long",
    });
    return MONTH_IDS.map((id) => ({
      value: id,
      label: formatter.format(new Date(2000, Number(id) - 1, 1)),
    }));
  }, [i18n.language]);
  const hijriMonthOptions = useMemo(
    () => MONTH_IDS.map((id) => ({ value: id, label: hijriMonthName(Number(id), locale) })),
    [locale],
  );

  const toHijri = direction === "toHijri";
  const year = toHijri ? gYear : hYear;
  const monthNumber = Number(toHijri ? gMonth : hMonth);
  const day = toHijri ? gDay : hDay;
  const maxDay = toHijri
    ? year != null
      ? new Date(year, monthNumber, 0).getDate()
      : 31
    : year != null
      ? hijriMonthLength(year, monthNumber)
      : 30;
  // Per-field errors: only a field the user has filled in can be wrong.
  const dayError =
    day != null && (day < 1 || day > maxDay)
      ? t("dateConverter.errorDay", { max: maxDay })
      : undefined;
  // NumberField keeps an out-of-range year as typed (B-03) — reject it here too.
  const yearError =
    year != null && (year < 1 || year > MAX_YEAR) ? t("dateConverter.errorYear") : undefined;

  const result = useMemo((): ConversionResult | undefined => {
    if (year == null || day == null || yearError || dayError) return undefined;
    if (direction === "toHijri") {
      const source = new Date(year, monthNumber - 1, day);
      const hijri = gregorianToHijri(source, location.timeZone);
      return {
        primary: `${hijri.day} ${hijriMonthLabel(hijri.year, hijri.month, locale)}`,
        sourceLabel: formatCalendarDate(source, "gregorian", locale),
        target: { year: hijri.year, month: hijri.month, day: hijri.day },
      };
    }
    const gregorian = hijriToGregorian(year, monthNumber, day);
    return {
      primary: formatCalendarDate(gregorian, "gregorian", locale),
      sourceLabel: `${day} ${hijriMonthLabel(year, monthNumber, locale)}`,
      target: {
        year: gregorian.getFullYear(),
        month: gregorian.getMonth() + 1,
        day: gregorian.getDate(),
      },
    };
  }, [direction, year, monthNumber, day, dayError, yearError, locale, location.timeZone]);

  /** Flipping direction keeps the date: the other side is seeded from the last valid result. */
  const changeDirection = (next: ConverterDirection) => {
    if (next === direction) return;
    if (result) {
      if (next === "toGregorian") {
        setHYear(result.target.year);
        setHMonth(String(result.target.month));
        setHDay(result.target.day);
      } else {
        setGYear(result.target.year);
        setGMonth(String(result.target.month));
        setGDay(result.target.day);
      }
    }
    setDirection(next);
  };

  const quickLinks = useMemo(
    () => [
      {
        id: "calendar",
        icon: { ios: "calendar", android: "calendar_month", web: "calendar_month" } as AppIcon,
        title: t("dateConverter.quickCalendar"),
        subtitle: t("dateConverter.quickCalendarHint"),
        tint: colors.accent,
        onPress: () => router.push("/calendar" as Href),
        href: "/calendar",
      },
      {
        id: "events",
        icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" } as AppIcon,
        title: t("dateConverter.quickEvents"),
        subtitle: t("dateConverter.quickEventsHint"),
        tint: tokens.status.info.color,
        onPress: () => router.push("/events" as Href),
        href: "/events",
      },
      {
        id: "ramadan",
        icon: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" } as AppIcon,
        title: t("dateConverter.quickRamadan"),
        subtitle: t("dateConverter.quickRamadanHint"),
        tint: tokens.status.success.color,
        onPress: () => router.push("/ramadan" as Href),
        href: "/ramadan",
      },
      {
        id: "history",
        icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" } as AppIcon,
        title: t("dateConverter.quickHistory"),
        subtitle: t("dateConverter.quickHistoryHint"),
        tint: tokens.status.warning.color,
        onPress: () => router.push("/history" as Href),
        href: "/history",
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

  const directionCard = (
    <Card>
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
        onChange={changeDirection}
      />
    </Card>
  );

  const inputCard = (
    <Card>
      <SectionHeader
        title={
          direction === "toHijri"
            ? t("dateConverter.gregorianDateLabel")
            : t("dateConverter.hijriDateLabel")
        }
        icon={inputIcon}
      />
      <View style={[styles.fieldRow, isTV() && styles.fieldRowTv]}>
        <NumberField
          label={t("dateConverter.day")}
          style={styles.field}
          value={day}
          onChangeValue={toHijri ? setGDay : setHDay}
          maxFractionDigits={0}
          max={31}
          min={1}
          error={dayError}
        />
        <View style={styles.fieldWide}>
          <SelectField
            label={t("dateConverter.month")}
            options={toHijri ? gregorianMonthOptions : hijriMonthOptions}
            value={toHijri ? gMonth : hMonth}
            onChange={toHijri ? setGMonth : setHMonth}
          />
        </View>
        <NumberField
          label={t("dateConverter.year")}
          style={styles.fieldWide}
          value={year}
          onChangeValue={toHijri ? setGYear : setHYear}
          maxFractionDigits={0}
          max={MAX_YEAR}
          min={1}
          step={1}
          error={yearError}
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
  );

  const resultCard = (
    <Card
      style={[
        {
          backgroundColor: tokens.accentSoft,
          borderColor: withAlpha(colors.accent, 0.35),
          borderWidth: BorderWidth.hairline,
        },
        twoPane && styles.resultFill,
      ]}
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
  );

  return (
    <ScreenLayout
      eyebrow={t("dateConverter.eyebrow")}
      title={t("dateConverter.title")}
      subtitle={t("dateConverter.subtitle")}
      onBack={() => goBackOrReplace(router, "/calendar")}
    >
      <ToolSeo path="/calendar/converter" name={t("dateConverter.title")} />
      <Stagger>
        <JannahCallout tone="info">{t("dateConverter.intro")}</JannahCallout>

        {twoPane ? (
          <View style={styles.split}>
            <View style={styles.pane}>
              {directionCard}
              {inputCard}
            </View>
            <View style={styles.pane}>{resultCard}</View>
          </View>
        ) : null}
        {twoPane ? null : directionCard}
        {twoPane ? null : inputCard}
        {twoPane ? null : resultCard}

        <Card>
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

const styles = StyleSheet.create({
  split: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Spacing.three,
  },
  pane: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.three,
  },
  resultFill: {
    flex: 1,
    justifyContent: "center",
  },
  fieldRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.three,
    alignItems: "flex-start",
  },
  field: { flex: 1, minWidth: 0 },
  fieldWide: { flex: 1.5, minWidth: 0 },
  fieldRowTv: {
    flexDirection: "column",
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

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/calendar/converter");
