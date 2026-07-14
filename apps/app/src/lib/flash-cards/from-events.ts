import type { IslamicEventDef } from "@/lib/islamic-events";

import { buildMcq } from "./mcq-helpers";
import type { StudyMcq } from "./types";

const MONTH_NAME: Record<number, string> = {
  1: "Muharram",
  2: "Safar",
  3: "Rabi' al-Awwal",
  4: "Rabi' al-Thani",
  5: "Jumada al-Ula",
  6: "Jumada al-Thani",
  7: "Rajab",
  8: "Sha'ban",
  9: "Ramadan",
  10: "Shawwal",
  11: "Dhul Qa'dah",
  12: "Dhul Hijjah",
};

type Translate = (key: string) => string;

/**
 * Fixed-date Islamic events — which Hijri day/month, using UI event titles.
 */
export function mcqsFromIslamicEvents(
  events: readonly IslamicEventDef[],
  t: Translate,
): StudyMcq[] {
  if (events.length < 4) return [];

  const days = [...new Set(events.map((e) => String(e.day)))];
  const months = [...new Set(events.map((e) => MONTH_NAME[e.month] ?? String(e.month)))];
  const out: StudyMcq[] = [];

  for (const event of events) {
    const title = t(`events.names.${event.id}`);
    if (!title || title === `events.names.${event.id}`) continue;

    const dayCard = buildMcq({
      id: `events:day:${event.id}`,
      sourceId: "events",
      prompt: `On which Hijri day does ${title} fall?`,
      correct: String(event.day),
      distractorPool: days,
      explanation: `${title} is on ${event.day} ${MONTH_NAME[event.month] ?? ""}.`,
      categoryLabelKey: "flashCards.category.events",
    });
    if (dayCard) out.push(dayCard);

    const monthCard = buildMcq({
      id: `events:month:${event.id}`,
      sourceId: "events",
      prompt: `In which Hijri month is ${title}?`,
      correct: MONTH_NAME[event.month] ?? String(event.month),
      distractorPool: months,
      explanation: `${title} is in ${MONTH_NAME[event.month]}.`,
      categoryLabelKey: "flashCards.category.events",
    });
    if (monthCard) out.push(monthCard);
  }

  return out;
}
