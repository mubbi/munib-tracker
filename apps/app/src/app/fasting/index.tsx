import {
  fastingRefLabel,
  VOLUNTARY_FAST_EVIDENCE,
  VOLUNTARY_FAST_RESTRICTION_EVIDENCE,
} from "@munib-tracker/shared/content/voluntary-fasting-evidence";
import type { FiqhContentRef } from "@munib-tracker/shared/fiqh";
import type {
  AppLocale,
  ExcusedReason,
  VoluntaryFastingPrefs,
  VoluntaryFastKind,
  VoluntaryFastStatus,
} from "@munib-tracker/shared/types";
import {
  addDays,
  getLocalDateString,
  isLiveFastEntry,
  needsAshuraCompanion,
} from "@munib-tracker/shared/utils";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FastDaySheet } from "@/components/fasting/fast-day-sheet";
import { FastDayStrip } from "@/components/fasting/fast-day-strip";
import { FastKindChips } from "@/components/fasting/fast-kind-chips";
import { FASTING_ICON, STATUS_ICON, STATUS_TONE } from "@/components/fasting/fasting-ui";
import { GuideMadhhabNotes } from "@/components/fiqh/guide-madhhab-notes";
import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { HijriAdjustLink } from "@/components/hijri/hijri-adjust-link";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useIntentTimeOptions } from "@/components/settings/editors/fasting-editors";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { StatCard } from "@/components/ui/stat-card";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import { useHijriAdjustment } from "@/hooks/use-hijri-adjustment";
import { useMadhhabPrompt } from "@/hooks/use-madhhab-prompt";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatCalendarDateFromIso } from "@/lib/calendar-format";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { requestReminderReschedule } from "@/lib/quran-companion/reschedule";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useSetting } from "@/lib/settings/use-setting";
import {
  clearFast,
  computeVoluntaryFastingStats,
  DHUL_HIJJAH_TARGET,
  excusedReasonForFastDate,
  type FastingIntentTime,
  FOLLOWABLE_FAST_KINDS,
  fastingCalendarContext,
  fastingHistory,
  headlineKind,
  markFast,
  SHAWWAL_SIX_TARGET,
  setFastAsQaza,
  toggleEnabledKind,
  upcomingFastingDays,
} from "@/lib/voluntary-fasting";
import { usePreferences } from "@/stores/preferences-store";
import { useRoza } from "@/stores/tracker-store";
import {
  useEnsureVoluntaryFastingLoaded,
  useVoluntaryFastingEntries,
} from "@/stores/voluntary-fasting-store";

const STRIP_DAYS = 30;
const HISTORY_LIMIT = 20;

function formatCount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(value);
}

const FORGETFUL_EATING = ["fasting.forgetfulEating"] as const;

export default function VoluntaryFastingScreen() {
  // §4.1.1 item 4: once per session while the madhhab was never chosen.
  const madhhabPrompt = useMadhhabPrompt();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const params = useLocalSearchParams<{ date?: string }>();
  const prefs = usePreferences();
  // In-screen controls are shortcuts of the registered settings (single write, §4.5.4);
  // each setting reschedules reminders itself.
  const kinds = useSetting<VoluntaryFastKind[]>("fiqh.fasting.kinds");
  const intentTime = useSetting<FastingIntentTime>("notifications.fasting.intentTime");
  const intentOptions = useIntentTimeOptions().map((o) => ({ id: o.value, label: o.label }));
  const hijriAdjustment = useHijriAdjustment();
  const roza = useRoza();
  useEnsureVoluntaryFastingLoaded();
  const entries = useVoluntaryFastingEntries();
  const tv = isTV();
  const locale = prefs.locale as AppLocale;
  const calendar = prefs.defaultCalendar;
  const today = getLocalDateString();
  const tomorrow = addDays(today, 1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: hijriAdjustment changes hijri.ts output.
  const ctx = useMemo(
    () => fastingCalendarContext(prefs, entries),
    [prefs, entries, hijriAdjustment],
  );
  const fastingPrefs = ctx.prefs as VoluntaryFastingPrefs;
  const days = useMemo(() => upcomingFastingDays(STRIP_DAYS, today, ctx), [ctx, today]);
  const stats = useMemo(
    () => computeVoluntaryFastingStats(entries, ctx, today),
    [entries, ctx, today],
  );
  const history = useMemo(() => fastingHistory(entries, HISTORY_LIMIT), [entries]);
  const todayHijri = days[0]?.classification.hijri ?? ctx.toHijri(today);
  const tomorrowDay = days[1];
  const tomorrowEntry = isLiveFastEntry(entries[tomorrow]) ? entries[tomorrow] : undefined;

  const [sheetDate, setSheetDate] = useState<string | null>(null);
  const [sheetExcused, setSheetExcused] = useState<ExcusedReason | null>(null);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  // `/fasting?date=YYYY-MM-DD` (notifications, Today's Goal) opens that day.
  useEffect(() => {
    if (typeof params.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.date)) {
      setSheetDate(params.date);
    }
  }, [params.date]);

  useEffect(() => {
    if (!sheetDate) return;
    let alive = true;
    void excusedReasonForFastDate(sheetDate, today).then((reason) => {
      if (alive) setSheetExcused(reason);
    });
    return () => {
      alive = false;
    };
  }, [sheetDate, today]);

  const sheetClassification = useMemo(
    () => (sheetDate ? (days.find((d) => d.date === sheetDate)?.classification ?? null) : null),
    [sheetDate, days],
  );
  const sheetDay = useMemo(() => {
    if (!sheetDate) return null;
    return sheetClassification ?? upcomingFastingDays(1, sheetDate, ctx)[0]?.classification ?? null;
  }, [sheetDate, sheetClassification, ctx]);
  const sheetEntry =
    sheetDate && isLiveFastEntry(entries[sheetDate]) ? entries[sheetDate] : undefined;

  const sheetHints = useMemo(() => {
    if (!sheetDate || !sheetDay) return [];
    const hints: string[] = [];
    if (sheetDay.kinds.includes("ashura") && needsAshuraCompanion(sheetDate, entries)) {
      hints.push("voluntaryFasting.hint.ashuraCompanion");
    }
    if (sheetDay.kinds.includes("shawwal_six") && roza.remaining > 0) {
      hints.push("voluntaryFasting.hint.shawwalQazaOrder");
    }
    return hints;
  }, [sheetDate, sheetDay, entries, roza.remaining]);

  const afterWrite = () => requestReminderReschedule();

  const onSelect = async (status: VoluntaryFastStatus | null) => {
    if (!sheetDate) return;
    setBlockedMessage(null);
    if (status === null) {
      await clearFast(sheetDate);
      afterWrite();
      return;
    }
    const result = await markFast(sheetDate, status, { today });
    if (!result.ok) setBlockedMessage(t(`voluntaryFasting.blocked.${result.reason}`));
    else afterWrite();
  };

  const intendTomorrow = async () => {
    const result = await markFast(tomorrow, "intended", { today });
    if (!result.ok) setBlockedMessage(t(`voluntaryFasting.blocked.${result.reason}`));
    else afterWrite();
  };

  const tomorrowKind = tomorrowDay ? headlineKind(tomorrowDay.classification.kinds) : null;
  const showShawwal = todayHijri.month === 10;
  const showDhulHijjah = todayHijri.month === 12 && todayHijri.day <= 13;
  const refLine = (refs: readonly FiqhContentRef[] | undefined) =>
    refs && refs.length > 0 ? refs.map(fastingRefLabel).join(" · ") : null;

  return (
    <ScreenLayout
      eyebrow={t("voluntaryFasting.eyebrow")}
      title={t("voluntaryFasting.title")}
      subtitle={t("voluntaryFasting.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/fasting" />
      {madhhabPrompt.sheet}
      <Stagger>
        {prefs.activeExcusedReason ? (
          <Card padding="three" style={{ backgroundColor: tokens.status.info.soft }}>
            <ThemedText type="smallBold">{t("voluntaryFasting.excused.title")}</ThemedText>
            <ThemedText type="small">
              {prefs.activeExcusedReason === "hayd"
                ? t("voluntaryFasting.excused.hayd")
                : t("voluntaryFasting.excused.allowed")}
            </ThemedText>
          </Card>
        ) : null}

        {blockedMessage ? (
          <Card padding="three" style={{ backgroundColor: tokens.status.warning.soft }}>
            <ThemedText type="small" accessibilityLiveRegion="polite">
              {blockedMessage}
            </ThemedText>
          </Card>
        ) : null}

        {/* Tonight: intend to fast tomorrow? */}
        {tomorrowDay && !tomorrowDay.classification.isRamadan ? (
          <Card padding="three">
            <SectionHeader title={t("voluntaryFasting.tonight.title")} icon={FASTING_ICON} />
            {tomorrowEntry ? (
              <View style={styles.inlineRow}>
                <SymbolView
                  name={STATUS_ICON[tomorrowEntry.status]}
                  size={18}
                  tintColor={tokens.status[STATUS_TONE[tomorrowEntry.status]].color}
                />
                <ThemedText type="small">
                  {t(`voluntaryFasting.tonight.logged.${tomorrowEntry.status}`)}
                </ThemedText>
              </View>
            ) : tomorrowDay.classification.ruling === "recommended" && tomorrowKind ? (
              <>
                <ThemedText type="small">
                  {t("voluntaryFasting.tonight.recommended", {
                    day: t(`voluntaryFasting.kind.${tomorrowKind}`),
                  })}
                </ThemedText>
                {!tv ? (
                  <Button
                    label={t("voluntaryFasting.tonight.intend")}
                    icon={STATUS_ICON.intended}
                    onPress={() => void intendTomorrow()}
                    style={styles.buttonTop}
                  />
                ) : null}
              </>
            ) : (
              <ThemedText type="small" themeColor="mutedForeground">
                {tomorrowDay.classification.ruling === "permitted"
                  ? t("voluntaryFasting.tonight.permitted")
                  : t(`voluntaryFasting.ruling.${tomorrowDay.classification.ruling}`)}
              </ThemedText>
            )}
          </Card>
        ) : null}

        {/* Upcoming 30 days, coloured by ruling */}
        <Card padding="three">
          <SectionHeader
            title={t("voluntaryFasting.strip.title")}
            subtitle={t("voluntaryFasting.strip.subtitle")}
            icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
          />
          <FastDayStrip
            days={days}
            entries={entries}
            prefs={fastingPrefs}
            locale={locale}
            calendar={calendar}
            today={today}
            onPressDay={(date) => {
              setBlockedMessage(null);
              setSheetDate(date);
            }}
          />
          <View style={styles.legend}>
            {(["recommended", "permitted", "disliked", "prohibited"] as const).map((ruling) => {
              const tone =
                ruling === "permitted"
                  ? null
                  : tokens.status[
                      ruling === "recommended"
                        ? "success"
                        : ruling === "disliked"
                          ? "warning"
                          : "danger"
                    ];
              return (
                <View key={ruling} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: tone ? tone.color : colors.cardBorder },
                    ]}
                  />
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t(`voluntaryFasting.ruling.${ruling}`)}
                  </ThemedText>
                </View>
              );
            })}
          </View>
          <HijriAdjustLink year={todayHijri.year} month={todayHijri.month} />
        </Card>

        {/* Seasonal counters */}
        {showShawwal ? (
          <Card padding="three">
            <SectionHeader title={t("voluntaryFasting.shawwal.title")} />
            <ThemedText type="subtitle">
              {t("voluntaryFasting.shawwal.progress", {
                done: Math.min(stats.shawwalSix, SHAWWAL_SIX_TARGET),
                total: SHAWWAL_SIX_TARGET,
              })}
            </ThemedText>
            <ProgressBar
              value={Math.min(1, stats.shawwalSix / SHAWWAL_SIX_TARGET)}
              color={tokens.status.success.color}
            />
            {roza.remaining > 0 ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("voluntaryFasting.hint.shawwalQazaOrder")}
              </ThemedText>
            ) : null}
          </Card>
        ) : null}
        {showDhulHijjah ? (
          <Card padding="three">
            <SectionHeader title={t("voluntaryFasting.dhulHijjah.title")} />
            <ThemedText type="subtitle">
              {t("voluntaryFasting.dhulHijjah.progress", {
                done: Math.min(stats.dhulHijjahNine, DHUL_HIJJAH_TARGET),
                total: DHUL_HIJJAH_TARGET,
              })}
            </ThemedText>
            <ProgressBar
              value={Math.min(1, stats.dhulHijjahNine / DHUL_HIJJAH_TARGET)}
              color={tokens.status.success.color}
            />
          </Card>
        ) : null}

        {/* Private stats */}
        <View style={styles.statsRow}>
          <StatCard
            label={t("voluntaryFasting.stats.total")}
            value={formatCount(stats.totalFasted, locale)}
            icon={STATUS_ICON.fasted}
          />
          <StatCard
            label={t("voluntaryFasting.stats.hijriYear")}
            value={formatCount(stats.thisHijriYear, locale)}
            icon={{ ios: "moon.fill", android: "dark_mode", web: "dark_mode" }}
          />
          <StatCard
            label={t("voluntaryFasting.stats.last30")}
            value={formatCount(stats.last30Days, locale)}
            icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
          />
          <StatCard
            label={t("voluntaryFasting.stats.qaza")}
            value={formatCount(stats.qazaFasted, locale)}
            icon={{ ios: "arrow.uturn.backward", android: "undo", web: "undo" }}
          />
        </View>

        {/* History */}
        <Card padding="three">
          <SectionHeader title={t("voluntaryFasting.history.title")} />
          {history.length === 0 ? (
            <ThemedText type="small" themeColor="mutedForeground">
              {t("voluntaryFasting.history.empty")}
            </ThemedText>
          ) : (
            history.map(({ date, entry }) => (
              <PressableScale
                key={date}
                haptic="selection"
                accessibilityRole="button"
                accessibilityLabel={`${formatCalendarDateFromIso(date, calendar, locale)}, ${t(
                  `voluntaryFasting.status.${entry.status}`,
                )}`}
                onPress={() => setSheetDate(date)}
                style={styles.historyRow}
              >
                <SymbolView
                  name={STATUS_ICON[entry.status]}
                  size={18}
                  tintColor={tokens.status[STATUS_TONE[entry.status]].color}
                />
                <ThemedText type="small" style={styles.flex}>
                  {formatCalendarDateFromIso(date, calendar, locale)}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {entry.asQaza
                    ? t("voluntaryFasting.history.qaza")
                    : t(`voluntaryFasting.status.${entry.status}`)}
                </ThemedText>
              </PressableScale>
            ))
          )}
        </Card>

        {/* My fasts — feature-local settings (hidden on TV: read-only there) */}
        {!tv ? (
          <Card padding="three">
            <SectionHeader
              title={t("voluntaryFasting.settings.title")}
              subtitle={t("voluntaryFasting.settings.kindsHint")}
            />
            <FastKindChips
              value={kinds.value}
              onToggle={(kind) =>
                void kinds.setValue(toggleEnabledKind(fastingPrefs, kind).enabledKinds)
              }
            />

            <SettingSwitchRow
              settingId="fiqh.fasting.dawud"
              label={t("voluntaryFasting.settings.dawud")}
              hint={t("voluntaryFasting.settings.dawudHint")}
            />
            <SettingSwitchRow
              settingId="fiqh.fasting.pilgrim"
              label={t("voluntaryFasting.settings.pilgrim")}
              hint={t("voluntaryFasting.settings.pilgrimSeasonHint")}
            />

            <ThemedText type="smallBold" style={styles.groupTitle}>
              {t("voluntaryFasting.settings.reminders")}
            </ThemedText>
            <SettingSwitchRow
              settingId="notifications.fasting.seasonal"
              label={t("voluntaryFasting.settings.seasonal")}
              hint={t("voluntaryFasting.settings.seasonalHint")}
            />
            <SettingSwitchRow
              settingId="notifications.fasting.weekly"
              label={t("voluntaryFasting.settings.weekly")}
              hint={t("voluntaryFasting.settings.weeklyHint")}
            />
            <SettingSwitchRow
              settingId="notifications.fasting.suhoor"
              label={t("voluntaryFasting.settings.suhoor")}
              hint={t("voluntaryFasting.settings.suhoorHint")}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.groupTitle}>
              {t("voluntaryFasting.settings.intentTime")}
            </ThemedText>
            <SegmentedControl
              options={intentOptions}
              value={intentTime.value}
              onChange={(value) => void intentTime.setValue(value)}
            />
          </Card>
        ) : null}

        {/* Why these days — evidence by reference (never typed scripture) */}
        <Card padding="three">
          <SectionHeader title={t("voluntaryFasting.evidence.title")} />
          {[...FOLLOWABLE_FAST_KINDS, "dawud" as const].map((kind) => (
            <View key={kind} style={styles.evidenceRow}>
              <ThemedText type="smallBold">{t(`voluntaryFasting.kind.${kind}`)}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t(`voluntaryFasting.evidence.kind.${kind}`)}
              </ThemedText>
              <ThemedText type="caption" style={{ color: colors.accentText }}>
                {refLine(VOLUNTARY_FAST_EVIDENCE[kind])}
              </ThemedText>
            </View>
          ))}
        </Card>

        <Card padding="three">
          <SectionHeader title={t("voluntaryFasting.restrictions.title")} />
          {(
            Object.keys(
              VOLUNTARY_FAST_RESTRICTION_EVIDENCE,
            ) as (keyof typeof VOLUNTARY_FAST_RESTRICTION_EVIDENCE)[]
          )
            .filter((id) => id !== "qazaInShaban" && id !== "afterMidShaban")
            .map((id) => (
              <View key={id} style={styles.evidenceRow}>
                <ThemedText type="small">{t(`voluntaryFasting.reason.${id}`)}</ThemedText>
                <ThemedText type="caption" style={{ color: colors.accentText }}>
                  {refLine(VOLUNTARY_FAST_RESTRICTION_EVIDENCE[id])}
                </ThemedText>
              </View>
            ))}
          <MadhhabNote id="fasting.afterMidShaban" />
        </Card>

        {/* NF-3.0a: eating or drinking forgetfully while fasting. */}
        <GuideMadhhabNotes ids={FORGETFUL_EATING} />

        <Card padding="three">
          <NavRow
            icon={{ ios: "moon.circle.fill", android: "brightness_3", web: "brightness_3" }}
            label={t("voluntaryFasting.links.whiteDays")}
            onPress={() => router.push("/white-days" as Href)}
          />
          <NavRow
            icon={{ ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" }}
            label={t("voluntaryFasting.links.ramadan")}
            onPress={() => router.push("/ramadan" as Href)}
          />
          <NavRow
            icon={{ ios: "arrow.uturn.backward.circle", android: "history", web: "history" }}
            label={t("voluntaryFasting.links.qazaRoza")}
            onPress={() => router.push("/qaza/roza" as Href)}
          />
        </Card>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
          {t("voluntaryFasting.disclaimer")}
        </ThemedText>
      </Stagger>

      <FastDaySheet
        visible={sheetDate != null}
        date={sheetDate}
        classification={sheetDay}
        entry={sheetEntry}
        locale={locale}
        calendar={calendar}
        rozaRemaining={roza.remaining}
        excused={sheetExcused}
        hints={sheetHints}
        readOnly={tv}
        onSelect={(status) => void onSelect(status)}
        onToggleQaza={(asQaza) => {
          if (!sheetDate) return;
          if (!sheetEntry) {
            void markFast(sheetDate, "intended", { asQaza, today }).then(afterWrite);
            return;
          }
          void setFastAsQaza(sheetDate, asQaza).then(afterWrite);
        }}
        onClose={() => setSheetDate(null)}
      />
    </ScreenLayout>
  );
}

/** A switch bound to a registered setting (the hub is a shortcut, never a second copy). */
function SettingSwitchRow({
  settingId,
  label,
  hint,
}: {
  settingId: string;
  label: string;
  hint: string;
}) {
  const { value, setValue, enabled } = useSetting<boolean>(settingId);
  return (
    <View style={styles.switchRow}>
      <View style={styles.flex}>
        <ThemedText type="small">{label}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {hint}
        </ThemedText>
      </View>
      <ThemedSwitch
        accessibilityLabel={label}
        value={value}
        disabled={!enabled}
        onValueChange={(next) => void setValue(next)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  inlineRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  buttonTop: { marginTop: Spacing.three },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.three, marginTop: Spacing.two },
  legendItem: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  groupTitle: { marginTop: Spacing.three, marginBottom: Spacing.one },
  evidenceRow: { gap: Spacing.half, paddingVertical: Spacing.two },
  disclaimer: { marginTop: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/fasting");
