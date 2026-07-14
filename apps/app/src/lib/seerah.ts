import type { SeerahEvent } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

let cache: SeerahEvent[] | undefined;
let inflight: Promise<SeerahEvent[]> | undefined;

export function isSeerahContentReady(): boolean {
  return cache !== undefined;
}

export async function ensureSeerahContent(): Promise<SeerahEvent[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = import("@munib-tracker/shared/content/seerah").then(({ SEERAH_EVENTS }) => {
      cache = SEERAH_EVENTS as SeerahEvent[];
      return cache;
    });
  }
  return inflight;
}

export function getSeerahEvents(): SeerahEvent[] {
  if (!cache) void ensureSeerahContent();
  return localizeList(cache ?? [], overlayList("SEERAH_EVENTS"));
}
