import { buildMcq, condenseText } from "./mcq-helpers";
import type { StudyMcq, StudySourceId } from "./types";

type NamedSummary = {
  id: string;
  title: string;
  body: string;
};

/** Seerah / history timeline-style events → title ↔ summary cards. */
export function mcqsFromNamedSummaries(
  sourceId: StudySourceId,
  events: readonly NamedSummary[],
  categoryLabelKey?: string,
): StudyMcq[] {
  const usable = events.filter((e) => e.title.trim() && e.body.trim());
  if (usable.length < 4) return [];

  const titles = usable.map((e) => e.title);
  const bodies = usable.map((e) => condenseText(e.body));
  const out: StudyMcq[] = [];

  for (const event of usable) {
    const describe = buildMcq({
      id: `${sourceId}:event-describe:${event.id}`,
      sourceId,
      prompt: `What best describes “${event.title}”?`,
      correct: condenseText(event.body),
      distractorPool: bodies,
      explanation: event.body,
      categoryLabelKey,
    });
    if (describe) out.push(describe);

    const identify = buildMcq({
      id: `${sourceId}:event-identify:${event.id}`,
      sourceId,
      prompt: `Which event is this: “${condenseText(event.body, 80)}”?`,
      correct: event.title,
      distractorPool: titles,
      explanation: event.body,
      categoryLabelKey,
    });
    if (identify) out.push(identify);
  }

  return out;
}

type ProfileLike = {
  id: string;
  name: string;
  summary: string;
};

/** Sahaba profiles → name ↔ summary. */
export function mcqsFromProfiles(
  sourceId: StudySourceId,
  profiles: readonly ProfileLike[],
  categoryLabelKey?: string,
): StudyMcq[] {
  const usable = profiles.filter((p) => p.name.trim() && p.summary.trim());
  if (usable.length < 4) return [];

  const names = usable.map((p) => p.name);
  const summaries = usable.map((p) => condenseText(p.summary));
  const out: StudyMcq[] = [];

  for (const profile of usable) {
    const describe = buildMcq({
      id: `${sourceId}:profile-describe:${profile.id}`,
      sourceId,
      prompt: `What best describes ${profile.name}?`,
      correct: condenseText(profile.summary),
      distractorPool: summaries,
      explanation: profile.summary,
      categoryLabelKey,
    });
    if (describe) out.push(describe);

    const identify = buildMcq({
      id: `${sourceId}:profile-identify:${profile.id}`,
      sourceId,
      prompt: `Who is this: “${condenseText(profile.summary, 80)}”?`,
      correct: profile.name,
      distractorPool: names,
      explanation: profile.summary,
      categoryLabelKey,
    });
    if (identify) out.push(identify);
  }

  return out;
}
