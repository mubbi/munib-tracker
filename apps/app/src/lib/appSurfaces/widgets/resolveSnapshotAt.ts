import type { ObligatoryPrayer } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import { adhkarHeadline } from "@/lib/appSurfaces/widgets/buildWidgetSnapshot";
import type { WidgetScheduleRow, WidgetSnapshot } from "@/lib/appSurfaces/widgets/types";
import type { ExternalCommand } from "@/lib/external-commands/types";
import { formatDuration } from "@/lib/prayer-times";

type Translate = (key: string, fallback: string, options?: Record<string, unknown>) => string;

export type ResolveSnapshotOptions = {
  /**
   * Mark commands still waiting in the native queue (widget tap, Siri, Wear…).
   * They are shown as done straight away; the app applies them on its next drain.
   */
  pending?: readonly ExternalCommand[];
  /** i18n for live labels (Android renders in JS). Without it, sync-time labels are kept. */
  t?: Translate;
};

/** Index of the row whose window is running at `nowMs` (the latest Adhan that has begun). */
function currentRowIndex(rows: readonly WidgetScheduleRow[], nowMs: number): number {
  let index = -1;
  rows.forEach((row, i) => {
    if (row.atMs > 0 && row.atMs <= nowMs) index = i;
  });
  return index;
}

/**
 * Applies queued marks optimistically: `mark-prayer` for the rows' date, and
 * `mark-current-obligatory` for the Salah whose window is running (the same
 * rule as `resolve-markable-prayer.ts`: never the next pending one).
 */
function applyPendingMarks(
  rows: WidgetScheduleRow[],
  rowsDate: string,
  pending: readonly ExternalCommand[],
  nowMs: number,
): WidgetScheduleRow[] {
  if (pending.length === 0) return rows;
  const marked = new Set<ObligatoryPrayer | string>();
  for (const command of pending) {
    if (command.type === "mark-prayer" && command.date === rowsDate) marked.add(command.prayerId);
    if (command.type === "mark-current-obligatory") {
      const index = currentRowIndex(rows, nowMs);
      if (index >= 0) marked.add(rows[index].id);
    }
  }
  if (marked.size === 0) return rows;
  return rows.map((row) => (marked.has(row.id) ? { ...row, status: "completed" } : row));
}

/**
 * Re-derives the time-dependent parts of a widget snapshot at `now`, so widgets
 * stay right between app syncs: the next Salah after its Adhan, live countdown,
 * row statuses, rollover to tomorrow's times after midnight, the due adhkar set,
 * and queued marks. Sections that only change with user data are left alone.
 *
 * Swift mirror: `targets/_shared/WidgetTimeResolver.swift` (keep both in step).
 */
export function resolveSnapshotAt(
  snapshot: WidgetSnapshot,
  now: Date,
  options: ResolveSnapshotOptions = {},
): WidgetSnapshot {
  const nowMs = now.getTime();
  const t = options.t;
  const pending = options.pending ?? [];
  const today = getLocalDateString(now);
  const schedule = snapshot.schedule;
  const rolled =
    !!snapshot.date &&
    today !== snapshot.date &&
    today === schedule.tomorrowDate &&
    schedule.tomorrowRows.length > 0;
  const staleDay = !!snapshot.date && today !== snapshot.date && !rolled;

  let next = snapshot;

  // Adhkar due set: purely time-based, works with or without a fresh day.
  if (snapshot.adhkar.sets.length > 0) {
    next = {
      ...next,
      adhkar: {
        ...next.adhkar,
        ...adhkarHeadline(next.adhkar, nowMs, next.adhkar.deepLink),
      },
    };
  }

  if (rolled && snapshot.hijriDate.tomorrow) {
    next = { ...next, hijriDate: { ...next.hijriDate, ...snapshot.hijriDate.tomorrow } };
  }

  if (staleDay) {
    // Days old: the running Salah from the sync day is not today's — never offer Mark for it.
    return {
      ...next,
      nextPrayer: { ...next.nextPrayer, currentPrayerId: "", currentPrayerAtMs: 0 },
    };
  }
  if (snapshot.locationDenied || schedule.rows.length === 0) return next;

  const rowsDate = rolled ? schedule.tomorrowDate : snapshot.date;
  const baseRows = rolled
    ? schedule.tomorrowRows.map((row) => ({ ...row, status: "pending" as const }))
    : schedule.rows;
  const markedRows = applyPendingMarks(baseRows, rowsDate, pending, nowMs);

  const upcoming = [...markedRows, ...(rolled ? [] : schedule.tomorrowRows)].filter(
    (row) => row.atMs > nowMs,
  );
  const nextRow = upcoming[0];
  const followingRow = upcoming[1];

  const strings = snapshot.strings;
  const rows = markedRows.map((row): WidgetScheduleRow => {
    const status: WidgetScheduleRow["status"] =
      row.status === "completed"
        ? "completed"
        : // Same Adhan instant = same row (tomorrow's Fajr shares the "fajr" id).
          nextRow && nextRow.atMs === row.atMs
          ? "active"
          : "pending";
    const statusLabel =
      status === "completed"
        ? strings.statusCompleted
        : status === "active"
          ? strings.statusActive
          : strings.statusPending;
    return { ...row, status, statusLabel: statusLabel || row.statusLabel };
  });

  const completed = rows.filter((row) => row.status === "completed").length;
  const total = rolled ? rows.length : snapshot.progress.total;
  const progressChanged = rolled || completed !== snapshot.progress.completed;
  const progressLabel = `${completed}/${total}`;
  const progressDetail = progressChanged
    ? t
      ? t("tracker.summaryLogged", "{{completed}} of {{total}} obligatory prayers logged today.", {
          completed,
          total,
        })
      : completed === 0
        ? snapshot.progress.resetDetail
        : progressLabel
    : snapshot.progress.lockScreenDetail;

  next = {
    ...next,
    schedule: {
      ...schedule,
      rows,
      lockScreenLine: nextRow?.name ?? schedule.lockScreenLine,
      lockScreenDetail: nextRow?.time ?? schedule.lockScreenDetail,
      accessibilityLabel: rows.map((r) => `${r.name} ${r.time}, ${r.statusLabel}`).join(". "),
    },
    progress: progressChanged
      ? {
          ...snapshot.progress,
          completed,
          total,
          progressLabel,
          progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
          summary: progressLabel,
          lockScreenLine: progressLabel,
          lockScreenDetail: progressDetail,
          accessibilityLabel: `${progressLabel}. ${progressDetail}`,
        }
      : snapshot.progress,
  };

  if (!nextRow) return next;

  const minutesUntil = Math.max(0, Math.ceil((nextRow.atMs - nowMs) / 60_000));
  const passedSnapshotTarget =
    rolled || !snapshot.nextPrayer.targetTimeMs || nowMs >= snapshot.nextPrayer.targetTimeMs;
  const countdownLabel = t
    ? t("hero.nextIn", "in {{time}}", { time: formatDuration(minutesUntil, t) })
    : snapshot.nextPrayer.countdownLabel;
  const prayerTimeLabel = t
    ? t("widgets.atTime", "at {{time}}", { time: nextRow.time })
    : snapshot.nextPrayer.prayerTimeLabel;
  const currentIndex = currentRowIndex(rows, nowMs);
  const current = currentIndex >= 0 ? rows[currentIndex] : undefined;

  const currentFields = {
    currentPrayerId: current?.id ?? "",
    currentPrayerName: current?.name ?? "",
    currentPrayerTime: current?.time ?? "",
    currentPrayerTimeLabel:
      current && t ? t("widgets.atTime", "at {{time}}", { time: current.time }) : "",
    currentPrayerAtMs: current?.atMs ?? 0,
  };

  if (!passedSnapshotTarget) {
    // Same next Salah as at sync time: the countdown and the running Salah move.
    next = {
      ...next,
      nextPrayer: {
        ...snapshot.nextPrayer,
        ...currentFields,
        minutesUntil,
        countdownLabel,
        lockScreenDetail: countdownLabel,
        accessibilityLabel: `${snapshot.nextPrayer.prayerName}, ${snapshot.nextPrayer.prayerTime}, ${countdownLabel}`,
      },
    };
    return next;
  }

  return {
    ...next,
    nextPrayer: {
      ...snapshot.nextPrayer,
      prayerId: nextRow.id,
      prayerName: nextRow.name,
      prayerTime: nextRow.time,
      prayerTimeLabel,
      targetTimeMs: nextRow.atMs,
      minutesUntil,
      countdownLabel,
      lockScreenLine: `${nextRow.name} · ${nextRow.time}`,
      lockScreenDetail: countdownLabel,
      accessibilityLabel: `${nextRow.name}, ${nextRow.time}, ${countdownLabel}`,
      ...currentFields,
      displayDate: rolled
        ? (snapshot.hijriDate.tomorrow?.summary ?? snapshot.nextPrayer.displayDate)
        : snapshot.nextPrayer.displayDate,
      followingName: followingRow?.name ?? "",
      followingTime: followingRow?.time ?? "",
    },
  };
}

/**
 * Epoch-ms moments when a widget's content changes on its own: each upcoming
 * Adhan, adhkar window edges and local midnight. Used to schedule Android widget
 * refresh alarms (iOS builds its timeline from the same snapshot fields).
 */
export function widgetRefreshBoundaries(snapshot: WidgetSnapshot, now: Date, limit = 8): number[] {
  const nowMs = now.getTime();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 30, 0);
  const candidates = [
    ...snapshot.schedule.rows.map((row) => row.atMs),
    ...snapshot.schedule.tomorrowRows.map((row) => row.atMs),
    ...snapshot.adhkar.sets.flatMap((set) => [set.startMs, set.endMs]),
    midnight.getTime(),
  ];
  return [...new Set(candidates.filter((ms) => ms > nowMs))].sort((a, b) => a - b).slice(0, limit);
}
