import { EXCUSED_GUIDES } from "@munib-tracker/shared/content/excused-guide";
import {
  TRAVEL_OBLIGATION_COUNT,
  TRAVEL_SECTIONS,
} from "@munib-tracker/shared/content/travel-guide";

import { buildMcq } from "./mcq-helpers";
import type { StudyMcq, StudySourceId } from "./types";

type Translate = (key: string) => string;

function guideSectionCards(
  sourceId: StudySourceId,
  namespace: "hayd" | "sick" | "travel",
  sectionKeys: readonly string[],
  t: Translate,
): StudyMcq[] {
  const topics = sectionKeys
    .map((key) => {
      const title = t(`${namespace}.${key}.title`);
      const body = t(`${namespace}.${key}.body`);
      if (!title || title.startsWith(`${namespace}.`)) return null;
      if (!body || body.startsWith(`${namespace}.`)) return null;
      return { id: key, title, summary: body };
    })
    .filter((item): item is { id: string; title: string; summary: string } => item != null);

  if (topics.length < 4) return [];

  const titles = topics.map((tpc) => tpc.title);
  const bodies = topics.map((tpc) => tpc.summary);
  const out: StudyMcq[] = [];

  for (const topic of topics) {
    const describe = buildMcq({
      id: `${sourceId}:guide-describe:${topic.id}`,
      sourceId,
      prompt: `What best describes “${topic.title}”?`,
      correct: topic.summary,
      distractorPool: bodies,
      explanation: topic.summary,
      categoryLabelKey: `flashCards.category.${sourceId}`,
    });
    if (describe) out.push(describe);

    const identify = buildMcq({
      id: `${sourceId}:guide-identify:${topic.id}`,
      sourceId,
      prompt: `Which topic covers this: “${topic.summary}”?`,
      correct: topic.title,
      distractorPool: titles,
      explanation: topic.summary,
      categoryLabelKey: `flashCards.category.${sourceId}`,
    });
    if (identify) out.push(identify);
  }

  return out;
}

function obligationCards(
  sourceId: StudySourceId,
  namespace: "hayd" | "sick" | "travel",
  count: number,
  t: Translate,
): StudyMcq[] {
  const obligations = Array.from({ length: count }, (_, index) => {
    const text = t(`${namespace}.obligations.${index}`);
    if (!text || text.startsWith(`${namespace}.`)) return null;
    return { id: String(index), text };
  }).filter((item): item is { id: string; text: string } => item != null);

  if (obligations.length < 4) return [];

  const pool = obligations.map((o) => o.text);
  const out: StudyMcq[] = [];

  for (const item of obligations) {
    const card = buildMcq({
      id: `${sourceId}:obligation:${item.id}`,
      sourceId,
      prompt: `Which of these is a key point in the ${t(`${namespace}.title`)} guide?`,
      correct: item.text,
      distractorPool: pool,
      explanation: item.text,
      categoryLabelKey: `flashCards.category.${sourceId}`,
    });
    if (card) out.push(card);
  }

  return out;
}

export function mcqsFromHaydGuide(t: Translate): StudyMcq[] {
  const config = EXCUSED_GUIDES.hayd;
  const sections = config.extraSections ?? [];
  return [
    ...guideSectionCards("hayd", "hayd", sections, t),
    ...obligationCards("hayd", "hayd", config.obligationCount, t),
  ];
}

export function mcqsFromSickGuide(t: Translate): StudyMcq[] {
  const config = EXCUSED_GUIDES.sick;
  const sections = config.extraSections ?? [];
  return [
    ...guideSectionCards("sick", "sick", sections, t),
    ...obligationCards("sick", "sick", config.obligationCount, t),
  ];
}

export function mcqsFromTravelGuideCopy(t: Translate): StudyMcq[] {
  return [
    ...guideSectionCards("travel", "travel", TRAVEL_SECTIONS, t),
    ...obligationCards("travel", "travel", TRAVEL_OBLIGATION_COUNT, t),
  ];
}
