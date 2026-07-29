import type { TravelRakatRow } from "@munib-tracker/shared/content/travel-guide";
import type { LearnGuideTopic } from "@munib-tracker/shared/types";
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

/** Hajj Learn topics → review quiz cards. */
export function mcqsFromHajj(topics: readonly LearnGuideTopic[]): StudyMcq[] {
  return mcqsFromTopics(
    "hajj",
    topics.map((t) => ({
      id: t.id,
      title: t.title,
      summary: t.summary || t.body[0] || "",
    })),
    "flashCards.category.hajj",
  );
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
