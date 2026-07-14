import type { TravelRakatRow } from "@munib-tracker/shared/content/travel-guide";
import type { HajjGuideSection } from "@munib-tracker/shared/types";
import { mcqsFromTopics } from "./from-topics";
import { buildMcq } from "./mcq-helpers";
import type { StudyMcq } from "./types";

const PRAYER_LABEL: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
  witr: "Witr",
};

/** Hajj sections (title + summary) plus step recognition when enough siblings exist. */
export function mcqsFromHajj(sections: readonly HajjGuideSection[]): StudyMcq[] {
  const topicCards = mcqsFromTopics(
    "hajj",
    sections.map((s) => ({ id: s.id, title: s.title, summary: s.summary })),
    "flashCards.category.hajj",
  );

  const steps = sections.flatMap((section) =>
    section.steps.map((step) => ({
      id: step.id,
      title: step.title,
      summary: step.body,
      sectionTitle: section.title,
    })),
  );

  const stepCards =
    steps.length >= 4
      ? mcqsFromTopics(
          "hajj",
          steps.map((s) => ({ id: s.id, title: s.title, summary: s.summary })),
          "flashCards.category.hajj",
        ).map((card) => ({
          ...card,
          id: card.id.replace(":topic-", ":hajj-step-"),
        }))
      : [];

  return [...topicCards, ...stepCards];
}

/** Travel Qasr rakat counts from bundled travel-guide table. */
export function mcqsFromTravelRakats(rows: readonly TravelRakatRow[]): StudyMcq[] {
  if (rows.length < 4) return [];

  const travelCounts = rows.map((row) => String(row.travel));
  const residentCounts = rows.map((row) => String(row.resident));
  const out: StudyMcq[] = [];

  for (const row of rows) {
    const label = PRAYER_LABEL[row.prayerId] ?? row.prayerId;
    const travelCard = buildMcq({
      id: `travel:qasr:${row.prayerId}`,
      sourceId: "travel",
      prompt: `How many fard rakats for ${label} while travelling (Qasr)?`,
      correct: String(row.travel),
      distractorPool: [...new Set([...travelCounts, ...residentCounts, "1", "3", "4"])],
      explanation: `${label} is ${row.travel} rakats when Qasr applies (resident: ${row.resident}).`,
      categoryLabelKey: "flashCards.category.travel",
    });
    if (travelCard) out.push(travelCard);
  }

  return out;
}
