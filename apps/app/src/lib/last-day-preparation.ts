import type { DailySummary } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";

export type LastDayPreparationRowId =
  | "salah"
  | "quran"
  | "dhikr"
  | "charity"
  | "repentance"
  | "rights"
  | "character"
  | "reflection"
  | "learning";

export interface LastDayPreparationRow {
  id: LastDayPreparationRowId;
  labelKey: string;
  hintKey: string;
  value: string;
  progress?: number;
  route: Href;
}

export interface LastDayPreparationSnapshot {
  date: string;
  rows: LastDayPreparationRow[];
  hasActivity: boolean;
}

export function buildLastDayPreparation(input: {
  summary: DailySummary;
  lessonsCompleted: number;
  lessonsTotal: number;
  repentanceChecked: boolean;
  characterChecked: boolean;
  formatCount: (n: number) => string;
}): LastDayPreparationSnapshot {
  const {
    summary,
    lessonsCompleted,
    lessonsTotal,
    repentanceChecked,
    characterChecked,
    formatCount,
  } = input;

  const salahProgress = summary.salahTotal > 0 ? summary.salahCompleted / summary.salahTotal : 0;
  const zikrProgress = summary.zikrTotal > 0 ? summary.zikrCompleted / summary.zikrTotal : 0;
  const lessonProgress = lessonsTotal > 0 ? lessonsCompleted / lessonsTotal : 0;

  const rows: LastDayPreparationRow[] = [
    {
      id: "salah",
      labelKey: "lastDay.preparation.salah",
      hintKey: "lastDay.preparation.salahHint",
      value: `${formatCount(summary.salahCompleted)}/${formatCount(summary.salahTotal)}`,
      progress: salahProgress,
      route: "/tracker",
    },
    {
      id: "quran",
      labelKey: "lastDay.preparation.quran",
      hintKey: "lastDay.preparation.quranHint",
      value: "—",
      route: "/quran",
    },
    {
      id: "dhikr",
      labelKey: "lastDay.preparation.dhikr",
      hintKey: "lastDay.preparation.dhikrHint",
      value: `${formatCount(summary.zikrCompleted)}/${formatCount(summary.zikrTotal)}`,
      progress: zikrProgress,
      route: "/zikr",
    },
    {
      id: "charity",
      labelKey: "lastDay.preparation.charity",
      hintKey: "lastDay.preparation.charityHint",
      value: "—",
      route: "/zakat",
    },
    {
      id: "repentance",
      labelKey: "lastDay.preparation.repentance",
      hintKey: "lastDay.preparation.repentanceHint",
      value: repentanceChecked ? "✓" : "—",
      route: "/learn-dua" as Href,
    },
    {
      id: "rights",
      labelKey: "lastDay.preparation.rights",
      hintKey: "lastDay.preparation.rightsHint",
      value: formatCount(summary.qazaRemaining),
      route: "/qaza",
    },
    {
      id: "character",
      labelKey: "lastDay.preparation.character",
      hintKey: "lastDay.preparation.characterHint",
      value: characterChecked ? "✓" : "—",
      route: "/journal",
    },
    {
      id: "reflection",
      labelKey: "lastDay.preparation.reflection",
      hintKey: "lastDay.preparation.reflectionHint",
      value: "—",
      route: "/journal",
    },
    {
      id: "learning",
      labelKey: "lastDay.preparation.learning",
      hintKey: "lastDay.preparation.learningHint",
      value: `${formatCount(lessonsCompleted)}/${formatCount(lessonsTotal)}`,
      progress: lessonProgress,
      route: "/last-day/progress",
    },
  ];

  const hasActivity =
    summary.salahCompleted > 0 ||
    summary.zikrCompleted > 0 ||
    lessonsCompleted > 0 ||
    repentanceChecked ||
    characterChecked;

  return { date: getLocalDateString(), rows, hasActivity };
}
