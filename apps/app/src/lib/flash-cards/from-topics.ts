import { buildMcq } from "./mcq-helpers";
import type { StudyMcq, StudySourceId, TopicLike } from "./types";

/**
 * Two templates per topic:
 * - describe: ask for the summary matching a title
 * - identify: ask which title matches a summary
 */
export function mcqsFromTopics(
  sourceId: StudySourceId,
  topics: readonly TopicLike[],
  categoryLabelKey?: string,
): StudyMcq[] {
  if (topics.length < 4) return [];

  const titles = topics.map((t) => t.title);
  const summaries = topics.map((t) => t.summary);
  const out: StudyMcq[] = [];

  for (const topic of topics) {
    if (!topic.title.trim() || !topic.summary.trim()) continue;

    const describe = buildMcq({
      id: `${sourceId}:topic-describe:${topic.id}`,
      sourceId,
      prompt: `What best describes “${topic.title}”?`,
      correct: topic.summary,
      distractorPool: summaries,
      explanation: topic.summary,
      categoryLabelKey,
    });
    if (describe) out.push(describe);

    const identify = buildMcq({
      id: `${sourceId}:topic-identify:${topic.id}`,
      sourceId,
      prompt: `Which lesson covers this: “${topic.summary}”?`,
      correct: topic.title,
      distractorPool: titles,
      explanation: topic.summary,
      categoryLabelKey,
    });
    if (identify) out.push(identify);
  }

  return out;
}
