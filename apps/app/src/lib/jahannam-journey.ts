import type { DailySummary } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";

export type JahannamJourneyRowId =
  | "salah"
  | "istighfar"
  | "quran"
  | "charity"
  | "character"
  | "repentance"
  | "rights"
  | "reflection";

export interface JahannamJourneyRow {
  id: JahannamJourneyRowId;
  labelKey: string;
  hintKey: string;
  value: string;
  progress?: number;
  route: Href;
}

export interface JahannamJourneySnapshot {
  date: string;
  rows: JahannamJourneyRow[];
  hasActivity: boolean;
}

export function buildJahannamJourney(input: {
  summary: DailySummary;
  reflectionStreak: number;
  intentionsSet: number;
  intentionsTotal: number;
  formatCount: (n: number) => string;
}): JahannamJourneySnapshot {
  const { summary, reflectionStreak, intentionsSet, intentionsTotal, formatCount } = input;
  const salahProgress = summary.salahTotal > 0 ? summary.salahCompleted / summary.salahTotal : 0;
  const zikrProgress = summary.zikrTotal > 0 ? summary.zikrCompleted / summary.zikrTotal : 0;
  const intentionsProgress = intentionsTotal > 0 ? intentionsSet / intentionsTotal : 0;

  const rows: JahannamJourneyRow[] = [
    {
      id: "salah",
      labelKey: "jahannam.journey.salah",
      hintKey: "jahannam.journey.salahHint",
      value: `${formatCount(summary.salahCompleted)}/${formatCount(summary.salahTotal)}`,
      progress: salahProgress,
      route: "/tracker",
    },
    {
      id: "istighfar",
      labelKey: "jahannam.journey.istighfar",
      hintKey: "jahannam.journey.istighfarHint",
      value: `${formatCount(summary.zikrCompleted)}/${formatCount(summary.zikrTotal)}`,
      progress: zikrProgress,
      route: "/zikr",
    },
    {
      id: "quran",
      labelKey: "jahannam.journey.quran",
      hintKey: "jahannam.journey.quranHint",
      value: "—",
      route: "/quran",
    },
    {
      id: "charity",
      labelKey: "jahannam.journey.charity",
      hintKey: "jahannam.journey.charityHint",
      value: `${formatCount(intentionsSet)}/${formatCount(intentionsTotal)}`,
      progress: intentionsProgress,
      route: "/jahannam/journey" as Href,
    },
    {
      id: "character",
      labelKey: "jahannam.journey.character",
      hintKey: "jahannam.journey.characterHint",
      value: `${formatCount(intentionsSet)}/${formatCount(intentionsTotal)}`,
      route: "/jahannam/journey" as Href,
    },
    {
      id: "repentance",
      labelKey: "jahannam.journey.repentance",
      hintKey: "jahannam.journey.repentanceHint",
      value: `${formatCount(intentionsSet)}/${formatCount(intentionsTotal)}`,
      route: "/jahannam/repentance" as Href,
    },
    {
      id: "rights",
      labelKey: "jahannam.journey.rights",
      hintKey: "jahannam.journey.rightsHint",
      value: "—",
      route: "/jahannam/sins-against-others" as Href,
    },
    {
      id: "reflection",
      labelKey: "jahannam.journey.reflection",
      hintKey: "jahannam.journey.reflectionHint",
      value: formatCount(reflectionStreak),
      route: "/jahannam/reflection" as Href,
    },
  ];

  const hasActivity =
    summary.salahCompleted > 0 ||
    summary.zikrCompleted > 0 ||
    intentionsSet > 0 ||
    reflectionStreak > 0;

  return { date: getLocalDateString(), rows, hasActivity };
}
