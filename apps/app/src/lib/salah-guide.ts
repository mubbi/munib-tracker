import { SALAH_GUIDE_TOPICS } from "@munib-tracker/shared/content";
import type { SalahGuideTopic } from "@munib-tracker/shared/types";

/** All salah-guide topics (NF-1.33). */
export function getSalahGuideTopics(): SalahGuideTopic[] {
  return SALAH_GUIDE_TOPICS;
}

/** One topic by id, or undefined. */
export function getSalahGuideTopic(id: string | undefined): SalahGuideTopic | undefined {
  return SALAH_GUIDE_TOPICS.find((topic) => topic.id === id);
}
