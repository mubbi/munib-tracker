import type { HajjGuideSection } from "@munib-tracker/shared/types";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";

let cache: HajjGuideSection[] | undefined;
let inflight: Promise<HajjGuideSection[]> | undefined;

export function isHajjGuideContentReady(): boolean {
  return cache !== undefined;
}

export async function ensureHajjGuideContent(): Promise<HajjGuideSection[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = import("@munib-tracker/shared/content/hajj-guide").then(
      ({ HAJJ_GUIDE_SECTIONS }) => {
        cache = HAJJ_GUIDE_SECTIONS as HajjGuideSection[];
        return cache;
      },
    );
  }
  return inflight;
}

export function getHajjGuideSections(): HajjGuideSection[] {
  if (!cache) void ensureHajjGuideContent();
  return localizeList(cache ?? [], overlayList("HAJJ_GUIDE_SECTIONS"));
}
