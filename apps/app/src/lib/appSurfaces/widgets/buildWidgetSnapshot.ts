import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type { AppLocale } from "@munib-tracker/shared/types";

import { buildAppUrl } from "@/lib/app-links";
import { WIDGET_MAX_SCHEDULE_ROWS } from "@/lib/appSurfaces/widgets/constants";
import {
  emptyWidgetSnapshot,
  type WidgetHexColor,
  type WidgetScheduleRow,
  type WidgetSnapshot,
  type WidgetThemeSnapshot,
} from "@/lib/appSurfaces/widgets/types";
import { resolveWidgetTheme } from "@/lib/appSurfaces/widgets/widgetTokens";
import type { StoredLocation } from "@/lib/location";
import { locationCalcExtras } from "@/lib/location";
import {
  buildDailySchedule,
  formatDuration,
  formatPrayerTime,
  nextPrayer,
} from "@/lib/prayer-times";
import { buildWidgetPayload } from "@/lib/widget-data";

export type BuildWidgetSnapshotInput = {
  location: StoredLocation | null;
  locationDenied: boolean;
  locale: AppLocale;
  calendar: "hijri" | "gregorian";
  timeFormat: "12" | "24";
  theme: { isDark: boolean; primaryColor: string };
  salahCompleted: number;
  salahTotal: number;
  prayerStatus: Record<string, string>;
  now?: Date;
  t: (key: string, fallback: string, options?: Record<string, unknown>) => string;
};

function asHex(color: string): WidgetHexColor {
  return color.startsWith("#") ? (color as WidgetHexColor) : (`#${color}` as WidgetHexColor);
}

function buildThemeSnapshot(input: BuildWidgetSnapshotInput): WidgetThemeSnapshot {
  const resolved = resolveWidgetTheme(input.theme);
  return {
    isDark: resolved.isDark,
    primary: asHex(resolved.primary),
    background: asHex(resolved.background),
    cardBackground: asHex(resolved.cardBackground),
    textPrimary: asHex(resolved.textPrimary),
    textSecondary: asHex(resolved.textSecondary),
    border: asHex(resolved.border),
    success: asHex(resolved.success),
    warning: asHex(resolved.warning),
  };
}

function formatUpdatedAgo(iso: string, t: BuildWidgetSnapshotInput["t"]): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "";
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return t("widgets.updatedJustNow", "Updated just now");
  if (minutes < 60)
    return t("widgets.updatedMinutesAgo", "Updated {{count}}m ago", { count: minutes });
  const hours = Math.floor(minutes / 60);
  return t("widgets.updatedHoursAgo", "Updated {{count}}h ago", { count: hours });
}

function buildScheduleRows(input: BuildWidgetSnapshotInput, now: Date): WidgetScheduleRow[] {
  if (!input.location) return [];
  const coords = { latitude: input.location.latitude, longitude: input.location.longitude };
  const extras = locationCalcExtras(input.location);
  const schedule = buildDailySchedule(
    coords,
    now,
    input.location.method,
    input.location.madhab,
    input.location.timeZone,
    extras,
  );
  const next = nextPrayer(
    coords,
    now,
    input.location.method,
    input.location.madhab,
    input.location.timeZone,
    extras,
  );

  return schedule
    .filter((entry) => OBLIGATORY_PRAYERS.includes(entry.id as (typeof OBLIGATORY_PRAYERS)[number]))
    .slice(0, WIDGET_MAX_SCHEDULE_ROWS)
    .map((entry) => {
      const status = input.prayerStatus[entry.id];
      const rowStatus: WidgetScheduleRow["status"] =
        status === "completed" ? "completed" : entry.id === next.id ? "active" : "pending";
      return {
        id: entry.id,
        name: input.t(`prayers.${entry.id}`, entry.id),
        time: entry.at
          ? formatPrayerTime(entry.at, input.timeFormat, input.location?.timeZone)
          : "—",
        status: rowStatus,
      };
    });
}

/** Builds the JSON snapshot native widgets read from the shared app group. */
export function buildWidgetSnapshot(input: BuildWidgetSnapshotInput): WidgetSnapshot {
  const now = input.now ?? new Date();
  const updatedAt = now.toISOString();

  if (input.locationDenied || !input.location) {
    const theme = buildThemeSnapshot(input);
    const setLocation = input.t("widgets.setLocation", "Set location");
    const hint = input.t("widgets.setLocationHint", "Open the app to set your location");
    const empty = emptyWidgetSnapshot();
    return {
      ...empty,
      updatedAt,
      updatedAgoLabel: formatUpdatedAgo(updatedAt, input.t),
      locationDenied: true,
      theme,
      nextPrayer: {
        ...empty.nextPrayer,
        title: input.t("widgets.nextPrayer", "Next prayer"),
        summary: hint,
        lockScreenLine: setLocation,
        lockScreenDetail: hint,
        deepLink: buildAppUrl("/location"),
        ctaLabel: setLocation,
        prayerName: setLocation,
        countdownLabel: hint,
        remainingLabel: input.t("widgets.remaining", "Remaining"),
        prayerTimeLabel: setLocation,
        location: "",
      },
      schedule: {
        ...empty.schedule,
        title: input.t("widgets.schedule", "Today's schedule"),
        summary: hint,
        lockScreenLine: setLocation,
        lockScreenDetail: hint,
        deepLink: buildAppUrl("/location"),
      },
      progress: {
        ...empty.progress,
        title: input.t("widgets.progress", "Today's progress"),
        summary: hint,
        lockScreenLine: setLocation,
        lockScreenDetail: hint,
        deepLink: buildAppUrl("/location"),
      },
    };
  }

  const payload = buildWidgetPayload(
    input.location,
    input.locale,
    now,
    input.salahCompleted,
    input.calendar,
    input.timeFormat,
  );
  const theme = buildThemeSnapshot(input);
  const prayerName = input.t(`prayers.${payload.nextPrayerId}`, payload.nextPrayerId);
  const countdownLabel = input.t("hero.nextIn", "in {{time}}", {
    time: formatDuration(payload.minutesUntil),
  });
  const prayerTimeLabel = input.t("widgets.atTime", "at {{time}}", {
    time: payload.nextPrayerTime,
  });
  const remainingLabel = input.t("widgets.remaining", "Remaining");
  const progressPercent =
    input.salahTotal > 0 ? Math.round((input.salahCompleted / input.salahTotal) * 100) : 0;
  const progressLabel = `${input.salahCompleted}/${input.salahTotal}`;
  const scheduleRows = buildScheduleRows(input, now);

  return {
    version: 1,
    updatedAt,
    updatedAgoLabel: formatUpdatedAgo(updatedAt, input.t),
    locationDenied: false,
    theme,
    nextPrayer: {
      title: input.t("widgets.nextPrayer", "Next prayer"),
      summary: payload.displayDate,
      deepLink: buildAppUrl("/"),
      lockScreenLine: `${prayerName} · ${payload.nextPrayerTime}`,
      lockScreenDetail: countdownLabel,
      ctaLabel: input.t("actions.checklist", "Checklist"),
      prayerId: payload.nextPrayerId,
      prayerName,
      prayerTime: payload.nextPrayerTime,
      prayerTimeLabel,
      countdownLabel,
      remainingLabel,
      minutesUntil: payload.minutesUntil,
      targetTimeMs: payload.nextPrayerAtMs,
      displayDate: payload.displayDate,
      location: payload.location,
    },
    schedule: {
      title: input.t("widgets.schedule", "Today's schedule"),
      summary: payload.location,
      deepLink: buildAppUrl("/tracker"),
      lockScreenLine: scheduleRows.find((r) => r.status === "active")?.name ?? prayerName,
      lockScreenDetail:
        scheduleRows.find((r) => r.status === "active")?.time ?? payload.nextPrayerTime,
      ctaLabel: input.t("actions.checklist", "Checklist"),
      rows: scheduleRows,
    },
    progress: {
      title: input.t("widgets.progress", "Today's progress"),
      summary: progressLabel,
      deepLink: buildAppUrl("/tracker"),
      lockScreenLine: progressLabel,
      lockScreenDetail: input.t(
        "tracker.summaryLogged",
        "{{completed}} of {{total}} obligatory prayers logged today.",
        {
          completed: input.salahCompleted,
          total: input.salahTotal,
        },
      ),
      ctaLabel: input.t("actions.checklist", "Checklist"),
      progressLabel,
      progressPercent,
      completed: input.salahCompleted,
      total: input.salahTotal,
    },
  };
}
