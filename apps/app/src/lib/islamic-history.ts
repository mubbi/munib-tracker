import type { IslamicHistoryEvent } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

let cache: IslamicHistoryEvent[] | undefined;
export function isIslamicHistoryContentReady(): boolean {
  return cache !== undefined;
}
let inflight: Promise<void> | undefined;

export function ensureIslamicHistoryContent(): Promise<void> {
  if (cache) return Promise.resolve();
  if (!inflight) {
    inflight = import("@munib-tracker/shared/content/islamic-history").then(
      ({ ISLAMIC_HISTORY_EVENTS }) => {
        cache = ISLAMIC_HISTORY_EVENTS;
      },
    );
  }
  return inflight;
}

export function getIslamicHistoryEvents(): IslamicHistoryEvent[] {
  if (!cache) void ensureIslamicHistoryContent();
  // Overlay registry entry comes later — localizeList falls back to English until then.
  return localizeList(cache ?? [], overlayList("ISLAMIC_HISTORY_EVENTS"));
}
