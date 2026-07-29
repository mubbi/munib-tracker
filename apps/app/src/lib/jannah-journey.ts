import type { DailySummary } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";

export type JannahJourneyRowId =
  | "salah"
  | "quran"
  | "dhikr"
  | "qaza"
  | "tahajjud"
  | "reflection"
  | "streak";

export interface JannahJourneyRow {
  id: JannahJourneyRowId;
  labelKey: string;
  hintKey: string;
  value: string;
  progress?: number;
  route: Href;
}

export interface JannahJourneySnapshot {
  date: string;
  rows: JannahJourneyRow[];
  hasActivity: boolean;
}

export function buildJannahJourney(input: {
  summary: DailySummary;
  streak: number;
  khushuThisWeek: number;
  tahajjudThisWeek: number;
  formatCount: (n: number) => string;
}): JannahJourneySnapshot {
  const { summary, streak, khushuThisWeek, tahajjudThisWeek, formatCount } = input;
  const salahProgress = summary.salahTotal > 0 ? summary.salahCompleted / summary.salahTotal : 0;
  const zikrProgress = summary.zikrTotal > 0 ? summary.zikrCompleted / summary.zikrTotal : 0;
  const qazaProgress =
    summary.qazaTargetToday > 0 ? summary.qazaCompletedToday / summary.qazaTargetToday : 0;

  const rows: JannahJourneyRow[] = [
    {
      id: "salah",
      labelKey: "jannah.journey.salah",
      hintKey: "jannah.journey.salahHint",
      value: `${formatCount(summary.salahCompleted)}/${formatCount(summary.salahTotal)}`,
      progress: salahProgress,
      route: "/tracker",
    },
    {
      id: "dhikr",
      labelKey: "jannah.journey.dhikr",
      hintKey: "jannah.journey.dhikrHint",
      value: `${formatCount(summary.zikrCompleted)}/${formatCount(summary.zikrTotal)}`,
      progress: zikrProgress,
      route: "/zikr",
    },
    {
      id: "qaza",
      labelKey: "jannah.journey.qaza",
      hintKey: "jannah.journey.qazaHint",
      value:
        summary.qazaTargetToday > 0
          ? `${formatCount(summary.qazaCompletedToday)}/${formatCount(summary.qazaTargetToday)}`
          : formatCount(summary.qazaRemaining),
      progress: summary.qazaTargetToday > 0 ? qazaProgress : undefined,
      route: "/qaza",
    },
    {
      id: "streak",
      labelKey: "jannah.journey.streak",
      hintKey: "jannah.journey.streakHint",
      value: formatCount(streak),
      route: "/tracker",
    },
    {
      id: "tahajjud",
      labelKey: "jannah.journey.tahajjud",
      hintKey: "jannah.journey.tahajjudHint",
      value: formatCount(tahajjudThisWeek),
      route: "/tahajjud",
    },
    {
      id: "reflection",
      labelKey: "jannah.journey.reflection",
      hintKey: "jannah.journey.reflectionHint",
      value: formatCount(khushuThisWeek),
      route: "/journal",
    },
    {
      id: "quran",
      labelKey: "jannah.journey.quran",
      hintKey: "jannah.journey.quranHint",
      value: "—",
      route: "/quran",
    },
  ];

  const hasActivity =
    summary.salahCompleted > 0 ||
    summary.zikrCompleted > 0 ||
    summary.qazaCompletedToday > 0 ||
    streak > 0 ||
    khushuThisWeek > 0 ||
    tahajjudThisWeek > 0;

  return { date: getLocalDateString(), rows, hasActivity };
}
