import type { DailySummary } from "@munib-tracker/shared/types";
import type { Href } from "expo-router";

export interface SalahGuideProgressRow {
  id: string;
  labelKey: string;
  hintKey: string;
  value: string;
  progress?: number;
  route: Href;
}

export interface SalahGuideProgressSnapshot {
  lessonsCompleted: number;
  lessonsTotal: number;
  lessonProgress: number;
  rows: SalahGuideProgressRow[];
}

export function buildSalahGuideProgress(input: {
  summary: DailySummary;
  streak: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  formatCount: (n: number) => string;
}): SalahGuideProgressSnapshot {
  const { summary, streak, lessonsCompleted, lessonsTotal, formatCount } = input;
  const salahProgress = summary.salahTotal > 0 ? summary.salahCompleted / summary.salahTotal : 0;
  const qazaProgress =
    summary.qazaTargetToday > 0 ? summary.qazaCompletedToday / summary.qazaTargetToday : 0;

  const rows: SalahGuideProgressRow[] = [
    {
      id: "salah",
      labelKey: "salahGuide.progress.salah",
      hintKey: "salahGuide.progress.salahHint",
      value: `${formatCount(summary.salahCompleted)}/${formatCount(summary.salahTotal)}`,
      progress: salahProgress,
      route: "/tracker",
    },
    {
      id: "qaza",
      labelKey: "salahGuide.progress.qaza",
      hintKey: "salahGuide.progress.qazaHint",
      value:
        summary.qazaTargetToday > 0
          ? `${formatCount(summary.qazaCompletedToday)}/${formatCount(summary.qazaTargetToday)}`
          : formatCount(summary.qazaRemaining),
      progress: summary.qazaTargetToday > 0 ? qazaProgress : undefined,
      route: "/qaza",
    },
    {
      id: "streak",
      labelKey: "salahGuide.progress.streak",
      hintKey: "salahGuide.progress.streakHint",
      value: formatCount(streak),
      route: "/tracker",
    },
    {
      id: "khushu",
      labelKey: "salahGuide.progress.khushu",
      hintKey: "salahGuide.progress.khushuHint",
      value: "—",
      route: "/journal",
    },
  ];

  return {
    lessonsCompleted,
    lessonsTotal,
    lessonProgress: lessonsTotal > 0 ? lessonsCompleted / lessonsTotal : 0,
    rows,
  };
}
