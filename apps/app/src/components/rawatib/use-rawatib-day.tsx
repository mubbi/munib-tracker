import { RAWATIB_PARENT } from "@munib-tracker/shared/constants";
import type {
  ObligatoryPrayer,
  PrayerStatus,
  RawatibId,
  RawatibPreset,
} from "@munib-tracker/shared/types";
import {
  rakahsForLog,
  rawatibRowState,
  rawatibWindow,
  splitRawatibForExcuse,
} from "@munib-tracker/shared/utils";
import { isRawatibPrayer } from "@munib-tracker/shared/validators";
import { useRouter } from "expo-router";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { RakahsSheet } from "@/components/rawatib/rakahs-sheet";
import { RawatibChipRow, type RawatibChipRowProps } from "@/components/rawatib/rawatib-chips";
import { RawatibFirstRunPrompt, RawatibSummaryRow } from "@/components/rawatib/rawatib-summary";
import { PrayerRepository } from "@/db";
import { useNow } from "@/hooks/use-now";
import { useRawatibConfig } from "@/hooks/use-rawatib";
import {
  RAWATIB_ROUTE,
  rawatibDayTimes,
  rawatibRakahsDone,
  startRawatib,
  updateRawatibPreferences,
} from "@/lib/rawatib";
import { requestRawatibNudgeReschedule } from "@/lib/rawatib-nudge";
import { useLocation } from "@/stores/location-store";
import { trackerStore, usePrayerRakahsMap } from "@/stores/tracker-store";

const FARD_ORDER: readonly ObligatoryPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export type RawatibDay = {
  /** Rawatib are on and not hidden by hayd/nifas — render the Sunnah rows + summary. */
  active: boolean;
  /**
   * The Sunnah sub-row for one fard — every row of the day in prayer order, the
   * not-yet-due ones muted (null when that fard has none). `label: false` drops
   * the leading "Sunnah" label (the hub groups rows under the Salah name).
   */
  chipsFor: (parent: ObligatoryPrayer, options?: { label?: boolean }) => ReactNode;
  /**
   * Slim progress footer for the Obligatory card, or the one-time first-run
   * question when no madhhab is chosen. `null` while off or hidden.
   */
  summary: ReactNode;
  /** The 2 | 4 sheet (mount once). */
  sheet: ReactNode;
};

/**
 * Everything the tracker checklist needs for the rawatib (NF-3.1) on one day:
 * the resolved preset, excused filtering, today's windows (future rows muted),
 * the optimistic toggle and the 2 | 4 sheet. Writes go through
 * `trackerStore.setRawatibOnDate`, which never touches qaza or the streak.
 */
export function useRawatibDay({
  date,
  isToday,
  status,
  excusedReason,
}: {
  date: string;
  isToday: boolean;
  status: Record<string, PrayerStatus | undefined>;
  excusedReason: string | null | undefined;
}): RawatibDay {
  const { t } = useTranslation();
  const router = useRouter();
  const config = useRawatibConfig();
  const location = useLocation();
  const now = useNow();
  const todayRakahs = usePrayerRakahsMap();
  const [dayRakahs, setDayRakahs] = useState<Record<string, number>>({});
  const [lateMap, setLateMap] = useState<Record<string, boolean>>({});
  const [overrides, setOverrides] = useState<Record<string, PrayerStatus>>({});
  const [sheetId, setSheetId] = useState<RawatibId | null>(null);

  // Optimistic chip state until the parent's status map catches up (calendar views reload async).
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new status map or date clears overrides
  useEffect(() => setOverrides({}), [status, date]);

  // Past days: read the logged rak'at once (today's come from the tracker store).
  useEffect(() => {
    if (isToday) return;
    let active = true;
    void PrayerRepository.getByDate(date).then((logs) => {
      if (!active) return;
      const next: Record<string, number> = {};
      for (const log of logs) {
        if (isRawatibPrayer(log.prayerId) && typeof log.rakahs === "number") {
          next[log.prayerId] = log.rakahs;
        }
      }
      setDayRakahs(next);
    });
    return () => {
      active = false;
    };
  }, [date, isToday]);

  // `late` flags (the Fajr sunnah made up after sunrise) for any day — shown on the chip.
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new status map means logs changed
  useEffect(() => {
    let active = true;
    void PrayerRepository.getByDate(date).then((logs) => {
      if (!active) return;
      const next: Record<string, boolean> = {};
      for (const log of logs) {
        if (isRawatibPrayer(log.prayerId) && log.late === true && log.status === "completed") {
          next[log.prayerId] = true;
        }
      }
      setLateMap(next);
    });
    return () => {
      active = false;
    };
  }, [date, status]);

  const rakahs = isToday ? todayRakahs : dayRakahs;
  const effective = useMemo(() => ({ ...status, ...overrides }), [status, overrides]);
  const times = useMemo(
    () => (isToday ? rawatibDayTimes(location, now) : null),
    [isToday, location, now],
  );
  const split = useMemo(
    () => splitRawatibForExcuse(config.ids, excusedReason),
    [config.ids, excusedReason],
  );
  const active = config.enabled && !split.hidden;

  // Fard marked today → let the opt-in nudge reschedule (no-op unless enabled).
  const fardKey = FARD_ORDER.map((id) => effective[id] ?? "").join("|");
  const firstFardKey = useRef(fardKey);
  useEffect(() => {
    if (!isToday || fardKey === firstFardKey.current) return;
    firstFardKey.current = fardKey;
    requestRawatibNudgeReschedule();
  }, [fardKey, isToday]);

  const states = useMemo(() => {
    const map = new Map<RawatibId, ReturnType<typeof rawatibRowState>>();
    for (const id of config.ids) {
      map.set(
        id,
        rawatibRowState(
          id,
          now,
          times,
          effective[RAWATIB_PARENT[id]],
          effective[id] === "completed",
        ),
      );
    }
    return map;
  }, [config.ids, now, times, effective]);

  const beforeFardIds = useMemo(
    () => new Set(config.ids.filter((id) => states.get(id)?.beforeFard)),
    [config.ids, states],
  );

  // Today's rows whose window hasn't opened yet — shown (the whole day at a glance) but muted.
  const futureIds = useMemo(() => {
    const ids = new Set<RawatibId>();
    if (!isToday || !times) return ids;
    for (const id of config.ids) {
      if (effective[id] === "completed") continue;
      const window = rawatibWindow(id, times);
      if (window && now.getTime() < window.start.getTime()) ids.add(id);
    }
    return ids;
  }, [config.ids, effective, isToday, now, times]);

  const optional = useMemo<RawatibChipRowProps["optional"]>(() => {
    if (excusedReason === "travel") return { ids: new Set(split.optional), reason: "travel" };
    if (excusedReason === "sick") return { ids: new Set(split.shown), reason: "sick" };
    return undefined;
  }, [excusedReason, split]);

  const write = useCallback(
    (id: RawatibId, completed: boolean, count?: number) => {
      const rakahCount = count ?? rakahsForLog({ rakahs: rakahs[id] }, id, config.preset);
      const late = isToday && completed ? (states.get(id)?.late ?? false) : undefined;
      setOverrides((prev) => ({ ...prev, [id]: completed ? "completed" : "pending" }));
      if (count != null) setDayRakahs((prev) => ({ ...prev, [id]: count }));
      if (late !== undefined || !completed) {
        setLateMap((prev) => ({ ...prev, [id]: completed && late === true }));
      }
      void trackerStore
        .getState()
        .setRawatibOnDate(date, id, completed, { rakahs: rakahCount, late })
        .then(() => {
          if (isToday) requestRawatibNudgeReschedule();
        });
    },
    [config.preset, date, isToday, rakahs, states],
  );

  const onToggle = useCallback(
    (id: RawatibId, completed: boolean) => write(id, completed),
    [write],
  );
  const onChooseRakahs = useCallback((id: RawatibId) => setSheetId(id), []);

  const chipsFor = (parent: ObligatoryPrayer, options?: { label?: boolean }): ReactNode => {
    if (!active) return null;
    // Every row of the day, in prayer order; travel's optional rows stay inline (labelled).
    const ids = config.ids.filter((id) => RAWATIB_PARENT[id] === parent);
    if (ids.length === 0) return null;
    const row = (
      <RawatibChipRow
        testID={`rawatib-chips-${parent}`}
        ids={ids}
        status={effective}
        rakahs={rakahs}
        preset={config.preset}
        beforeFardIds={beforeFardIds}
        futureIds={futureIds}
        late={lateMap}
        optional={optional}
        label={options?.label === false ? undefined : t("rawatib.chip.rowLabel")}
        onToggle={onToggle}
        onChooseRakahs={onChooseRakahs}
      />
    );
    // Fajr sunnah after sunrise (logged late, or due late now): the schools differ
    // on making it up (Tirmidhi 423) — show the labelled note under the row.
    const fajrLate =
      parent === "fajr" &&
      ids.includes("fajr_before") &&
      (effective.fajr_before === "completed"
        ? lateMap.fajr_before === true
        : isToday && states.get("fajr_before")?.late === true);
    if (!fajrLate) return row;
    return (
      <>
        {row}
        <MadhhabNote id="rawatib.fajrMakeup" />
      </>
    );
  };

  const rakahsDone = rawatibRakahsDone(effective, rakahs, config.preset);

  const onChoose = useCallback(
    (choice: RawatibPreset | "off") => {
      if (choice === "off") void updateRawatibPreferences(config, { enabled: false });
      else void startRawatib(choice);
    },
    [config],
  );

  const summary = split.hidden ? null : config.needsChoice ? (
    <RawatibFirstRunPrompt onChoose={onChoose} />
  ) : config.enabled ? (
    <RawatibSummaryRow
      rakahsDone={rakahsDone}
      target={config.preset}
      excusedReason={excusedReason}
      onOpenHub={() => router.push(RAWATIB_ROUTE)}
    />
  ) : null;

  const sheet = (
    <RakahsSheet
      id={sheetId}
      current={sheetId ? rakahsForLog({ rakahs: rakahs[sheetId] }, sheetId, config.preset) : 2}
      onSelect={(id, count) => write(id, true, count)}
      onClose={() => setSheetId(null)}
    />
  );

  return { active, chipsFor, summary, sheet };
}
