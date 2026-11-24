import { RAWATIB_PARENT, RAWATIB_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  ObligatoryPrayer,
  PrayerStatus,
  RawatibId,
  RawatibPreset,
} from "@munib-tracker/shared/types";
import { rakahsForLog, rawatibRowState, splitRawatibForExcuse } from "@munib-tracker/shared/utils";
import { isRawatibPrayer } from "@munib-tracker/shared/validators";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { RakahsSheet } from "@/components/rawatib/rakahs-sheet";
import { RawatibChipRow } from "@/components/rawatib/rawatib-chips";
import { RawatibHeaderCard } from "@/components/rawatib/rawatib-header-card";
import { PrayerRepository } from "@/db";
import { useNow } from "@/hooks/use-now";
import { useRawatibConfig } from "@/hooks/use-rawatib";
import { rawatibDayTimes, startRawatib, updateRawatibPreferences } from "@/lib/rawatib";
import { requestRawatibNudgeReschedule } from "@/lib/rawatib-nudge";
import { useLocation } from "@/stores/location-store";
import { trackerStore, usePrayerRakahsMap } from "@/stores/tracker-store";

const FARD_ORDER: readonly ObligatoryPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export type RawatibDay = {
  /** Rawatib are on and not hidden by hayd/nifas — render chips + card. */
  active: boolean;
  /** Chip row for one fard (null when nothing to show). */
  chipsFor: (parent: ObligatoryPrayer) => ReactNode;
  /** Header card (also the first-run question). `null` while hidden. */
  headerCard: ReactNode;
  /** The 2 | 4 sheet (mount once). */
  sheet: ReactNode;
};

/**
 * Everything the tracker checklist needs for the rawatib (NF-3.1) on one day:
 * the resolved preset, excused filtering, today's visibility windows, the
 * optimistic toggle and the 2 | 4 sheet. Writes go through
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
  const config = useRawatibConfig();
  const location = useLocation();
  const now = useNow();
  const todayRakahs = usePrayerRakahsMap();
  const [dayRakahs, setDayRakahs] = useState<Record<string, number>>({});
  const [lateMap, setLateMap] = useState<Record<string, boolean>>({});
  const [overrides, setOverrides] = useState<Record<string, PrayerStatus>>({});
  const [showAll, setShowAll] = useState(false);
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

  const visible = useCallback(
    (id: RawatibId) => !isToday || showAll || (states.get(id)?.visible ?? true),
    [isToday, showAll, states],
  );

  const chipsFor = (parent: ObligatoryPrayer): ReactNode => {
    if (!active) return null;
    const ids = split.shown.filter((id) => RAWATIB_PARENT[id] === parent && visible(id));
    if (ids.length === 0) return null;
    const row = (
      <RawatibChipRow
        testID={`rawatib-chips-${parent}`}
        ids={ids}
        status={effective}
        rakahs={rakahs}
        preset={config.preset}
        beforeFardIds={beforeFardIds}
        late={lateMap}
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

  const rakahsDone = RAWATIB_PRAYERS.reduce(
    (sum, id) =>
      effective[id] === "completed"
        ? sum + rakahsForLog({ rakahs: rakahs[id] }, id, config.preset)
        : sum,
    0,
  );

  const onChoose = useCallback(
    (choice: RawatibPreset | "off") => {
      if (choice === "off") void updateRawatibPreferences(config, { enabled: false });
      else void startRawatib(choice);
    },
    [config],
  );

  const optionalIds = split.optional.filter(visible);
  const showCard = split.hidden ? false : config.enabled || config.needsChoice;
  const headerCard = showCard ? (
    <RawatibHeaderCard
      config={config}
      excusedReason={excusedReason}
      rakahsDone={rakahsDone}
      isToday={isToday}
      showAll={showAll}
      onToggleShowAll={isToday ? () => setShowAll((value) => !value) : undefined}
      onChoose={onChoose}
      optionalContent={
        active && optionalIds.length > 0 ? (
          <RawatibChipRow
            testID="rawatib-chips-optional"
            ids={optionalIds}
            status={effective}
            rakahs={rakahs}
            preset={config.preset}
            onToggle={onToggle}
            onChooseRakahs={onChooseRakahs}
          />
        ) : null
      }
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

  return { active, chipsFor, headerCard, sheet };
}
