import { ISLAMIC_HISTORY_EVENTS } from "@munib-tracker/shared/content/islamic-history";
import type { IslamicHistoryEvent } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/history` route chunk.
 * Lazy `import()` left the hub empty/partial on first paint.
 */
export function isIslamicHistoryContentReady(): boolean {
  return true;
}

export function ensureIslamicHistoryContent(): Promise<void> {
  return Promise.resolve();
}

export function getIslamicHistoryEvents(): IslamicHistoryEvent[] {
  return localizeList(ISLAMIC_HISTORY_EVENTS, overlayList("ISLAMIC_HISTORY_EVENTS"));
}
