import { SEERAH_EVENTS } from "@munib-tracker/shared/content/seerah";
import type { SeerahEvent } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

/**
 * English corpus is statically imported with the `/seerah` route chunk.
 * Lazy `import()` left the hub empty/partial on first paint.
 */
export function isSeerahContentReady(): boolean {
  return true;
}

export async function ensureSeerahContent(): Promise<SeerahEvent[]> {
  return SEERAH_EVENTS as SeerahEvent[];
}

export function getSeerahEvents(): SeerahEvent[] {
  return localizeList(SEERAH_EVENTS as SeerahEvent[], overlayList("SEERAH_EVENTS"));
}
